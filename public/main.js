// main.js
let socket;

function initSocket(onMessageCallback) {
  // Usar WSS para conexiones seguras, WS para desarrollo local
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  socket = new WebSocket(`${protocol}//${location.host}`);
  socket.onmessage = onMessageCallback;
}

// Carga de banco de preguntas
async function loadQuestions() {
  const res = await fetch('questions.json', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

// Utilidad para enviar eventos seguros
function sendEvent(message) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn('Socket no listo, reintentando en 200ms');
    setTimeout(() => sendEvent(message), 200);
    return;
  }
  socket.send(JSON.stringify(message));
}

// DRY: parseo seguro de mensajes JSON
function safeJSON(raw) {
  try {
    if (typeof raw === 'string') return JSON.parse(raw);
    return JSON.parse(String(raw));
  } catch (e) {
    console.error('JSON inválido', e);
    return null;
  }
}

// DRY: envoltorio para onmessage que ya entrega objeto JSON o null
function onSocketJSON(handler) {
  initSocket((msg) => {
    const data = safeJSON(msg.data);
    if (data) handler(data);
  });
}

// Función para reiniciar el juego
function resetGame() {
  sendEvent({ type: 'reset_game' });
}