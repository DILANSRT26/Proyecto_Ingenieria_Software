// middleware/auth.js - Middleware de autenticación JWT
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Middleware para verificar JWT token
const authenticateToken = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Token requerido',
        message: 'No se proporcionó un token de autenticación'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario existe y está activo
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
        isActive: true
      }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Usuario no encontrado',
        message: 'El token no corresponde a un usuario válido'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'Cuenta desactivada',
        message: 'Tu cuenta ha sido desactivada'
      });
    }

    // Agregar información del usuario al request
    req.user = decoded;
    req.userDetails = user;
    
    next();

  } catch (error) {
    console.error('Error en autenticación:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'El token proporcionado no es válido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'El token ha expirado, por favor inicia sesión nuevamente'
      });
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo verificar la autenticación'
    });
  }
};

// Middleware para verificar tipo de usuario
const requireUserType = (userTypes) => {
  return (req, res, next) => {
    try {
      const userType = req.userDetails.userType;
      
      // userTypes puede ser un string o un array
      const allowedTypes = Array.isArray(userTypes) ? userTypes : [userTypes];
      
      if (!allowedTypes.includes(userType)) {
        return res.status(403).json({
          error: 'Acceso denegado',
          message: `Esta acción requiere ser: ${allowedTypes.join(' o ')}`
        });
      }
      
      next();
    } catch (error) {
      console.error('Error verificando tipo de usuario:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo verificar el tipo de usuario'
      });
    }
  };
};

// Middleware para verificar que el usuario es dueño del recurso
const requireOwnership = (resourceField = 'userId') => {
  return (req, res, next) => {
    try {
      const currentUserId = req.user.userId;
      const resourceUserId = req.params[resourceField] || req.body[resourceField];
      
      if (currentUserId !== resourceUserId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          message: 'No tienes permisos para acceder a este recurso'
        });
      }
      
      next();
    } catch (error) {
      console.error('Error verificando propiedad:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo verificar la propiedad del recurso'
      });
    }
  };
};

// Middleware opcional de autenticación (para rutas que pueden funcionar con o sin auth)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // No hay token, continuar sin autenticación
      req.user = null;
      req.userDetails = null;
      return next();
    }

    // Si hay token, intentar verificarlo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
        isActive: true
      }
    });

    if (user && user.isActive) {
      req.user = decoded;
      req.userDetails = user;
    } else {
      req.user = null;
      req.userDetails = null;
    }

    next();

  } catch (error) {
    // Si hay error con el token, continuar sin autenticación
    req.user = null;
    req.userDetails = null;
    next();
  }
};

// Middleware para rate limiting básico (opcional)
const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Limpiar requests antiguos
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const userRequests = requests.get(ip);
    const recentRequests = userRequests.filter(time => time > windowStart);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Demasiadas peticiones',
        message: `Límite de ${maxRequests} peticiones por cada ${windowMs / 1000 / 60} minutos excedido`
      });
    }

    recentRequests.push(now);
    requests.set(ip, recentRequests);
    
    next();
  };
};

module.exports = {
  authenticateToken,
  requireUserType,
  requireOwnership,
  optionalAuth,
  rateLimiter
};
