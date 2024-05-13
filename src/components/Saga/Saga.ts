import { Mesh, MeshBasicMaterial, Object3D, Texture, Vector3 } from 'three';
import { ITextTexture, textureMap } from '@/components/ActionList/textureMap';
import { EffectTriggeredMessage } from '@/types';
import { createTextCanvas } from '@/components/ActionList/createTextCanvas';
import { sagaTextureMap } from '@/components/Saga/sagaTextureMap';
import { PerspectiveCameraAdapter } from '@/PerspectiveCameraAdapter';

interface ISaga {
	id: number;
	status: 'running' | 'ended';
	name: string;
}

export interface IEffectBox {
	meshId: number;
	position: Vector3;
	parentId: number;
	id: number;
	textureMetadata: ITextTexture;
	text: string;
}

export class Saga implements ISaga {
	status: ISaga['status'];
	private gap = 2;
	private readonly effectsList: IEffectBox[] = [];
	readonly wrapper: Object3D;

	constructor(
		readonly name: string,
		readonly id: number,
		readonly parentId: number,
		private initPosition: [number, number, number],
		private readonly camera: PerspectiveCameraAdapter
	) {
		this.status = 'running';
		const wrapper = new Object3D();

		wrapper.position.set(...initPosition);

		const initialText = `Saga-${name}`;

		let textureMetadata: ITextTexture;
		if (initialText.length < 15) {
			textureMetadata = textureMap.medium;
		} else if (initialText.length < 25) {
			textureMetadata = textureMap.big;
		} else {
			textureMetadata = textureMap.superBig;
		}

		const canvas = createTextCanvas(
			textureMetadata.width,
			textureMetadata.width / textureMetadata.aspectRatio,
			initialText
		);

		const textureText = new Texture(canvas);
		textureText.needsUpdate = true;

		const textureMaterial = new MeshBasicMaterial({ map: textureText });
		const mesh = new Mesh(textureMetadata.geometry, [
			textureMaterial,
			textureMaterial,
			textureMaterial,
			textureMaterial,
			textureMaterial,
			textureMaterial
		]);

		wrapper.add(mesh);

		this.effectsList.push({
			id,
			parentId,
			meshId: mesh.id,
			position: new Vector3(...initPosition),
			text: initialText,
			textureMetadata
		});

		this.wrapper = wrapper;
	}

	addEffectBox(data: EffectTriggeredMessage['payload']) {
		const dataText = data.effect.type + ' ' + JSON.stringify(data.effect.payload.args);

		let textureMetadata: ITextTexture;
		if (dataText.length < 15) {
			textureMetadata = sagaTextureMap.medium;
		} else if (dataText.length < 25) {
			textureMetadata = sagaTextureMap.big;
		} else {
			textureMetadata = sagaTextureMap.superBig;
		}

		const canvas = createTextCanvas(
			textureMetadata.width,
			textureMetadata.width / textureMetadata.aspectRatio,
			dataText
		);

		const textureText = new Texture(canvas);
		textureText.needsUpdate = true;

		const textureMaterial = new MeshBasicMaterial({ map: textureText });

		const mesh = new Mesh(textureMetadata.geometry, [
			textureMaterial,
			textureMaterial,
			textureMaterial,
			textureMaterial,
			textureMaterial,
			textureMaterial
		]);

		const lastItem = this.effectsList.at(-1);
		let newPosition: Vector3 | undefined;

		if (lastItem) {
			newPosition = new Vector3(0, 0, lastItem.position.z - 6);
		} else {
			newPosition = this.wrapper.position;
		}

		mesh.position.set(newPosition.x, newPosition.y, newPosition.z);

		this.effectsList.push({
			meshId: mesh.id,
			position: newPosition,
			textureMetadata: textureMetadata,
			text: dataText,
			parentId: data.parentEffectId,
			id: data.effectId
		});

		this.wrapper.add(mesh);

		//@ts-ignore
		mesh.on('click', () => {
			this.camera.position.set(this.initPosition[0] - 5, this.initPosition[1], newPosition.z);
			this.camera.lookAt(this.initPosition[0], this.initPosition[1], newPosition.z);
		});
	}

	get items() {
		return this.effectsList;
	}
}
