let a,
	b,
	x_val = [],
	y_val = [],
	temp = 100;
let canvas1 = document.getElementById('linearReg'),
	width = canvas1.width,
	height = canvas1.height;
a = tf.variable(tf.scalar(Math.random(0, 500)));
b = tf.variable(tf.scalar(Math.random(0, 500)));
const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);

function predict(x_val) {
	return tf.tidy(() => {
		const xs = tf.tensor1d(x_val);
		return xs.mul(a).add(b);
	});
}

function loss(pred, label) {
	return pred
		.sub(label)
		.square()
		.mean();
}
function map(n, start1, stop1, start2, stop2) {
	return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function mousePressed(e) {
	let x = map(e.clientX, 0, width, 0, 1),
		y = map(e.clientY, 0, height, 1, 0);
	x_val.push(x);
	y_val.push(y);
}

function draw() {
	tf.tidy(() => {
		if (x_val.length > 0) {
			const ys = tf.tensor1d(y_val);
			optimizer.minimize(() => loss(predict(x_val), ys));
		}
	});
	const ctx = canvas1.getContext('2d');
	ctx.clearRect(0, 0, width, height);
	for (let i = 0; i < x_val.length; i++) {
		let x = map(x_val[i], 0, 1, 0, width),
			y = map(y_val[i], 0, 1, height, 0);
		ctx.fillStyle = 'white';
		ctx.fillRect(x, y, 5, 5);
	}
	const lineX = [0, 1];

	const ys = tf.tidy(() => predict(lineX));
	let lineY = ys.dataSync();
	ys.dispose();
	let x1 = map(lineX[0], 0, 1, 0, width);
	let x2 = map(lineX[1], 0, 1, 0, width);

	let y1 = map(lineY[0], 0, 1, height, 0);
	let y2 = map(lineY[1], 0, 1, height, 0);
	ctx.strokeStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}
