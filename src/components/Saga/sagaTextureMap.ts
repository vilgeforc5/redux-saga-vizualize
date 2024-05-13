import * as THREE from 'three';
import { MeshBasicMaterial } from 'three';
import { ITextTexture, TextureMapSize } from '@/components/ActionList/textureMap';

export const sagaTextureMap: Record<TextureMapSize, ITextTexture> = {
	small: {
		geometry: new THREE.BoxGeometry(0.75, 0.75, 2),
		width: 256,
		aspectRatio: 2
	},
	medium: {
		geometry: new THREE.BoxGeometry(0.75, 0.75, 3),
		width: 312,
		aspectRatio: 6
	},
	big: {
		geometry: new THREE.BoxGeometry(0.75, 0.75, 5),
		width: 512,
		aspectRatio: 10
	},
	superBig: {
		geometry: new THREE.BoxGeometry(0.75, 0.75, 6.5),
		width: 712,
		aspectRatio: 12
	}
};

export const faceMaterialUser = new MeshBasicMaterial({ color: '#000470' });
