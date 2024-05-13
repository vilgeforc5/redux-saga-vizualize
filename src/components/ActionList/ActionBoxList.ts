import {
	BufferGeometry,
	Line,
	LineBasicMaterial,
	Mesh,
	MeshBasicMaterial,
	Object3D,
	Texture,
	Vector3
} from 'three';
import { faceMaterialUser, ITextTexture, textureMap } from '@/components/ActionList/textureMap';
import { createTextCanvas } from '@/components/ActionList/createTextCanvas';
import { PerspectiveCameraAdapter } from '@/PerspectiveCameraAdapter';

export interface IActionBox {
	position: Vector3;
	id: number;
	textureMetadata: ITextTexture;
	type: 'user' | 'internal';
	text: string;
	sagaCount: number;
}

export class ActionBoxList {
	private readonly list: IActionBox[] = [];
	private readonly gap = 2;

	constructor(
		private readonly wrapper: Object3D,
		private readonly camera: PerspectiveCameraAdapter
	) {}

	add(text: string, type: IActionBox['type']) {
		let textureMetadata: ITextTexture;

		if (text.length < 15) {
			textureMetadata = textureMap.medium;
		} else if (text.length < 25) {
			textureMetadata = textureMap.big;
		} else {
			textureMetadata = textureMap.superBig;
		}

		const canvas = createTextCanvas(
			textureMetadata.width,
			textureMetadata.width / textureMetadata.aspectRatio,
			text,
			type === 'user'
		);

		const textureText = new Texture(canvas);
		textureText.needsUpdate = true;

		const textureMaterial = new MeshBasicMaterial({ map: textureText });

		const mesh = new Mesh(textureMetadata.geometry, [
			faceMaterialUser,
			faceMaterialUser,
			faceMaterialUser,
			faceMaterialUser,
			textureMaterial,
			faceMaterialUser
		]);
		mesh.add(this.createConnectionLine(textureMetadata.geometry.parameters.width * 0.5));

		const lastItem = this.list.at(-1);
		let newPosition: Vector3 | undefined;

		if (lastItem) {
			const lastItemWidth = lastItem.textureMetadata.geometry.parameters.width;
			const currentWidth = textureMetadata.geometry.parameters.width;

			const posX = (lastItemWidth + currentWidth) * 0.5 + this.gap;

			newPosition = lastItem.position.clone().add(new Vector3(posX, 0, 0));
		} else {
			newPosition = this.wrapper.position;
		}

		mesh.position.set(newPosition.x, newPosition.y, newPosition.z);

		this.list.push({
			id: mesh.id,
			position: newPosition,
			textureMetadata: textureMetadata,
			type,
			text,
			sagaCount: 0
		});

		this.wrapper.add(mesh);

		//@ts-ignore
		mesh.on('click', () => {
			this.camera.position.set(newPosition.x, 0, 7);
			this.camera.lookAt(newPosition.x, 0, 7);
		});
	}

	private createConnectionLine(boxWidth: number) {
		const material = new LineBasicMaterial({
			color: 'white'
		});

		const points = [];
		points.push(new Vector3(boxWidth, 0, 0));
		points.push(new Vector3(boxWidth + this.gap, 0, 0));

		const geometry = new BufferGeometry().setFromPoints(points);

		return new Line(geometry, material);
	}

	get items() {
		return this.list;
	}
}
