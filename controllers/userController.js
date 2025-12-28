const prisma = require('../lib/prisma');
const path = require('path');

const getMyTeam = async (req, res, next) => {
  try {
    const team = await prisma.team.findUnique({
      where: { id: req.user.id },
      include: { leader: true }
    });
    
    if (!team) 
        return res.status(404).json({ success: false, message: "Data tidak ditemukan" });

    // Data leader tidak bisa diedit oleh user
    res.status(200).json({ success: true, data: team });

  } catch (error) {
    next(error);
  }
};

module.exports = { 
    getMyTeam 
};