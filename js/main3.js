var pieces, radius, fft, mapMouseX, mapMouseY, audio, toggleBtn, uploadBtn, uploadedAudio, uploadAnim;
var bgColor = "#0c0f27";
var bassColor = ["#313e9b", "#1200b3"];
var midColor = "#da1500";
var trembleColor = "#728d0d";
var uploadLoading = false;

function preload() {
	audio = loadSound("audio/DEMO_3.mp3");
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
	pieces = 30;
	radius = windowHeight / 4;

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
	// -----------------------------------------------
	if (uploadLoading) {
		uploadAnim.addClass('is-visible');
	} else {
		uploadAnim.removeClass('is-visible');
	}

	background(bgColor);
	strokeWeight(1);

	fft.analyze();

	var bass = fft.getEnergy("bass");
	var treble = fft.getEnergy(50, 110);
	var mid = fft.getEnergy("mid");

	var mapMid = map(mid, 0, 255, -radius, radius);
	var scaleMid = map(mid, 0, 255, 1, 1.5);

	var mapTreble = map(treble, 0, 255, -radius / 2, radius * 2);
	var scaleTreble = map(treble, 0, 255, 0.5, 2);

	var mapbass = map(bass, 0, 255, 0, 200);
	var scalebass = map(bass, 0, 255, 0, 0.8);

	mapMouseX = map(mouseX, 0, width, 100, 200);
	mapMouseScale = map(mouseX, 0, width, 0.35, 0.2);
	mapMouseY = map(mouseY, 0, height, windowHeight / 4, windowHeight);

	pieces = 9;
	radius = 200;

	translate(windowWidth / 2, windowHeight / 2);

	for (i = 0; i < pieces; i += 1) {

		rotate(TWO_PI / pieces);

		noFill();


		/*----------  BASS  ----------*/
		push();
		strokeWeight(8);
		stroke(bassColor[0]);
		scale(scalebass + mapMouseScale);
		rotate(-frameCount * 0.05);
		point(mapbass, radius / 2);
		stroke(bassColor[1]);
		strokeWeight(2.2);
		line(mapMouseX, mouseY, radius, radius);
		pop();



		/*----------  MID  ----------*/
		push();
		stroke(midColor);
		strokeWeight(4);
		rotate(-frameCount * 0.01);
		point(mapMid, radius);
		pop();


		/*----------  TREMBLE  ----------*/
		push();
		stroke(trembleColor);
		strokeWeight(4);
		scale(scaleTreble);
		rotate(frameCount * 0.01);
		point(-100, radius / 2);
		point(100, radius / 2);
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