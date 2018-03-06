var pieces, radius, fft, mapMouseX, mapMouseY, toggleBtn, audio, uploadBtn, uploadedAudio, uploadAnim;
var colorPalette = ["#000", "rgba(22, 59, 72, 0.5)", "#00a6e0", "#002a38"];
var uploadLoading = false;

function preload() {
	audio = loadSound("audio/DEMO_1.mp3");
}


function uploaded(file) {
	uploadLoading = true;
	uploadedAudio = loadSound(file.data, uploadedAudioPlay);
}


function uploadedAudioPlay(audioFile) {

	uploadLoading = false;

	if (audio.isPlaying()) {
		audio.pause();
	}

	audio = audioFile;
	audio.loop();
}


function setup() {

	uploadAnim = select('#uploading-animation');

	createCanvas(windowWidth, windowHeight);

	toggleBtn = createButton("Play / Pause");

	uploadBtn = createFileInput(uploaded);

	uploadBtn.addClass("upload-btn");

	toggleBtn.addClass("toggle-btn");
	
	toggleBtn.mousePressed(toggleAudio);


	fft = new p5.FFT();

	audio.loop();

}

function draw() {

	// Add a loading animation for the uploaded track
	if (uploadLoading) {
		uploadAnim.addClass('is-visible');
	} else {
		uploadAnim.removeClass('is-visible');
	}

	background(colorPalette[0]);

	noFill();

	fft.analyze();

	var bass = fft.getEnergy("bass");
	var treble = fft.getEnergy("treble");
	var mid = fft.getEnergy("mid");

	var mapMid = map(mid, 0, 255, -radius, radius);
	var scaleMid = map(mid, 0, 255, 1, 1.5);

	var mapTreble = map(treble, 0, 255, -radius, radius);
	var scaleTreble = map(treble, 0, 255, 1, 1.5);

	var mapbass = map(bass, 0, 255, -100, 800);
	var scalebass = map(bass, 0, 255, 0, 0.8);

	mapMouseX = map(mouseX, 0, width, 4, 10);
	mapMouseY = map(mouseY, 0, height, windowHeight / 4, windowHeight);

	pieces = mapMouseX;
	radius = mapMouseY;

	translate(windowWidth / 2, windowHeight / 2);

	strokeWeight(1);

	for (i = 0; i < pieces; i += 0.5) {

		rotate(TWO_PI / pieces);


		/*----------  BASS  ----------*/
		push();
		strokeWeight(5);
		stroke(colorPalette[1]);
		scale(scalebass);
		rotate(frameCount * -0.5);
		line(mapbass, radius / 2, radius, radius);
		line(-mapbass, -radius / 2, radius, radius);
		pop();



		/*----------  MID  ----------*/
		push();
		strokeWeight(0.5);
		stroke(colorPalette[2]);
		scale(scaleMid);
		line(mapMid, radius / 2, radius, radius);
		line(-mapMid, -radius / 2, radius, radius);
		pop();


		/*----------  TREMBLE  ----------*/
		push();
		stroke(colorPalette[3]);
		scale(scaleTreble);
		line(mapTreble, radius / 2, radius, radius);
		line(-mapTreble, -radius / 2, radius, radius);
		pop();

	}

}


function toggleAudio() {
	if (audio.isPlaying()) {
		audio.pause();
	} else {
		audio.play();
	}
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}