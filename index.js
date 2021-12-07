const startButton = document.querySelector(".start-btn");
const timeSelector = document.getElementById("time-limit");
const keys = document.querySelectorAll(".key");
const body = document.querySelector("body");
const display = document.querySelectorAll(".letter");
const timer = document.getElementById("time-remaining");
const speedDisplay = document.getElementById("speed");
const mistakeDsiplay = document.getElementById("accuracy");
const middleBox = document.getElementById("col1-let26");
const keyboard = document.getElementById("keyboard");
const outputDisplay = document.getElementById("display");

var endTime;
var startTime;
var texts = [];
var usedSentences = new Set();
var running = false;
var currentSentence;
var index = 0;
var wordCount = 0;
var mistakeCount = 0;
var nextKey = null;

function readTextFile() {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "text.txt", false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                texts = allText.split(/\r\n|\n/);
                console.log(texts)

            }
        }
    }
    rawFile.send(null);
}

startButton.addEventListener("click", function(e) {
    startTime = Math.floor((new Date()).getTime() / 1000)

    endTime = startTime + timeSelector.options[timeSelector.selectedIndex].value * 60;
    start();
});


body.addEventListener("keydown", function(e) {
    if (e.code == "Space" || e.code == "Enter") {
        e.preventDefault();
    }

    keypressed(e)
})



readTextFile();

function start() {
    wordCount = 0;
    mistakeCount = 0;
    if (wordCount == 0) {
        speedDisplay.innerHTML = "Average typing speed: " + wordCount + " WPM";
    }

    // mistakeDsiplay.innerHTML = "Incorrect keystrokes: " + mistakeCount;

    running = true;
    middleBox.classList.add("curser");

    outputDisplay.classList.remove("hide-item");
    keyboard.classList.remove("hide-item");
    speedDisplay.classList.add("small-font");
    speedDisplay.classList.remove("big-font");
    setTimeout(function() {
        speedDisplay.classList.add("control-data-small");
        speedDisplay.classList.remove("control-data-big");
    }, 1000)



    if (nextKey != null) {
        nextKey.classList.remove("key-current-key");
    }

    var x = setInterval(function() {

        var currentTime = Math.floor((new Date()).getTime() / 1000);
        var timePassed = currentTime - startTime;

        var seconds = 59 - timePassed % 60;
        var minutes = Math.floor((endTime - startTime) / 60) - Math.floor(timePassed / 60) - 1;


        if (seconds >= 10 && minutes >= 0) {
            timer.innerHTML = "Time: " + minutes + ":" + seconds;
        } else if (minutes >= 0) {
            timer.innerHTML = "Time: " + minutes + ":0" + seconds;
        }

        if (document.getElementById("col1-let25").innerHTML == " " && (currentTime - startTime) != 0) {
            speedDisplay.innerHTML = "Average typing speed: " + Math.floor(wordCount / ((currentTime - startTime) / 60)) + " WPM";
        }


        if (endTime - currentTime <= 0) {
            clearInterval(x);
            stop();
            clearInterval(x);
        }
    }, 500);


    // setTimeout(function() {
    //     stop();
    // }, time * 1000)

    getnewSentence();

    for (var i = display.length / 2; i < display.length; i++) {
        shiftLeft(true);
        addNewChar();
        index++;
    }

    highlightNextKey();


}

function highlightNextKey() {
    var currentCharactor = middleBox.innerHTML;

    if (currentCharactor == " ") {
        nextKey = document.querySelector("#Space").childNodes[1];
    } else if (!isNaN(currentCharactor)) {
        nextKey = document.querySelector("#Digit" + currentCharactor).childNodes[1];

    } else if (currentCharactor.toLowerCase() != currentCharactor.toUpperCase()) {
        nextKey = document.querySelector("#Key" + (currentCharactor.toUpperCase())).childNodes[1];

    } else {
        switch (currentCharactor) {
            case ".":
                nextKey = document.querySelector("#Period").childNodes[1];
                break;
            case ",":
                nextKey = document.querySelector("#Comma").childNodes[1];
                break;
            case "'":
                nextKey = document.querySelector("#Quote").childNodes[1];
                break;
            case ";":
                nextKey = document.querySelector("#Semicolon").childNodes[1];
                break;
            case "/":
                nextKey = document.querySelector("#Slash").childNodes[1];
                break;
            case "[":
                nextKey = document.querySelector("#BracketLeft").childNodes[1];
                break;
            case "]":
                nextKey = document.querySelector("#BracketRight").childNodes[1];
                break
            case "@":
                nextKey = document.querySelector("#Digit2").childNodes[1];
                break
            case "%":
                nextKey = document.querySelector("#Digit5").childNodes[1];
                break
            case "&":
                nextKey = document.querySelector("#Digit7").childNodes[1];
                break
            case "!":
                nextKey = document.querySelector("#Digit1").childNodes[1];
                break
            case "-":
                nextKey = document.querySelector("#Minus").childNodes[1];
                break
            case "(":
                nextKey = document.querySelector("#Digit9").childNodes[1];
                break
            case ")":
                nextKey = document.querySelector("#Digit0").childNodes[1];
                break



        }
    }

    nextKey.classList.add("key-current-key");
}

