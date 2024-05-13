export const createTextCanvas = (
	width: number,
	height: number,
	text: string,
	addBorder = false,
	textColor = 'white',
	backgroundColor = 'blue'
): HTMLCanvasElement => {
	const canvas = document.createElement('canvas');

	canvas.width = width;
	canvas.height = height;

	const ctx = canvas.getContext('2d');

	if (!ctx) {
		throw new Error('createTextCanvas: couldnt get context2d');
	}

	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.font = '24px monospace';
	ctx.letterSpacing = '4px';
	const textMetrics = ctx.measureText(text);

	const textWidth = textMetrics.width;
	const textHeight = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;

	const scaleX = width / textWidth;
	const scaleY = height / textHeight;

	ctx.scale(scaleX, scaleY);

	ctx.textBaseline = 'top';
	ctx.fillStyle = textColor;

	if (addBorder) {
		ctx.strokeStyle = 'red';

		ctx.strokeRect(0, 0, textWidth, textHeight);
	}
	ctx.fillText(text, 0, 6);

	return canvas;
};
