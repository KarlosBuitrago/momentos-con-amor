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
    
    // Verificar si auth tiene el método verifyIdToken
    if (!auth || typeof auth.verifyIdToken !== 'function') {
      console.warn('Firebase Auth no está configurado correctamente. Usando modo de desarrollo.');
      
      // En modo desarrollo sin Firebase, permitir acceso con token mock
      if (process.env.NODE_ENV === 'development') {
        // Decodificar token mock
        try {
          const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
          const user = await User.getById(decoded.userId);
          
          if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
          }
          
          req.user = user;
          return next();
        } catch (decodeError) {
          return res.status(401).json({ error: 'Token inválido' });
        }
      }
      
      return res.status(503).json({ error: 'Servicio de autenticación no disponible' });
    }
    
    // Intentar verificar como ID token primero
    let userId;
    let decoded;
    
    try {
      const decodedToken = await auth.verifyIdToken(token);
      userId = decodedToken.uid;
    } catch (idTokenError) {
      // Si falla, intentar decodificar como token simple (base64) o custom token (JWT)
      try {
        // Intentar como token simple (base64)
        decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        userId = decoded.userId || decoded.uid;
      } catch (base64Error) {
        // Intentar como JWT (custom token)
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
            userId = payload.uid || payload.sub;
          }
        } catch (jwtError) {
          console.error('Error decodificando token:', jwtError);
          return res.status(401).json({ error: 'Token inválido o expirado' });
        }
      }
      
      if (!userId) {
        console.error('No se pudo extraer el UID del token');
        return res.status(401).json({ error: 'Token inválido' });
      }
    }
    
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
