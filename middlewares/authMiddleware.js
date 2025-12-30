const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) 
        return res.status(401).json({ success: false, message: "Silakan login terlebih dahulu!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.team.findUnique({ where: { id: decoded.id } });

    if (!user || user.role !== 'USER') 
      return res.status(403).json({ success: false, message: "Akses ditolak! Anda bukan anggota tim." });
    
    req.user = user;
    next();
    
  } catch (error) {
    res.status(401).json({ success: false, message: "Token tidak valid!", error: error.message });
  }
};

module.exports = { 
    verifyUser 
};