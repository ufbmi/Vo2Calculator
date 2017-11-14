//get form
var form = document.getElementById("calc");
var systemValue = 0;

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

//get all numbers
var height = parseInt(form.elements["h"].value);
var weight = parseInt(form.elements["w"].value);
var age = parseInt(form.elements["a"].value);
var p1 = parseInt(form.elements["p1"].value);
var p2 = parseInt(form.elements["p2"].value);
var p3 = parseInt(form.elements["p3"].value);


// getting sex value
var sexValue = parseInt(form.elements["sex"].value);

function calcVO2max() {
    if (systemValue == 0) {
        // Metric System was selected
        console.log("Metric System was selected");
        // formula
        var result = [3.0143 + 1.1585 * sexValue - 0.0268 * (p1/height) +118.7611 * ((p2 - p3)/age^3)]/weight * 1000;
        document.getElementById("result").innerHTML = result.toString();

        console.log("this is result " + result.toString());
    }
    else {
        // Imperial System was selected
        console.log("Imperial System was selected");

        // formula
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

