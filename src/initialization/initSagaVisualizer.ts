import { SagaMonitor } from 'redux-saga';
import { EnumEffectMessage, IConfig } from '@/types';
import { initializeRenderer } from '@/initialization/initializeRenderer';

export const sagaVisualizeSymbol = '@@sagaVisualizeSymbol';

export const initSagaVisualizer = (options: IConfig): SagaMonitor => {
	let renderWindow: Window | null = window;
	let renderWrapper: HTMLElement | null = null;

	if (options.renderPopup && !options.renderSelector) {
		renderWindow = window.open(
			'',
			'_blank',
			`height: ${window.innerHeight}; width: ${window.innerWidth}`
		);

		if (!renderWindow) {
			throw new Error('cannot open window');
		}

		renderWindow.document.body.setAttribute(
			'style',
			'width: 100vw; height: 100vh; padding: 0; margin: 0;'
		);
		renderWrapper = renderWindow.document.body;
	}

	if (options.renderSelector) {
		renderWrapper = window.document.querySelector(options.renderSelector);
	}

	if (!renderWrapper || !renderWindow) {
		throw new Error('chtoto poshlo ne tak...');
	}

	initializeRenderer(renderWrapper, renderWindow);

	return {
		actionDispatched(action) {
			try {
				renderWindow.postMessage(
					{
						type: EnumEffectMessage.ON_ACTION_DISPATCHED,
						payload: JSON.stringify(action),
						[sagaVisualizeSymbol]: sagaVisualizeSymbol
					},
					'*'
				);
			} catch (e) {
				console.warn('redux-saga-visualizer: Error received actionDispatched', e);
			}
		},
		effectTriggered(options) {
			renderWindow.postMessage(
				{
					type: EnumEffectMessage.EFFECT_TRIGGERED,
					payload: JSON.stringify(options),
					[sagaVisualizeSymbol]: sagaVisualizeSymbol
				},
				'*'
			);
		}
	};
};
