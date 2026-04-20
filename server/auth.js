const jwt = require('jsonwebtoken');

// Función para crear un token (se usa al iniciar sesión)
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, 'SECRET_KEY_SUPER_SECRETA', { expiresIn: '1h' });
};

// Middleware para proteger rutas
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Token requerido' });

  jwt.verify(token, 'SECRET_KEY_SUPER_SECRETA', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido' });
    req.userId = decoded.id;
    next();
  });
};

module.exports = { generateToken, verifyToken };