function getnewSentence() {
    index = 0;
    var sentenceIndex = Math.floor(Math.random() * 12);

    while (usedSentences.has(sentenceIndex)) {
        sentenceIndex = Math.floor(Math.random() * 12);
    }

    usedSentences.add(sentenceIndex);
    currentSentence = texts[sentenceIndex];
    currentSentence = currentSentence + " ";

    console.log(currentSentence);
}


function stop() {
    //console.log("Stopped");
    running = false;
    middleBox.classList.remove("curser");

    speedDisplay.classList.add("big-font");
    speedDisplay.classList.remove("small-font");
    setTimeout(function() {
        speedDisplay.classList.add("control-data-big");
        speedDisplay.classList.remove("control-data-small");
        outputDisplay.classList.add("hide-item");
        keyboard.classList.add("hide-item");
    }, 1000)

}


function keypressed(e) {
    var key = document.getElementById(e.code).childNodes[1]
    if (running == true) {
        key.classList.add("keyPressed");
        typing(e);

        setTimeout(function() {
            key.classList.remove("keyPressed");
        }, 100)
    }
}


function typing(key) {
    if (key.key == "Capslock" || key.key == "Shift") {

    } else if (key.key == display[display.length / 2].innerHTML) {
        shiftLeft();
        if (index == currentSentence.length - 1) {
            getnewSentence();
        }
        addNewChar();
        nextKey.classList.remove("key-current-key");
        highlightNextKey();
        index++;

        if (key.key == " ") {
            wordCount++;
        }

        document.getElementById(key.code).childNodes[1].classList.add("success-key");

        setTimeout(function() {
            document.getElementById(key.code).childNodes[1].classList.remove("success-key");
        }, 200)

    } else {
        // mistakeCount++;
        // mistakeDsiplay.innerHTML = "Incorrect keystrokes: " + mistakeCount;

        // middleBox.classList.remove("curser");
        // middleBox.classList.add("error-key-")
        // mistakeDsiplay.classList.add("error-display");

        document.getElementById(key.code).childNodes[1].classList.add("error-key");

        setTimeout(function() {
            document.getElementById(key.code).childNodes[1].classList.remove("error-key");
            // middleBox.classList.remove("error-key")
            // middleBox.classList.add("curser");
            // mistakeDsiplay.classList.remove("error-display");
        }, 200)
    }
}

function shiftLeft(clear = false) {
    if (clear) {
        for (var i = 0; i < display.length / 2; i++) {
            display[i].innerHTML = " ";
        }

        for (var i = display.length / 2; i < display.length - 1; i++) {
            display[i].innerHTML = display[i + 1].innerHTML;
        }
    } else {
        for (var i = 0; i < display.length - 1; i++) {
            display[i].innerHTML = display[i + 1].innerHTML;
        }
    }

}



function addNewChar() {
    display[display.length - 1].innerHTML = currentSentence[index];
}


function countDown(maxTime) {
    var currentTime = (new Date()).getTime();
    const endTime = currentTime + maxTime * 1000;
    //console.log(currentTime, endTime, maxTime);
    var seconds = 0;
    var minutes = 0;

    while (currentTime <= endTime) {
        // console.log(currentTime, endTime);
        currentTime++;

        if (seconds == 60) {
            minutes++;
            seconds = 0;
        }
        timer.innerHTML = "Time: " + minutes + ":" + seconds;
    }

    //console.log(currentTime, endTime);

}