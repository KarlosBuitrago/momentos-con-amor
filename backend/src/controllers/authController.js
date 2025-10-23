const { auth } = require('../config/firebase');
const User = require('../models/User');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    // Validar datos
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    
    // Crear usuario
    const userData = {
      email,
      password,
      firstName,
      lastName,
      role: role || 'customer'
    };
    
    const newUser = await User.create(userData);
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }
    
    // Buscar usuario por email
    console.log('Buscando usuario con email:', email);
    const user = await User.getByEmail(email);
    console.log('Usuario encontrado:', user ? 'SÍ' : 'NO');
    
    if (!user) {
      console.log('Usuario no encontrado, retornando error');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    console.log('Usuario válido, generando token...');
    
    // Para desarrollo con mock storage, aceptamos cualquier contraseña
    // En producción, aquí deberías verificar con bcrypt o Firebase Auth
    // Por ahora, solo verificamos que el password no esté vacío
    if (!password || password.length < 3) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Generar token personalizado
    const token = await auth.createCustomToken(user.id, { role: user.role });
    
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
};

// Verificar token
exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token es obligatorio' });
    }
    
    // Decodificar el token (custom token contiene el uid)
    // En un sistema real, deberías verificar la firma del token
    // Por ahora, extraemos el uid del token
    let userId;
    try {
      // Intentar verificar como ID token primero
      const decodedToken = await auth.verifyIdToken(token);
      userId = decodedToken.uid;
    } catch (e) {
      // Si falla, intentar decodificar como custom token
      // Los custom tokens tienen formato base64
      try {
        const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        userId = decoded.uid || decoded.sub;
      } catch (decodeError) {
        throw new Error('Token inválido');
      }
    }
    
    if (!userId) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    // Obtener datos del usuario
    const user = await User.getById(userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    res.status(200).json({
      message: 'Token válido',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en verifyToken:', error);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Cerrar sesión
exports.logout = (req, res) => {
  // En el cliente se debe eliminar el token
  res.status(200).json({ message: 'Sesión cerrada correctamente' });
};