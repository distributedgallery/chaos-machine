const Gpio = require('onoff').Gpio

const gpio = new Gpio(15, 'out');
let flag = true;
setInterval(() => {
  if (flag) gpio.writeSync(1);
  else gpio.writeSync(0);
  flag = !flag;
}, 5000);
