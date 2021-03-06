import appInfo from './package.json';
import configs from './configs';

import express from 'express';
import { Server, Socket } from 'socket.io';

// App setup
const app = express();

// cors
import cors from 'cors';
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

import http from 'http';
const server = http.createServer(app);
const PORT = configs.core.port;
const HOST = configs.core.host;


// Socket setup
const io = new Server(server);

io.sockets.on('connection', (socket: Socket) => {
  console.log(`user-${socket.id} connected`);

  // chat message received
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);

    // received chat message and emit message to all connected users
    io.emit('chat message', msg);

    console.log('=> chat message emitted');
  });

  // user disconnected
  socket.on('disconnect', () => {
    console.log(`user-${socket.id} disconnected`);
  });
});

server.listen({
  port: PORT,
  path: HOST,
}, () => {
  console.log(`${appInfo['name']} is running at ${HOST}:${PORT}`);
});

// Static files
app.use(express.static("public"));

export default server;