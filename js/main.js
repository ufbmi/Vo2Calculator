//get form
var form = document.getElementById("calc");
var systemValue = 0;
var setTime;
var startTimer;

function updateSystemType() {
    // getting system value
    systemValue = parseInt(form.elements["system"].value);

    if (systemValue == 0) {
        // Metric System was selected
        console.log("Metric System");
        document.getElementById("systemType").innerHTML = "Metric System";
        document.getElementById("altura").innerHTML = "Meters";
        document.getElementById("peso").innerHTML = "Kilograms";
    }
    else {
        // Imperial System was selected
        console.log("Imperial System");
        document.getElementById("systemType").innerHTML = "Imperial System";
        document.getElementById("altura").innerHTML = "Feet";
        document.getElementById("peso").innerHTML = "Pounds";
    }
}

// getting sex value
var sexValue = parseInt(form.elements["sex"].value);

function calcVO2max() {
    //get all numbers
    var height = parseInt(form.elements["h"].value);
    var weight = parseInt(form.elements["w"].value);
    var age = parseInt(form.elements["a"].value);
    var p1 = parseInt(form.elements["p1"].value);
    var p2 = parseInt(form.elements["p2"].value);
    var p3 = parseInt(form.elements["p3"].value);

    if (systemValue == 0) {
        // Metric System was selected
        console.log("height " + height);
        console.log("weight " + weight);
        console.log("age " + age);


        console.log("Metric System was selected");

        // formula
        var result = [3.0143 + 1.1585 * sexValue - 0.0268 * (p1/height) +118.7611 * ((p2 - p3)/age^3)]/weight * 1000;

        document.getElementById("result").innerHTML = result.toString();

        console.log("this is result " + result.toString());
    }
    else {
        /*<==========================================================================
                Formula needs to be fix for imperial system
        <==========================================================================*/
        console.log("Imperial System was selected");

        var result = [3.0143 + 1.1585 * sexValue - 0.0268 * (p1/height) +118.7611 * ((p2 - p3)/age^3)]/weight * 1000;

        document.getElementById("result").innerHTML = result.toString();

        console.log("this is result " + result.toString());
    }
}


function updateOutput() {
    document.getElementById("sex").innerHTML = form.elements["sex"].value;
    document.getElementById("p1").innerHTML = form.elements["p1"].value;
    document.getElementById("height").innerHTML = form.elements["h"].value;
    document.getElementById("p2").innerHTML = form.elements["p2"].value;
    document.getElementById("p3").innerHTML = form.elements["p3"].value;
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
    if(current_tempo < 30)
    {
        current_tempo = 30;
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
    } else {
        note.frequency.value = 200;
        var bgcolor = "01C0F1";
    }

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
    startTimer = setTimeout(startTimerF,45005);
}

// Switch off
function metronome_off() {
    counting = false;
    window.clearInterval(timer);

    $("#metronome_switcher").prop( "checked", false );
    $(".beatcount .beat").attr("style", "");
    $(".current_beat").empty();

    // Pendulum Stuff
    $('.swinging_pendulum').removeClass('animate_pendulum');
    clearInterval(_interval);
    _interval = null;
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
        setTimeout(startTimerF, 1000);
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
    document.getElementById('timer').innerHTML = 01 + ":" + 00;
}
