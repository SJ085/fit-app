// src/js/timer.js
export function createTimer(displayEl, onTick=null, onFinish=null) {
  let countdown = 0;
  let timerId = null;

  function start(seconds) {
    stop();
    countdown = seconds;
    render();
    timerId = setInterval(() => {
      countdown--;
      render();
      onTick && onTick(countdown);
      if (countdown <= 0) {
        stop();
        onFinish && onFinish();
        // beep
        try { new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play(); } catch(e){}
      }
    }, 1000);
  }

  function stop() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function render() {
    const mm = String(Math.floor(countdown / 60)).padStart(2,'0');
    const ss = String(countdown % 60).padStart(2,'0');
    displayEl.textContent = `${mm}:${ss}`;
  }

  return { start, stop };
}