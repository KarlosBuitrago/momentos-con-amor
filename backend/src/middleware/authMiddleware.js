const { auth } = require('../config/firebase');
const User = require('../models/User');

/**
 * Middleware para verificar que el usuario esté autenticado
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    // Verificar token con Firebase
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;
    
    // Obtener datos del usuario
    const user = await User.getById(userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    // Agregar usuario al request
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en authenticate middleware:', error);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

/**
 * Middleware para verificar que el usuario sea administrador
 */
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  
  next();
};

/**
 * Middleware combinado: autenticar y verificar admin
 */
exports.requireAdmin = [exports.authenticate, exports.isAdmin];
