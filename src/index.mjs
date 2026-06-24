import io from './config/Socket/SocketServer.mjs';
import express from 'express';
import app from './routes/app.mjs';
import envConstant from './constant/env.constant.mjs';
import validateEnv from './validation/Env.Validation.mjs';
import { db_connect } from './config/Db.config.mjs';
import path from 'path';

// import cron from 'node-cron';

import session from 'express-session';

import cookieParser from 'cookie-parser';
import lolcat from 'lolcatjs';

app.use(cookieParser());


import { fileURLToPath } from 'url';
import SocketEvent from './config/Socket/SocketEvent.mjs';
import Socket_Middleware from './config/Socket/SocketMiddleWare.mjs';

app.get('/', (req, res) => {
  res.status(200).send('Welcome to CIITM Backend API');
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use((req, res, next) => {
  console.log('METHOD :', req.method);
  console.log('URL :', req.url);
  console.log('ORIGIN :', req.headers.origin);
  next();
});


app.use(express.static(path.join(path.resolve(), 'public')));
app.use(
  '/api/images',
  express.static(path.join(path.resolve(), 'public', 'images'))
);

app.use((req, res, next) => {
  envConstant.isDevelopment
    ? lolcat.fromString(
        `\n${req.method} ${req.url} \n${new Date().toLocaleString()}\n`
      )
    : console.log(
        `\n${req.method} ${req.url} \n${new Date().toLocaleString()}\n`
      );

  next();
});

io.on('connection', (socket) => SocketEvent(socket));
io.use((socket, next) => Socket_Middleware(socket, next));

app.use((err, req, res, next) => {
  if (err) {
    console.error(err.stack);
    res.status(500).send(err.message || 'Something broke!');
  }

  next();
});
