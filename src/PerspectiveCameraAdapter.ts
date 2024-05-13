import { PerspectiveCamera } from 'three';

export class PerspectiveCameraAdapter extends PerspectiveCamera {
	public isActive = false;
	private defaultMoveDistance = 2;

	constructor(
		options: ConstructorParameters<typeof PerspectiveCamera>,
		private readonly targetWindow: Window
	) {
		super(...options);
	}

	move(direction: 'x' | 'y' | 'z', pos: 1 | -1 = 1, distance?: number) {
		const movement = { x: 0, y: 0, z: 0 };

		if (direction === 'x') {
			movement.x = pos * (distance || this.defaultMoveDistance);
		} else if (direction === 'y') {
			movement.y = pos * (distance || this.defaultMoveDistance);
		} else if (direction === 'z') {
			movement.z = pos * (distance || this.defaultMoveDistance);
		}

		return this.position.add(movement);
	}

	public addListeners() {
		this.addKeyboardListener();
		this.addScrollListener();
	}

	private addKeyboardListener() {
		this.targetWindow.addEventListener('keydown', (e) => {
			switch (e.keyCode) {
				case 38:
				case 87: {
					this.move('y', 1);

					return;
				}
				case 39:
				case 68: {
					this.move('x', 1);

					return;
				}
				case 40:
				case 83: {
					this.move('y', -1);

					return;
				}
				case 37:
				case 65: {
					this.move('x', -1);

					return;
				}
			}
		});
	}

	private addScrollListener() {
		this.targetWindow.addEventListener('wheel', (event) => {
			if (event.deltaY < 0) {
				this.move('z', -1);
			} else if (event.deltaY > 0) {
				this.move('z', 1);
			}
		});
	}
}
