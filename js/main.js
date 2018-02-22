//get form
var form = document.getElementById("calc");
var systemType = 0;
var setTime;
var tickAudio = new Audio("sound/tick.mp3");
// var startTimer;

// this function will detect the system being use
function updateSystemType() {
    // getting system type 0 Metric System or 1 for Imperial
    systemType = parseInt(form.elements["system"].value);

    // height and weight
    var height = parseFloat(form.elements["h"].value);
    var weight = parseFloat(form.elements["w"].value);

    if (systemType == 0) {
        // Metric System was selected
        console.log("Metric System");
        document.getElementById("systemType").innerHTML = "<b>Metric System</b>";
        document.getElementById("altura").innerHTML = "Centimeters";
        document.getElementById("peso").innerHTML = "Kilograms";

        // updating values to be display in metric system from imperial
        if (height || weight !== 0) {
            // display from inches to centimeters
            form.elements["h"].value = (height * 2.54 + 0.01).toFixed(2);
            // display from pounds to kg
            form.elements["w"].value = (weight * 0.453592).toFixed(2);
        }
    }
    else {
        // Imperial System was selected
        console.log("Imperial System");
        document.getElementById("systemType").innerHTML = "<b>Imperial System</b>";
        document.getElementById("altura").innerHTML = "Inches";
        document.getElementById("peso").innerHTML = "Pounds";

        // updating values to be display in imperial system from metric
        if (height || weight !== 0) {
            // display from centimeters to inches
            form.elements["h"].value = (height * 0.393701).toFixed(2);
            // display from kg to pounds
            form.elements["w"].value = (weight * 2.20462).toFixed(2);
        }
    }
}

function calcVO2max() {
    //get all numbers
    //  [3.0143 + 1.1585 x sex – 0.0268 x (P1/height) + 118.7611 x [(P2-P3)/age^3] / weight x 1000
    var sexValue = parseInt(form.elements["sex"].value);
    var height = parseFloat(form.elements["h"].value);
    var weight = parseFloat(form.elements["w"].value);
    var age = parseInt(form.elements["a"].value);
    var P1 = parseInt(form.elements["P1"].value);
    var P2 = parseInt(form.elements["P2"].value);
    var P3 = parseInt(form.elements["P3"].value);

    // 0 Metric System or 1 for Imperial
    if (systemType == 0) {
        // Metric System was selected
        console.log("Metric System was selected");
        // from centimeters to meters
        height = height / 100;
        console.log("height in meters " + height);
        console.log("weight in kg " + weight);
    }
    else {
        // Imperial System was selected
        console.log("Imperial System was selected");
        // from inches to meters
        height = height * 0.0254;
        // from pounds to kilograms
        weight = weight * 0.453592;
        console.log("height in meters " + height);
        console.log("weight in kg " + weight);

    }

    console.log("age in years " + age);
    console.log("sex value " + sexValue);
    console.log("p1 " + P1);
    console.log("p2 " + P2);
    console.log("p3 " + P3);

    var age3 = Math.pow(age, 3);
    console.log("age^3 " + age3);


    // Modave's formula
    var result = [3.0143 + 1.1585 * sexValue - 0.0268 * (P1/height) + 118.7611 * ((P2 - P3)/age3)]/weight * 1000;

    document.getElementById("result").innerHTML = result.toFixed(2).toString();

    console.log("this is result " + result.toString());
}

// this function is use to show in real time how the formula value gets filled
function updateOutput() {
    document.getElementById("sex").innerHTML = form.elements["sex"].value;
    document.getElementById("P1").innerHTML = form.elements["P1"].value;
    document.getElementById("height").innerHTML = form.elements["h"].value;
    document.getElementById("P2").innerHTML = form.elements["P2"].value;
    document.getElementById("P3").innerHTML = form.elements["P3"].value;
    document.getElementById("age").innerHTML = form.elements["a"].value;
    document.getElementById("weight").innerHTML = form.elements["w"].value;
}
/*
=====================Timer=======================
*/
document.getElementById('timer').innerHTML = 01 + ":" + 0 + 0;

function startTimerF() {
    var presentTime = document.getElementById('timer').innerHTML;
    var timeArray = presentTime.split(/[:]+/);
    var m = timeArray[0];
    var s = checkSecond((timeArray[1] - 1));

    if(s==59) {
        m=m-1
    }

    if(m<0) {
        alert('Rest period was completed.');
        document.getElementById('timer').innerHTML = 01 + ":" + 0 + 0;
    }
    else {
        document.getElementById('timer').innerHTML = m + ":" + s;
        setTimeout(startTimerF, 1500);
    }
}

function checkSecond(sec) {
    if (sec < 10 && sec >= 0) {
        sec = "0" + sec
    }; // add zero in front of numbers < 10

    if (sec < 0) {
        sec = "59"
    };

    return sec;
}

function stopTimerF() {
    location.reload();
}

// Simple Timer

//circle start
let progressBar = document.querySelector('.e-c-progress');
let indicator = document.getElementById('e-indicator');
let pointer = document.getElementById('e-pointer');
let length = Math.PI * 2 * 100;

progressBar.style.strokeDasharray = length;

function update(value, timePercent) {
    var offset = - length - length * value / (timePercent);
    progressBar.style.strokeDashoffset = offset; 
    pointer.style.transform = `rotate(${360 * value / (timePercent)}deg)`; 
};

//circle ends
const displayOutput = document.querySelector('.display-remain-time')
const pauseBtn = document.getElementById('pause');
const setterBtns = document.querySelectorAll('button[data-setter]');

let intervalTimer;
let timeLeft;
let wholeTime = 0.5 * 90; // manage this to set the whole time 
let isPaused = false;
let isStarted = false;


update(wholeTime,wholeTime); //refreshes progress bar
displayTimeLeft(wholeTime);

function changeWholeTime(seconds){
  if ((wholeTime + seconds) > 0){
    wholeTime += seconds;            
    update(wholeTime,wholeTime);
  }
}

function timer (seconds){ //counts time, takes seconds
  let remainTime = Date.now() + (seconds * 1000);
  displayTimeLeft(seconds);
  
  intervalTimer = setInterval(function(){
    timeLeft = Math.round((remainTime - Date.now()) / 1000); 
    if(timeLeft < 0) {
      clearInterval(intervalTimer);
      isStarted = false;
      setterBtns.forEach(function(btn){
        btn.disabled = false;
        btn.style.opacity = 1;
      });
      displayTimeLeft(wholeTime);
      pauseBtn.classList.remove('pause');
      pauseBtn.classList.add('play');
      return ;
    }
    displayTimeLeft(timeLeft);
    tickAudio.pause();
    tickAudio.currentTime = 0;
    tickAudio.play();
  }, 1000);
}
function pauseTimer(event){
  if(isStarted === false){
    timer(wholeTime);
    isStarted = true;
    this.classList.remove('play');
    this.classList.add('pause');
    
    setterBtns.forEach(function(btn){
      btn.disabled = true;
      btn.style.opacity = 0.5;
    });

  }else if(isPaused){
    this.classList.remove('play');
    this.classList.add('pause');
    timer(timeLeft);
    isPaused = isPaused ? false : true
  }else{
    this.classList.remove('pause');
    this.classList.add('play');
    clearInterval(intervalTimer);
    isPaused = isPaused ? false : true ;
  }
}

function displayTimeLeft (timeLeft){ //displays time on the input
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  displayOutput.textContent = displayString;
  update(timeLeft, wholeTime);
}

pauseBtn.addEventListener('click',pauseTimer);
