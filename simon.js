function check() { // this function checks to see if the user's inputted pattern is equal to the generated pattern

	if (keys.length == trueKeys.length) { //If length of generated pattern = length of user pattern
		if (keys.toString() == trueKeys.toString()) { //Change both arrays to strings and compare them
			isRunning = true; //Delcare that this function is running, used later
			$("#feedback").css("color", "rgb(28, 227, 37)") //Color green
			document.getElementById('feedback').innerHTML = "SUCCESS"; //Add success test
			setTimeout(function() { //Run this function after x amount of time
				synth.triggerAttackRelease("C5", "8n"); //Play the following 3 notes, success sound
				setTimeout(function() {
					synth.triggerAttackRelease("D5", "8n");
					setTimeout(function() {
						synth.triggerAttackRelease("G5", "8n");
					}, 250);
				}, 250);
			}, 300);
			setTimeout(function() { //run this function 1s
				pattern++; //Increment pattern (number of generated tones)
				level++; //Increment level
				pushLevel(); //Update the level on the page
				document.getElementById('feedback').innerHTML = "NEXT LEVEL - " + pattern.toString() + " TONES"; //Next level feedback pushed to page
				setTimeout(function() { //Run this function after 1s
					document.getElementById('feedback').innerHTML = ""; //reset feedback box
					generate(pattern); //generate a pattern
					display(pattern); //show the patern to the user
				}, 1500);
			}, 1000);
		} else { //if the two arrays are not the same
			isRunning = true; //Delcare that this function is running, used later
			$("#feedback").css("color", "rgb(241, 70, 46)") //Color feedback red
			document.getElementById('feedback').innerHTML = "FAIL"; // Update feedback box
			setTimeout(function() {
				synth.triggerAttackRelease("E3", "8n"); //play fail sound
				setTimeout(function() {
					synth.triggerAttackRelease("G3", "8n");
					setTimeout(function() {
						synth.triggerAttackRelease("E2", "8n");
					}, 250);
				}, 250);
			}, 300);
			setTimeout(function() { //run function after 1.5s
				document.getElementById('feedback').innerHTML = "TRY AGAIN"; //Update feedback box
				setTimeout(function() {
					document.getElementById('feedback').innerHTML = ""; //reset feedback box
					display(pattern); //display pattern
					keys = []; //reset user pattern
				}, 1500);
			}, 1500);
		}
	}
}

function pushLevel() { //push the level to the page
	document.getElementById('level').innerHTML = "Level " + level;
}

function pressButton(buttonClick) { //Handles button clicks
	if (buttonClick == 1) { //take button parameter, convert to HTML & CSS element names, as well as sounds
		var buttonClick = ".button1"
		var circle = ".redborder"
		var background = "backgroundred"
		var sound = "C4"
	} else if (buttonClick == 2) {
		var buttonClick = ".button2"
		var circle = ".greenborder"
		var background = "backgroundgreen"
		var sound = "D4"
	} else if (buttonClick == 3) {
		var buttonClick = ".button3"
		var circle = ".yellowborder"
		var background = "backgroundyellow"
		var sound = "E4"
	} else {
		var buttonClick = ".button4"
		var circle = ".blueborder"
		var background = "backgroundblue"
		var sound = "F4"
	};
	$(document).ready(function() { //run this function when everything is loaded
		$(buttonClick).toggleClass("active"); //add the active class to the button that was clicked
		if ($(circle).hasClass(background) == false) { //error checking to ensure the circle above the button is only colored in when button is active
			$(circle).toggleClass(background); //color circle
		}
		synth.triggerAttackRelease(sound, "8n"); //play sound associated with button
		setTimeout(function() {
			$(buttonClick).toggleClass('active'); //turn off button active class after 750ms
			if ($(circle).hasClass(background) == true) {
				$(circle).toggleClass(background);
			}
		}, 750);
	});
}

function generate(digits) { //generates random pattern in an array
	keys = []; //blank array for user pattern
	trueKeys = []; //blank array for computer pattern
	for (i = 0; i < digits; i++) { //generate pattern this long
		trueKeys.push(Math.floor(Math.random() * 4) + 1) //generate random num between 1 and 4
	};
}

function display(digits) { //display function, emulates button clicks using computer generated array using self calling function
	isRunning = true; //Tells other functions this function is running
	var i = 0; //  set counter to 1
	function myLoop() { //  create a loop function
		setTimeout(function() { //  call a 1s setTimeout when the loop is called
			pressButton(trueKeys[i])
			i++; //  increment the counter
			if (i < digits) { //  if the counter < 4, call the loop function
				myLoop(); //again which will trigger another 
			} else {
				setTimeout(function() {
					isRunning = false;
				}, 500);
			}
		}, 950)
	}
	myLoop();
}
//MAINLINE
var synth = new Tone.Synth().toMaster(); //Importing tone.js synth
var pattern = 4 //default pattern length
var keys = []; //initialize pattern array
var trueKeys = []; //initialize computer pattern array
var down = false; //button checking for if the button is pressed down
var isRunning = false; //initialize isRunning variable
var level = 1 //default level of 1
generate(pattern); //generate initial pattern

