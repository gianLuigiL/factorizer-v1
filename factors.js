(function init(){
	'use strict';
	const form = document.forms[0];	
	const label = document.getElementsByTagName('label')[0];
	const input = form.elements[0];
	const startButton = form.elements[1];
	const reloadButton = form.elements[2];
	//Get the element where to put estimated remaining time
	const eta = document.getElementById('eta');
	//Element whre warnings appear
	const hint = document.getElementById('hint');
	//Element where results are pushed
	const factors = document.getElementById('factors');

	//Remove warnings
	function removeHint(){
		hint.textContent = "";
	}
	//Add warnings
	function addHint(message){
		hint.textContent = message;
	}
	//Add estimated time warnings
	function addEta(message){
		eta.textContent = message;
	}
	
	input.addEventListener('input', function(){
		//Allowed characters array
		const allowed = [..."1234567890"];
		//Filter the value and returns only the allowed characters
		this.value = [...this.value].filter(el => allowed.includes(el)).join('');
		//Based on the length of the value give an estimate of the ETA
		switch(this.value.length){
			//Give hints and ETA for various values
			case 0:
				addEta('Estimated Time: N/A.');
				addHint('The number must start from 2.');
				break;
			case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8:
				addEta('Estimated Time: Now.');
				if(this.value < 2) {
					addEta('Estimated Time: N/A.');
					addHint('The number must start from 2.');
				} else {
					addEta('Estimated Time: Right now.');
					removeHint();
				}
				break;
			case 9: case 10: case 11:
				removeHint();
				addEta('Estimated Time: Might take couple of seconds.');
				break;
			case 12: case 13: case 14:
				removeHint();
				addEta('Estimated Time: Bear with me, it\'ll be fast.');
				break;
			case 15: case 16: case 17:
				removeHint();
				addEta('Estimated Time: You might wanna get a break in the meantime.');
				break;
			case 18: case 19:
				removeHint();
				addEta('Estimated Time: Might keep you busy for the next several minutes.');
				addHint('\u26a0 The browser might crash if it runs out of memory.');
				break;
			case 20: case 21:
				removeHint();
				addEta('Estimated Time: Be aware you\'ll be late for work tomorrow.');
				addHint('\u26a0\u2622 High risk the browser will crash without notice.');
				break;
			case 22:
				removeHint();
				addEta('Estimated Time: Be aware you\'ll be late for work tomorrow.');
				addHint('\u26a0\u2622 High risk the browser will crash without notice. You\'ve reached the maximum length');
				break;
		  }
	});
	
	form.addEventListener('submit', function(event){
		//Prevent reload
		event.preventDefault();
		//Transform into a number
		const number = +input.value;
		//If the form is submitted with an invalid value return
		if(number < 2){
			factors.textContent = "";
			return;
		}
		//Get elements to show progress
		const loadStatus = document.getElementById('loadStatus');
		const percentage = document.getElementById('percentage');

		let results = [];
		//Starting number
		let actual = 2;
		function factorsOf(number){
			//Only go up the square root
			let max = Math.sqrt(number);
			setTimeout(function getFactors(){
				//Compute in chunks of 100k
				for(let i = 0; i < 10000000 && actual <= max; i++, actual++ ){
					//If number is a factor add it to the results
					if(number % actual === 0){
						results.push(actual);
						//If it's not the square root add it to the results (avois duplicates)
						if(number / actual !== actual){
							results.push(number / actual);
						}
					}
				}
				//If it hasn't reached the square root
				if(actual < max){
					//Get the percentage of completion
					let currentPercentage = parseInt((actual * 100) / max);
					//Size the loading bar accordingly
					loadStatus.style.width = currentPercentage + '%';
					//Display the percentage
					percentage.textContent = currentPercentage + " %";
					//Run the function again
					setTimeout(getFactors, 0);
				} else {
					//If it has reached the end of the loop
					//Hide the bar
					const loadBar = document.getElementById('loadBar');
					loadBar.style.display = 'none';
					//Display the submit button
					startButton.style.display = 'inline-block';
					reloadButton.style.display = 'none';
					//Edge doesn't animate correctly
					if (!(/Edge/.test(navigator.userAgent))) {
					label.classList.remove('disabled');
					}
					//Restore input
					input.disabled = false;
					//Empty eventual results from previous computations
					factors.innerHTML = "";
					//If no results were found display prime num message
					if(results.length === 0){
						factors.textContent = number + " is a prime number.";
					} else {
						//Otherwise sort the results and dislay
						results.sort((a,b)=>a-b);
						results.forEach(el => {
						let factor = document.createElement('span');
						factor.classList.add('factor');
						//This add a separator so they can be selected and copied
						factor.textContent = el+"\n";
						//display
						factors.appendChild(factor);
					});
					}
				}
			}, 0);	
		}
		factorsOf(number);
	});
	
	startButton.addEventListener('click', function(event){
		//When the submit is pressed
		const loadBar = document.getElementById('loadBar');
		//If the value is invalid or the value is too short for a sensible animation return
		if(input.value.length === 0){
			event.preventDefault();
			return;
		}
		if(input.value.length < 9){
			return;
		}
		if (!(/Edge/.test(navigator.userAgent))) {
			label.classList.add('disabled');
		}
		//Disable the input
		input.disabled = true;
		//Hide the button
		startButton.style.display = 'none';
		//Display reload button
		reloadButton.style.display = 'inline-block';
		//Display loading bar
		loadBar.style.display = 'block';
	});
	//Interrupts and reload the page
	reloadButton.addEventListener('click', function(){
		location.reload(true);
	});
})();


