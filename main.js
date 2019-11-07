const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT || 5000
const io = require('socket.io').listen(server);

const five = require('johnny-five');
const board = new five.Board({port: '/dev/ttyACM0'});

const pin = {
  12: {
    led: {
      on: () => console.log('on'),
      off: () => console.log('off')
    },
  },
};


board.on('ready', () => {
  const led = new five.Led(12);
  led.off();
  pin[12].led = led;
});

app.use(express.static(__dirname + '/public'));


app.get('/', (req, res)=>{
  res.render('index.html');
})

io.sockets.on('connection', socket => {
  socket.on('message', (channel, message) => {
    if (channel === 'on') pin[message].led.on();
    if (channel === 'off') pin[message].led.off();
  });
});

server.listen(port);