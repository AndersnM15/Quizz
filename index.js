// server.js
const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);

  ws.on('message', (msg) => {
    // Broadcast to all clients
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        const text = typeof msg === 'string' ? msg : msg.toString();
        client.send(text);
      }
    });
  });

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
  });
});

app.use(express.static(path.join(__dirname, '.', 'public')));

server.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
  console.log(`Control: http://localhost:${PORT}/control.html`);
  console.log(`Presentador: http://localhost:${PORT}/presenter.html`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
});