$(document).ready(function() { //handles when user clicks the buttons
	down = false; //says no buttons are pressed down
	$(".button1").mouseup(function() { //when user releases mouse over button
		if (!isRunning) { //check if display function is running
			if (down) { //if it's not, ensure button is pressed down
				$('.redborder').toggleClass('backgroundred'); //if so, toggle circle color
				$('.button1').toggleClass("active"); //toggle button animation
				down = false; //button is no longer pressed down
				check(pattern); //check if the pattern is the same as computer pattern
			}
		}
	});
	$(".button1").mousedown(function() { //when button is pressed down
		if (!isRunning) { //ensure display function isn't running
			$('.redborder').toggleClass('backgroundred'); //toggle circlecolor
			$('.button1').toggleClass("active"); //toggle button animation
			keys.push(1); //add element to array with value 1(because its button 1)
			synth.triggerAttackRelease("C4", "8n"); //play sound
			down = true; //tell the other functions that a button is pressed down
		}
	});
	$(".button1").mouseout(function() { //when mouse leaves a button
		if (!isRunning) { //ensure display function isn't running
			if (down) { //if it's not, ensure button is pressed down
				$('.redborder').toggleClass('backgroundred'); //toggle circle color
				$('.button1').toggleClass("active"); //toggle button animation
				down = false; //tell other functions button is no longer pressed down
				check(pattern); //check if the pattern is the same as computer pattern
			}
		}
	}); //BELOW IS THE SAME AS BUTTON 1 BUT FOR THE OTHER 3 BUTTONS
	$(".button2").mouseup(function() {
		if (!isRunning) {
			if (down) {
				$('.greenborder').toggleClass('backgroundgreen');
				$('.button2').toggleClass("active");
				down = false;
				check(pattern);
			}
		}
	});
	$(".button2").mousedown(function() {
		if (!isRunning) {
			$('.greenborder').toggleClass('backgroundgreen');
			$('.button2').toggleClass("active");
			down = true;
			keys.push(2);
			synth.triggerAttackRelease("D4", "8n");
		}
	});
	$(".button2").mouseout(function() {
		if (!isRunning) {
			if (down) {
				$('.greenborder').toggleClass('backgroundgreen');
				$('.button2').toggleClass("active");
				down = false;
				check(pattern);
			}
		}
	});
	$(".button3").mouseup(function() {
		if (!isRunning) {
			if (down) {
				$('.yellowborder').toggleClass('backgroundyellow');
				$('.button3').toggleClass("active");
				down = false;
				check(pattern);
			}
		}
	});
	$(".button3").mousedown(function() {
		if (!isRunning) {
			$('.yellowborder').toggleClass('backgroundyellow');
			$('.button3').toggleClass("active");
			down = true;
			keys.push(3);
			synth.triggerAttackRelease("E4", "8n");
		}
	});
	$(".button3").mouseout(function() {
		if (!isRunning) {
			if (down) {
				$('.yellowborder').toggleClass('backgroundyellow');
				$('.button3').toggleClass("active");
				down = false;
				check(pattern);
			}
		}
	});
	$(".button4").mouseup(function() {
		if (!isRunning) {
			if (down) {
				$('.blueborder').toggleClass('backgroundblue');
				$('.button4').toggleClass("active");
				down = false;
				check(pattern);
			}
		}
	});
	$(".button4").mousedown(function() {
		if (!isRunning) {
			$('.blueborder').toggleClass('backgroundblue');
			$('.button4').toggleClass("active");
			down = true;
			keys.push(4);
			synth.triggerAttackRelease("F4", "8n");
		}
	});
	$(".button4").mouseout(function() {
		if (!isRunning) {
			if (down) {
				$('.blueborder').toggleClass('backgroundblue');
				$('.button4').toggleClass("active");
				down = false;
				check(pattern);
			}
		}
	}); //END OF USER BUTTONS
});
$('html').click(function(e) { //Reset button (will be usefull later)
	if ($(e.target).hasClass('reset') && isRunning == false) { //if user clicks reset button and display function is not running

		//Uncomment this to enable pattern logging
		//keys.forEach(function(item, index, array) {
		//    console.log(item);
		//});

		keys = []; //reset user pattern
		display(pattern); //display pattern
	}
	if ($(e.target).hasClass('start')) { //when use clicks start button
		$(".init").css("display", "none") //hide init
		$(".main").css("display", "flex") //show main
		pushLevel(); //push level to page
		setTimeout(function() {
			display(pattern); //after some delay, show pattern
		}, 200);

	}
});
