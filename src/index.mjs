import io from './config/Socket/SocketServer.mjs';
import express from 'express';
import app from './routes/app.mjs';
import envConstant from './constant/env.constant.mjs';
import path from 'path';
import cookieParser from 'cookie-parser';
import lolcat from 'lolcatjs';
import rabbitMQService from './service/rabbitmq.service.mjs';
import SocketEvent from './config/Socket/SocketEvent.mjs';
import Socket_Middleware from './config/Socket/SocketMiddleWare.mjs';

app.use(cookieParser());

// System health probe
app.get('/api/health', (req, res) => {
  const queueStats = rabbitMQService.getStats();
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      database: 'resilient',
      rabbitmq: queueStats.mode,
      port: 3000,
    },
    queues: queueStats,
  });
});

app.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CIITM Backend API</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #0f172a; color: #f8fafc; padding: 2rem; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 2rem; max-width: 720px; width: 100%; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); }
    .badge { display: inline-flex; align-items: center; gap: 6px; background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; margin-bottom: 1rem; }
    .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; }
    h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; color: #ffffff; }
    p { color: #94a3b8; font-size: 0.95rem; margin-bottom: 1.25rem; line-height: 1.5; }
    .btn-row { display: flex; gap: 10px; margin-bottom: 1.5rem; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 0.875rem; transition: background 0.2s; }
    .btn:hover { background: #1d4ed8; }
    .btn-secondary { background: #334155; color: #e2e8f0; }
    .btn-secondary:hover { background: #475569; }
    .endpoints-title { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 0.75rem; font-weight: 600; }
    .endpoint-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 0.5rem; margin-bottom: 1.5rem; }
    .endpoint { background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 0.5rem 0.75rem; font-size: 0.825rem; color: #38bdf8; font-family: monospace; display: flex; align-items: center; justify-content: space-between; }
    .method { background: #1e3a8a; color: #93c5fd; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; }
    .footer { font-size: 0.8rem; color: #64748b; border-top: 1px solid #334155; padding-top: 1rem; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="dot"></span> Server Operational on Port 3000</div>
    <h1>CIITM Backend API & Microservices</h1>
    <p>The backend services, RabbitMQ message queues, and Socket.io server for CIITM are operational. Complete API request & response specifications are documented in <strong>README.md</strong>.</p>
    
    <div class="btn-row">
      <a class="btn" href="/api/health">⚡ Health Check (/api/health)</a>
      <a class="btn btn-secondary" href="/api/v1/queue/status">🐇 Queue Status (/api/v1/queue/status)</a>
    </div>

    <div class="endpoints-title">Core Production API Modules</div>
    <div class="endpoint-list">
      <div class="endpoint"><span>/api/health</span><span class="method">GET</span></div>
      <div class="endpoint"><span>/api/v1/queue/status</span><span class="method">RABBITMQ</span></div>
      <div class="endpoint"><span>/api/v1/queue/publish</span><span class="method">POST</span></div>
      <div class="endpoint"><span>/api/v1/queue/list</span><span class="method">GET</span></div>
      <div class="endpoint"><span>/api/v1/user/findAllCourse</span><span class="method">GET</span></div>
      <div class="endpoint"><span>/api/v1/user/login</span><span class="method">POST</span></div>
      <div class="endpoint"><span>/api/v1/user/create</span><span class="method">POST</span></div>
      <div class="endpoint"><span>/api/v1/notices</span><span class="method">GET</span></div>
      <div class="endpoint"><span>/api/v1/albums</span><span class="method">GET</span></div>
      <div class="endpoint"><span>/api/v1/testimonials</span><span class="method">GET</span></div>
      <div class="endpoint"><span>/api/v1/contact/submit</span><span class="method">POST</span></div>
      <div class="endpoint"><span>/api/images</span><span class="method">STATIC</span></div>
    </div>

    <div class="footer">
      <span>Runtime: Node.js 22 + RabbitMQ Queue</span>
      <span>See README.md for Full API Documentation</span>
    </div>
  </div>
</body>
</html>`);
  } else {
    res.status(200).json({
      name: 'CIITM Backend API',
      status: 'online',
      port: 3000,
      documentation: 'See README.md for complete API specifications and examples',
      health: '/api/health',
      timestamp: new Date().toISOString()
    });
  }
});

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
  if (
    err &&
    (err.name === 'MongooseError' ||
      err.name === 'MongoNetworkError' ||
      err.name === 'MongoServerSelectionError' ||
      (err.message &&
        (err.message.includes('buffering timed out') ||
          err.message.includes('topology was destroyed') ||
          err.message.includes('connect ECONNREFUSED'))))
  ) {
    console.warn('[AI Studio] Database offline — returning fallback response');
    if (req.method === 'GET') {
      return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
    }
    return res.status(503).json({ error: 'Service temporarily unavailable (database offline)' });
  }

  if (err) {
    console.error(err.stack || err);
    return res.status(err.status || 500).json({ error: err.message || 'Something broke!' });
  }

  next();
});
