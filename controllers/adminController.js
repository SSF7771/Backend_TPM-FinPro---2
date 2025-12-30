const prisma = require('../lib/prisma');

const getAllTeams = async (req, res, next) => {
  try {
    const { search, sortBy, order } = req.query;

    // Sorting
    let orderBy = {};
    if (sortBy === 'teamName') 
      orderBy = { teamName: order === 'desc' ? 'desc' : 'asc' };
    
    else 
      // Default: waktu registrasi (terbaru)
      orderBy = { createdAt: order === 'asc' ? 'asc' : 'desc' };
    

    const teams = await prisma.team.findMany({
      where: {
        role: 'USER', // Hanya tampilkan peserta
        teamName: { contains: search } // Search
      },
      include: { leader: true },
      orderBy: orderBy // Sort
    });

    res.status(200).json({ success: true, data: teams });

  } catch (error) {
    next(error);    // Lempar ke errorMiddleware
  }
};

const getTeamById = async (req, res, next) => {
  try {
    const team = await prisma.team.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { leader: true }
    });
    if (!team) return res.status(404).json({ success: false, message: "Tim tidak ditemukan" });

    res.status(200).json({
      success: true,
      data: {
        teamName: team.teamName,
        isBinusian: team.isBinusian,
        registrationDate: team.createdAt,
        leader: team.leader // CV, ID Card, Email, WA, dll
      }
    });

  } catch (error) {
    next(error);
  }
};

const updateTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { teamName, fullName, email, whatsappNumber } = req.body;

    const updated = await prisma.team.update({
      where: { id: parseInt(id) },
      data: {
        teamName,
        leader: {
          update: { fullName, email, whatsappNumber }
        }
      }
    });

    res.status(200).json({ success: true, message: "Data tim berhasil diubah", data: updated });

  } catch (error) {
    next(error);
  }
};

const deleteTeam = async (req, res, next) => {
  try {
    await prisma.team.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ success: true, message: "Tim berhasil dihapus" });

  } catch (error) {
    next(error);
  }
};

module.exports = { 
    getAllTeams, 
    getTeamById, 
    updateTeam, 
    deleteTeam 
};