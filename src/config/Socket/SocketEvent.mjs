import FrontendSocket from '../../api/v1/frontend/frontend.socket.mjs';
import DashBoard_Socket from '../../api/v1/Dashboard/Dashbord.socket.mjs';
import io from './SocketServer.mjs';
import Course_Socket from '../../api/v1/Course/Course.socket.mjs';

let SocketEvent = (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  FrontendSocket(io, socket);
  DashBoard_Socket(io, socket);
  Course_Socket(io, socket);

  socket.emit('welcome', { message: 'Welcome to the Socket.IO Server' });
};

export default SocketEvent;
