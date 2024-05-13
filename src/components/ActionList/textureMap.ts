import * as THREE from 'three';
import { MeshBasicMaterial } from 'three';

export interface ITextTexture {
	geometry: THREE.BoxGeometry;
	width: number;
	aspectRatio: number;
}

export type TextureMapSize = 'small' | 'medium' | 'big' | 'superBig';

export const textureMap: Record<TextureMapSize, ITextTexture> = {
	small: {
		geometry: new THREE.BoxGeometry(2, 0.75, 0.75),
		width: 256,
		aspectRatio: 2
	},
	medium: {
		geometry: new THREE.BoxGeometry(3, 0.75, 0.75),
		width: 312,
		aspectRatio: 6
	},
	big: {
		geometry: new THREE.BoxGeometry(5, 0.75, 0.75),
		width: 512,
		aspectRatio: 10
	},
	superBig: {
		geometry: new THREE.BoxGeometry(6.5, 0.75, 0.75),
		width: 712,
		aspectRatio: 12
	}
};

export const faceMaterialUser = new MeshBasicMaterial({ color: '#000470' });
