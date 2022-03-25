var pomodoro = {
    init: function () {
  
      this.domVariables();
      this.timerVariables();
      this.bindEvents();
      this.updateAllDisplays();
      this.requestNotification();
    },
    
    breakNotification: undefined,
    workNotification: undefined,
    domVariables: function () {
  
      this.toggleTimerBtns = document.getElementsByClassName("toggle-timer");
      this.increaseSession = document.getElementById("increase-session");
      this.decreaseSession = document.getElementById("decrease-session");
      this.increaseBreak = document.getElementById("increase-break");
      this.decreaseBreak = document.getElementById("decrease-break");
  
      this.sessionLengthDisplay = document.getElementById("session-length");
      this.breakLengthDisplay = document.getElementById("break-length");
  
      this.countdownDisplay = document.getElementById("countdown");
      this.typeDisplay = document.getElementById("type");
      this.resetCountdownBtn = document.getElementById("reset-session");
      this.stopCountdownBtn = document.getElementById("stop-session");
      this.startCountdownBtn = document.getElementById("start-session");
      this.countdownContainer = document.getElementById("countdown-container");
    },
    timerVariables: function () {
  
      this.sessionLength = 20;
      this.breakLength = 5;
  
      this.timeinterval = false;
      this.workSession = true;
      this.pausedTime = 0;
      this.timePaused = false;
      this.timeStopped = false;
    },
    bindEvents: function () {
  
      this.increaseSession.onclick = pomodoro.incrSession;
      this.decreaseSession.onclick = pomodoro.decrSession;
      this.increaseBreak.onclick = pomodoro.incrBreak;
      this.decreaseBreak.onclick = pomodoro.decrBreak;
  
      this.countdownDisplay.onclick = pomodoro.startCountdown;
      this.resetCountdownBtn.onclick = pomodoro.resetCountdown;
      this.stopCountdownBtn.onclick = pomodoro.stopCountdown;
      this.startCountdownBtn.onclick = pomodoro.startCountdown;
  
    },
    updateAllDisplays: function () {
  
      pomodoro.sessionLengthDisplay.innerHTML = this.sessionLength;
      pomodoro.breakLengthDisplay.innerHTML = this.breakLength;
      pomodoro.countdownDisplay.innerHTML = this.sessionLength + ":00";
  
      pomodoro.resetVariables();
  
    },
    requestNotification: function () {
  
      if (!("Notification" in window)) {
        return console.log("This browser does not support desktop notification");
      }
  
    },
    incrSession: function () {
  
      if (pomodoro.sessionLength < 59) {
        pomodoro.sessionLength += 1;
        pomodoro.updateAllDisplays();
      }
  
    },
    decrSession: function () {
  
      if (pomodoro.sessionLength > 1) {
        pomodoro.sessionLength -= 1;
        pomodoro.updateAllDisplays();
      }
  
    },
    incrBreak: function () {
  
      if (pomodoro.breakLength < 30) {
        pomodoro.breakLength += 1;
        pomodoro.updateAllDisplays();
      }
  
    },
    decrBreak: function () {
  
      if (pomodoro.breakLength > 1) {
        pomodoro.breakLength -= 1;
        pomodoro.updateAllDisplays();
      }
  
    },
    resetVariables: function () {
  
      pomodoro.timeinterval = false;
      pomodoro.workSession = true;
      pomodoro.pausedTime = 0;
      pomodoro.timeStopped = false;
      pomodoro.timePaused = false;
  
    },
    startCountdown: function () {
  
      pomodoro.disableButtons();
      pomodoro.displayType();
  
      if (pomodoro.timeinterval !== false) {
        pomodoro.pauseCountdown();
      } else {
        pomodoro.startTime = new Date().getTime();
  
        if (pomodoro.timePaused === false) {
          pomodoro.unPauseCountdown();
        } else {
          pomodoro.endTime = pomodoro.startTime + pomodoro.pausedTime;
          pomodoro.timePaused = false;
        }
  
        pomodoro.timeinterval = setInterval(pomodoro.updateCountdown, 990);
      }
  
    },
    updateCountdown: function () {
  
      var currTime = new Date().getTime();
      var difference = pomodoro.endTime - currTime;
  
      var seconds = Math.floor(difference / 1000 % 60);
      var minutes = Math.floor(difference / 1000 / 60 % 60);
  
      if (seconds < 10) {seconds = "0" + seconds;}
  
      if (difference > 1000) {
        pomodoro.countdownDisplay.innerHTML = minutes + ":" + seconds;
      } else {
        pomodoro.changeSessions();
      }
  
    },
    changeSessions: function () {
  
      clearInterval(pomodoro.timeinterval);
  
      pomodoro.playSound();
  
      if (pomodoro.workSession === true) {
        pomodoro.workSession = false;
      } else {
        pomodoro.workSession = true;
      }
  
      pomodoro.timeinterval = false;
      pomodoro.startCountdown();
  
    },
    pauseCountdown: function () {
  
      var currTime = new Date().getTime();
      pomodoro.pausedTime = pomodoro.endTime - currTime;
      pomodoro.timePaused = true;
  
      clearInterval(pomodoro.timeinterval);

      pomodoro.timeinterval = false;
    },
    unPauseCountdown: function () {
      if (pomodoro.workSession === true) {
        pomodoro.endTime = pomodoro.startTime + pomodoro.sessionLength * 60000;
      } else {
        pomodoro.endTime = pomodoro.startTime + pomodoro.breakLength * 60000;
      }
    },
    resetCountdown: function () {
  
      clearInterval(pomodoro.timeinterval);
      pomodoro.resetVariables();
  
      pomodoro.startCountdown();
  
    },
    stopCountdown: function () {
  
      clearInterval(pomodoro.timeinterval);
  
      pomodoro.updateAllDisplays();
  
      pomodoro.resetVariables();
  
      pomodoro.unDisableButtons();
  
    },
    displayType: function () {
      if (pomodoro.workSession === true) {
        pomodoro.typeDisplay.innerHTML = "work session";
        pomodoro.countdownContainer.className = pomodoro.countdownContainer.className.replace("break", "");
      } else {
        pomodoro.typeDisplay.innerHTML = "Break";
        if (pomodoro.countdownContainer.className !== "break") {
          pomodoro.countdownContainer.className += "break";
        }
      }
  
    },
    playSound: function () {
  
      var mp3 = "http://soundbible.com/grab.php?id=1746&type=mp3";
      var audio = new Audio(mp3);
      audio.play();
  
    },
    disableButtons: function () {
  
      for (var i = 0; i < pomodoro.toggleTimerBtns.length; i++) {
        pomodoro.toggleTimerBtns[i].setAttribute("disabled", "disabled");
        pomodoro.toggleTimerBtns[i].setAttribute("title", "Stop the countdown to change timer length");
      }
  
    },
    unDisableButtons: function () {
  
      for (var i = 0; i < pomodoro.toggleTimerBtns.length; i++) {
        pomodoro.toggleTimerBtns[i].removeAttribute("disabled");
        pomodoro.toggleTimerBtns[i].removeAttribute("title");
      }
  
    } };
  
    pomodoro.init();