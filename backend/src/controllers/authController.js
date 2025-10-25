const { auth, db } = require('../config/firebase');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    // Validar datos
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    
    // Verificar si el usuario ya existe
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.where('email', '==', email).limit(1).get();
    
    if (!existingUser.empty) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Crear usuario en Firestore
    const userData = {
      email,
      passwordHash,
      firstName,
      lastName,
      role: role || 'customer',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await usersCollection.add(userData);
    
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: docRef.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role
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
    
    // Buscar usuario por email en Firestore (necesitamos el documento completo con password)
    const usersCollection = db.collection('users');
    const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
    
    if (snapshot.empty) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const user = {
      id: userDoc.id,
      ...userData
    };
    
    // Validar contraseña
    if (!userData.passwordHash) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const isValidPassword = await bcrypt.compare(password, userData.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Generar token personalizado
    let token;
    if (auth._isMock) {
      // Para mock auth, crear un token simple en base64
      const tokenData = {
        userId: user.id,
        email: user.email,
        role: user.role,
        iat: Date.now()
      };
      token = Buffer.from(JSON.stringify(tokenData)).toString('base64');
    } else {
      // Para Firebase real, intentar crear custom token
      try {
        token = await auth.createCustomToken(user.id, { 
          role: user.role,
          email: user.email 
        });
      } catch (authError) {
        // Si Firebase Auth no está habilitado, usar token simple
        console.warn('Firebase Auth no disponible, usando token simple');
        const tokenData = {
          userId: user.id,
          email: user.email,
          role: user.role,
          iat: Date.now()
        };
        token = Buffer.from(JSON.stringify(tokenData)).toString('base64');
      }
    }
    
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