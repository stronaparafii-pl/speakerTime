document.addEventListener('DOMContentLoaded', function () {
    app.init();
});

function pad(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function secondsToDate(seconds) {

    let negative = false;

    if (seconds < 0) {
        seconds *= -1;
        negative = true;
    }

    const hours = Math.trunc(seconds / (3600));
    const minutes = Math.trunc((seconds % 3600) / 60);
    const sec = Math.trunc((seconds % 3600) % 60);

    if (negative) {
        return '<span class="negative">- ' + pad(hours, 2) + ':' + pad(minutes, 2) + '.<self class="seconds">' + pad(sec, 2) + '</self></span>';
    } else {
        return pad(hours, 2) + ':' + pad(minutes, 2) + '.<self class="seconds">' + pad(sec, 2) + '</self>';
    }
}

var app = {

    counterData: {},
    intervalButton: null,
    play: document.getElementById('play'),
    reset: document.getElementById('reset'),
    pause: document.getElementById('pause'),
    nextPerson: document.getElementById('nextPerson'),
    interval: null,
    counterPaused: false,
    counterValue: 0,


    init: function () {
        app.play.addEventListener('click', app.playCounter);
        app.reset.addEventListener('click', app.resetCounter);
        app.pause.addEventListener('click', app.pauseCounter);
        app.nextPerson.addEventListener('click', app.removePerson);

        counterElements = document.querySelectorAll('#settings > .counter');
        for (i = 0, len = counterElements.length; i < len; i++) {
            app.initCounter(counterElements[i]);
        }

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./service-worker.js').then(function (registration) {
                console.log('Service worker registration succeeded:', registration);
            }, /*catch*/ function (error) {
                console.log('Service worker registration failed:', error);
                console.log(error);
            });
        } else {
            console.log('Service workers are not supported.');
        }
    },


    initCounter: function (counterElement) {
        counterIdNeme = counterElement.id;
        lessBtn = counterElement.getElementsByClassName('lessBtn')[0];
        moreBtn = counterElement.getElementsByClassName('moreBtn')[0];
        valueEl = counterElement.getElementsByClassName('value')[0];

        if (localStorage[counterElement.id] !== undefined) {
            valueEl.innerText = localStorage[counterElement.id];
        }
        app.counterData[counterElement.id] = parseInt(valueEl.innerText);

        lessBtn.addEventListener('click', app.lessValue);
        lessBtn.addEventListener('mousedown', app.lessValueCont);
        lessBtn.addEventListener('touchstart', app.lessValueCont);
        lessBtn.addEventListener('mouseup', app.lessValueContEnd);
        lessBtn.addEventListener('mouseleave', app.lessValueContEnd);
        lessBtn.addEventListener('touchend', app.lessValueContEnd);
        lessBtn.addEventListener('touchcancel', app.lessValueContEnd);

        moreBtn.addEventListener('click', app.moreValue);
        moreBtn.addEventListener('mousedown', app.moreValueCont);
        moreBtn.addEventListener('touchstart', app.moreValueCont);
        moreBtn.addEventListener('mouseup', app.moreValueContEnd);
        moreBtn.addEventListener('mouseleave', app.moreValueContEnd);
        moreBtn.addEventListener('touchend', app.moreValueContEnd);
        moreBtn.addEventListener('touchcancel', app.moreValueContEnd);
    },

    playCounter: function () {
        settingsElement = document.getElementById('settings');
        settingsElement.style = 'display: none';
        counterElement = document.getElementById('counter');
        counterElement.style = 'display: block';
        personTimeToEndElement = document.querySelector('#personTimeToEnd .value');
        timeToEndElement = document.querySelector('#timeToEnd .value');
        otherPersonTimeToEndElement = document.querySelector('#otherPersonTimeToEnd .value');
        personNrElement = document.querySelector('#personNr .value');

        counterValue = app.counterData['time'] * 60;
        counterPersons = app.counterData['people'];
        counterPersonValue = counterValue / counterPersons;

        app.doPersonRemove = false;
        app.counterPaused = false;
        app.pause.innerText = 'Zatrzymaj';

        app.interval = setInterval(function () {
            if (app.doPersonRemove) {
                if (counterPersons > 1) {
                    counterPersons -= 1;
                    counterPersonValue = Math.trunc(counterValue / counterPersons);
                    console.log(counterPersons);
                }

                app.doPersonRemove = false;
            }
            if (!app.counterPaused) {
                counterValue -= 1;
                counterPersonValue -= 1;

                personTimeToEndElement.innerHTML = secondsToDate(counterPersonValue);
                timeToEndElement.innerHTML = secondsToDate(counterValue);
                if ((counterPersons - 1) <= 0) {
                    otherPersonTimeToEndElement.innerHTML = 'Niedostępny';
                } else {
                    otherPersonTimeToEndElement.innerHTML = secondsToDate((counterValue) / (counterPersons - 1));
                }

                personNrElement.innerText = (app.counterData['people'] - counterPersons + 1) + ' / ' + app.counterData['people'];
            }
        }, 1000)
    },

    resetCounter: function () {
        settingsElement = document.getElementById('settings');
        settingsElement.style = '';
        counterElement = document.getElementById('counter');
        counterElement.style = '';
        clearInterval(app.interval);
        app.counterPaused = false;
    },

    removePerson: function () {
        if (!app.counterPaused) {
            app.doPersonRemove = true;
        }
    },

    pauseCounter: function () {
        if (app.counterPaused) {
            app.counterPaused = false;
            app.pause.innerText = 'Zatrzymaj';
        } else {
            app.counterPaused = true;
            app.pause.innerText = 'Wznów';
        }

    },

    lessValue: function (type) {
        // type instanceof MouseEvent
        if (typeof type === "object") {
            counterElement = type.srcElement.parentElement.parentElement;
        } else {
            console.log(type);
        }

        const valueEl = counterElement.getElementsByClassName('value')[0];

        if (app.counterData[counterElement.id] === undefined) {
            app.counterData[counterElement.id] = parseInt(valueEl.innerText);

        } else {
            app.counterData[counterElement.id] = app.counterData[counterElement.id] - 1;
            valueEl.innerText = app.counterData[counterElement.id];
        }

        localStorage[counterElement.id] = app.counterData[counterElement.id];
    },

    lessValueCont: function (type) {
        if (typeof type === "object") {
            let counterElementCount = type.srcElement.parentElement.parentElement;
        } else {
            console.log(type);
        }

        app.intervalButton = setInterval(function () {
            app.lessValue(type)
        }, 250);
    },

    lessValueContEnd: function () {
        clearInterval(app.intervalButton);
    },

    moreValue: function (type) {
        if (typeof type === "object") {
            counterElement = type.srcElement.parentElement.parentElement;
        } else {
            console.log(type);
        }

        const valueEl = counterElement.getElementsByClassName('value')[0];

        if (app.counterData[counterElement.id] === undefined) {
            app.counterData[counterElement.id] = parseInt(valueEl.innerText);
        } else {
            app.counterData[counterElement.id] = app.counterData[counterElement.id] + 1;
            valueEl.innerText = app.counterData[counterElement.id];
        }

        localStorage[counterElement.id] = app.counterData[counterElement.id];
    },


    moreValueCont: function (type) {
        if (typeof type === "object") {
            let counterElementCount = type.srcElement.parentElement.parentElement;
        } else {
            console.log(type);
        }

        app.intervalButton = setInterval(function () {
            app.moreValue(type)
        }, 250);
    },

    moreValueContEnd: function (type) {
        clearInterval(app.intervalButton);
    },

};