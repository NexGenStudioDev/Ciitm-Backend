import { createServer } from 'http'; // Use 'https' if doing HTTPS
import path from 'path';
import { Server } from 'socket.io';
import envConstant from '../../constant/env.constant.mjs';
import app from '../../routes/app.mjs';
import validateEnv from '../../validation/Env.Validation.mjs';
import { db_connect } from '../Db.config.mjs';

console.log(path.resolve());

// ✅ Create HTTP server and attach Express app
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [envConstant.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  allowEIO3: true,
});

const PORT = envConstant.PORT || 8000;

const Start_App = async () => {
  try {
    await validateEnv();
    await db_connect(); // ⬅️ Ensure async function is awaited
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ HTTP + WS server running on port ${PORT}`);
  Start_App();
});

export default io;
