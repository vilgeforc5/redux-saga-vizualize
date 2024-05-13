import { Object3D, Scene, WebGLRenderer } from 'three';
import { PerspectiveCameraAdapter } from '@/PerspectiveCameraAdapter';
import { animationFrameScheduler, buffer, filter, fromEvent, map, observeOn, Subject } from 'rxjs';
import {
	ActionDispatchMessage,
	EffectMessage,
	EffectMessageData,
	EffectTriggeredMessage,
	EnumEffectMessage
} from '@/types';
import { sagaVisualizeSymbol } from '@/initialization/initSagaVisualizer';
import { ActionBoxList, IActionBox } from '@/components/ActionList/ActionBoxList';
//@ts-ignore
import Interaction from 'three.interaction/src/interaction/Interaction.js';
import { Saga } from '@/components/Saga/Saga';
import { SagaMap } from '@/components/Saga/SagaMap';

export function initializeRenderer(renderWrapper: HTMLElement, renderWindow: Window) {
	const messageEventObservable = fromEvent<MessageEvent<EffectMessage>>(
		renderWindow,
		'message'
	).pipe(
		map(
			(event): EffectMessageData => ({
				...event.data,
				payload: JSON.parse(event.data.payload) as any
			})
		),
		filter(
			(data) =>
				//@ts-ignore
				data[sagaVisualizeSymbol] === sagaVisualizeSymbol
		)
	);

	const eventsSubject = new Subject<EffectMessageData>();

	const actionsProceeded = new Subject<void>();
	const effectsProceeded = new Subject<void>();

	eventsSubject
		.pipe(
			filter(
				(effect): effect is ActionDispatchMessage =>
					effect.type === EnumEffectMessage.ON_ACTION_DISPATCHED
			),
			buffer(actionsProceeded)
		)
		.subscribe((actions) => {
			actions.forEach((action) => actionList.add(action.payload.type, 'user'));

			effectsProceeded.next();
		});

	eventsSubject
		.pipe(
			filter(
				(effect): effect is EffectTriggeredMessage =>
					effect.type === EnumEffectMessage.EFFECT_TRIGGERED
			),
			buffer(effectsProceeded),
			observeOn(animationFrameScheduler)
		)
		.subscribe((effects) => {
			effects.forEach(({ payload }) => {
				const effectType = payload.effect.type;

				if (
					effectType === 'FORK' &&
					payload.effect?.payload &&
					payload.effect?.payload.args &&
					actionList.items.length > 0
				) {
					//@ts-ignore
					const sagaTakenActions = payload.effect.payload.args.map((arg) => {
						if (!arg) {
							return;
						}

						if (typeof arg === 'string') {
							return arg;
						}

						if (typeof arg === 'object' && arg.hasOwnProperty('type')) {
							return arg.type;
						}
					});

					let foundAction: IActionBox | undefined;
					for (let i = actionList.items.length - 1; i >= 0; i--) {
						if (sagaTakenActions.includes(actionList.items[i].text)) {
							foundAction = actionList.items[i];

							break;
						}
					}
					if (!foundAction) {
						return;
					}

					foundAction.sagaCount += 1;
					const posY =
						foundAction.textureMetadata.geometry.parameters.height +
						foundAction.sagaCount * 2.5;
					const saga = new Saga(
						foundAction.text,
						payload.effectId,
						payload.parentEffectId,
						[foundAction.position.x, foundAction.position.y + posY, 0],
						cameraAdapter
					);

					SagaMap.set(saga.id, saga);
					scene.add(saga.wrapper);

					return;
				}

				const foundSaga = SagaMap.get(payload.parentEffectId);
				if (foundSaga) {
					foundSaga.addEffectBox(payload);
				}
			});

			mainRender();
			actionsProceeded.next();
		});

	messageEventObservable.subscribe(eventsSubject);

	const renderer = new WebGLRenderer({
		antialias: true
	});

	const cameraAdapter = new PerspectiveCameraAdapter(
		[75, renderWrapper.clientWidth / renderWrapper.clientHeight, 0.1, 100],
		renderWindow
	);

	const scene = new Scene();
	scene.add(cameraAdapter);

	const actionList3D = new Object3D();
	const actionList = new ActionBoxList(actionList3D, cameraAdapter);

	scene.add(actionList3D);
	new Interaction(renderer, scene, cameraAdapter);

	cameraAdapter.addListeners();
	cameraAdapter.position.z = 7;

	function mainRender() {
		renderer.render(scene, cameraAdapter);
	}

	setTimeout(() => {
		renderer.domElement.style.background = 'black';
		renderer.setPixelRatio(renderWindow.devicePixelRatio || 2);

		renderer.setSize(renderWrapper.clientWidth, renderWrapper.clientHeight);
		cameraAdapter.aspect = renderWrapper.clientWidth / renderWrapper.clientHeight;
		cameraAdapter.updateProjectionMatrix();

		renderWrapper.appendChild(renderer.domElement);
		actionsProceeded.next();

		renderWindow.addEventListener('resize', () => {
			renderer.setSize(renderWrapper.clientWidth, renderWrapper.clientHeight);
			cameraAdapter.aspect = renderWrapper.clientWidth / renderWrapper.clientHeight;
			cameraAdapter.updateProjectionMatrix();
		});
	}, 250);
}
