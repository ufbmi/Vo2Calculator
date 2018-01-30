//get form
var form = document.getElementById("calc");
var systemType = 0;
var setTime;
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
        document.getElementById("systemType").innerHTML = "Metric System";
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
        document.getElementById("systemType").innerHTML = "Imperial System";
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

/* ==========================================================================
   Metronome Code
   ========================================================================== */

/*
* Flat Pyramid-style Metronome using HTML5 Web Audio API and CSS3 Keyframe Animations.
*
* Forked from Dylan Paulus' Pen "Simple Metronome" (http://codepen.io/ganderzz/pen/Ezlfu/), with the help of Chris Wilson's Tut "Scheduling Web Audio with Precision" (http://www.html5rocks.com/en/tutorials/audio/scheduling/).
* Design based on Alex Bergin's "M-Metronome" (http://codepen.io/abergin/pen/efbCD).
*
* Copyright 2015 GetSongBPM.com
* This project is licensed under the MIT License (see the LICENSE.md for details)
*/

// Defaults
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var timer, noteCount, counting, _interval = null;
var curTime = 0.0;

// Onload: Show beats
$("document").ready(function() {
    showBeats();
});

//Scheduler
function schedule() {
    while(curTime < context.currentTime + 0.1) {
        playNote(curTime);
        updateTime();
    }
    timer = window.setTimeout(schedule, 0.1);
}

// BPM to Time
function updateTime() {
    curTime += seconds_perbeat();
    noteCount++;
}

// Seconds per beat
function seconds_perbeat() {
    var current_tempo = parseInt($(".bpm-input").val(), 10);

    // Min/Max Put Limits
    if(current_tempo < 38)
    {
        current_tempo = 38;
        $(".bpm-input").val(current_tempo);
    }
    else if(current_tempo > 210)
    {
        current_tempo = 210;
        $(".bpm-input").val(current_tempo);
    }

    var adjust_weight = current_tempo - 35;

    $( "<style>.swinging_pendulum:before { margin-top: " + adjust_weight + "px; }</style>" ).appendTo( "head" );

    var spb = 60 / current_tempo;

    return spb;
}

// Play note on a delayed interval of t
function playNote(t) {
    var note = context.createOscillator();

    if(noteCount == parseInt($(".new_beats").val(), 10) )
        noteCount = 0;

    if( $(".beatcount .beat").eq(noteCount).hasClass("active") ) {
        note.frequency.value = 380;
        var bgcolor = "19FA65";
        var first_beat = true;
    }
    // else {
    //     note.frequency.value = 200;
    //     var bgcolor = "01C0F1";
    // }

    note.connect(context.destination);

    note.start(t);
    note.stop(t + 0.05);

    $(".beatcount .beat").attr("style", "");

    $(".beatcount .beat").eq(noteCount).css({
        background: "#" + bgcolor
    });

    $(".current_beat").text(noteCount+1);

}

// Pendulum
pendulum_speed();

function pendulum_speed() {
    var duration = seconds_perbeat() + 's';

    $('.swinging_pendulum').css({
        '-webkit-animation-duration': duration,
        '-moz-animation-duration': duration,
        '-o-animation-duration': duration,
        'animation-duration': duration
    });
}

// Increase or decrease Tempo
$(".slow-down, .speed-up").click(function() {
    if($(this).hasClass("slow-down"))
        $(".bpm-input").val(parseInt($(".bpm-input").val(), 10) - 1 );
    else
        $(".bpm-input").val(parseInt($(".bpm-input").val(), 10) + 1 );

    $(this).blur();

    pendulum_speed();
});

// Allow keyboard controls
$(document).on('keydown', function(e) {
    var amount = 1;

    if (e.shiftKey)
        amount = 10;

    if (e.keyCode == 107 || e.keyCode == 39) { // + or ->
        $(".bpm-input").val(parseInt($(".bpm-input").val(), 10) + amount );
        pendulum_speed();
    } else if (e.keyCode == 109 || e.keyCode == 37) { // - or <-
        $(".bpm-input").val(parseInt($(".bpm-input").val(), 10) - amount );
        pendulum_speed();
    } else if (e.keyCode == 32) { // spacebar
        metronome_switch();
    } else if (e.keyCode == 13) { // enter
        if(!$('.swinging_pendulum').hasClass('animate_pendulum'))
            metronome_on();
    } else if (e.keyCode == 27) { // escape
        metronome_off();
    }
});

// Start/Stop
$("#metronome_switcher").on( "click", function() {
    metronome_switch();
});

// Switcher
function metronome_switch() {

    if($('.swinging_pendulum').hasClass('animate_pendulum'))
        metronome_off();
    else
        metronome_on();

}

// Switch on
function metronome_on() {
    curTime = context.currentTime;
    noteCount = parseInt($(".new_beats").val(), 10);
    schedule();

    $("#metronome_switcher").prop( "checked", true );

    // Pendulum Stuff
    $('.swinging_pendulum').addClass('animate_pendulum');
    _interval = setInterval(function() {}, seconds_perbeat() * 1000);
    setTime = setTimeout(metronome_switch, 45000);
    // startTimer = setTimeout(startTimerF, 5005);
    // disable the start button
    document.getElementById("startRuffier").disabled = true;
}

// Switch off
function metronome_off() {
    counting = false;
    window.clearInterval(timer);
    window.clearTimeout(setTime);
    // window.clearTimeout(startTimer);

    $("#metronome_switcher").prop( "checked", false );
    $(".beatcount .beat").attr("style", "");
    $(".current_beat").empty();

    // Pendulum Stuff
    $('.swinging_pendulum').removeClass('animate_pendulum');
    clearInterval(_interval);
    _interval = null;
    // enable button
    document.getElementById("startRuffier").disabled = false;
}

// Beats per measure
$(document).mouseup(function (e) {
    var ts = $(".per_measure");

    if ( $(e.target).is('.n_beats_change') || (ts.is(":visible") && !ts.is(e.target) && ts.has(e.target).length === 0) )
        ts.toggle(200);
});

// Show beats using dots
function showBeats() {

    for(var i = 0; i < $(".new_beats").val(); i++) {
        var temp = document.createElement("div");
        temp.className = "beat";

        if(i === 0)
            temp.className += " active";

        $(".beatcount").append( temp );
    }
}

// Enable accents
$(document).on("click", ".beatcount .beat", function() {
    $(this).toggleClass("active");
});


// Add/remove dots when number of beats per measure changes
$(".new_beats").on("change", function() {
    var _counter = $(".beatcount");
    _counter.html("");

    //var time_sig = parseInt($(".new_beats option:selected").val(), 10);
    var time_sig = $(".new_beats").val();

    if(time_sig < noteCount)
        noteCount = 0;

    showBeats();

    if( $(".per_measure").is(":visible") )
        $(".per_measure").toggle(200);
});

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
