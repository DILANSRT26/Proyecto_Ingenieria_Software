// routes/auth.js - Rutas de autenticación
const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword 
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// @desc    Registrar nuevo usuario (dueño o paseador)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', register);

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
router.post('/login', login);

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', authenticateToken, getProfile);

// @desc    Actualizar perfil del usuario autenticado
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', authenticateToken, updateProfile);

// @desc    Cambiar contraseña del usuario autenticado
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', authenticateToken, changePassword);

// @desc    Verificar si el token es válido
// @route   GET /api/auth/verify
// @access  Private
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    message: 'Token válido',
    user: req.userDetails
  });
});

// @desc    Logout (invalidar token del lado cliente)
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', authenticateToken, (req, res) => {
  // En una implementación real, aquí podrías agregar el token a una blacklist
  res.json({
    message: 'Logout exitoso',
    note: 'El token debe ser eliminado del lado del cliente'
  });
});

// Ruta de prueba (mantener mientras desarrollas)
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth routes working!',
    endpoints: [
      'POST /api/auth/register - Registro de usuario',
      'POST /api/auth/login - Inicio de sesión',
      'GET /api/auth/profile - Obtener perfil (requiere auth)',
      'PUT /api/auth/profile - Actualizar perfil (requiere auth)',
      'PUT /api/auth/change-password - Cambiar contraseña (requiere auth)',
      'GET /api/auth/verify - Verificar token (requiere auth)',
      'POST /api/auth/logout - Logout (requiere auth)'
    ]
  });
});

module.exports = router;
