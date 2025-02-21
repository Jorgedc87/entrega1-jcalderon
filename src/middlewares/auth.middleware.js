const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
      return res.status(403).json({ message: 'Token no proporcionado' });
  }

  if (token === process.env.JWT_SECRET) {
      return next(); 
  }

  return res.status(401).json({ message: 'No autorizado' });
};

module.exports = authMiddleware;

