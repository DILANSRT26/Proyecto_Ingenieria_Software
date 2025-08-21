// server.js - Servidor principal de la aplicación
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const dogRoutes = require('./routes/dogs');
const serviceRoutes = require('./routes/services');
const messageRoutes = require('./routes/messages');

// Middleware de manejo de errores
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Middleware global
app.use(helmet()); // Seguridad básica
app.use(cors()); // Permitir CORS
app.use(morgan('combined')); // Logging de requests
app.use(express.json({ limit: '10mb' })); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Hacer io disponible en todas las rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dogs', dogRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/messages', messageRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '¡Backend funcionando correctamente!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta para verificar estado de la API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor corriendo',
    uptime: process.uptime(),
    database: 'Conectado' // Aquí verificarías la conexión real
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Configuración de Socket.IO para chat en tiempo real
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Unirse a una sala específica del servicio
  socket.on('join_service', (serviceId) => {
    socket.join(`service_${serviceId}`);
    console.log(`Usuario ${socket.id} se unió al servicio ${serviceId}`);
  });

  // Enviar mensaje
  socket.on('send_message', (data) => {
    const { serviceId, message, senderId } = data;
    
    // Emitir el mensaje a todos en esa sala
    io.to(`service_${serviceId}`).emit('receive_message', {
      message,
      senderId,
      timestamp: new Date().toISOString()
    });
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`
  🚀 ¡Servidor iniciado exitosamente!
  📍 Puerto: ${PORT}
  🌐 URL: http://localhost:${PORT}
  📚 API Docs: http://localhost:${PORT}/api/health
  ⏰ Hora: ${new Date().toLocaleString()}
  `);
});

// Manejo graceful de cierre del servidor
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

module.exports = app;