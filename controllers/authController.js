const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userRegister = async (req, res, next) => {
  try {
    const { 
      teamName, password, confirmPassword, isBinusian,
      fullName, email, whatsappNumber, 
      lineId, githubId, birthPlace, birthDate 
    } = req.body;

    // Validasi Password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) 
      return res.status(400).json({ success: false, message: "Password tidak sesuai kriteria (Min 8 karakter, Huruf Besar, Kecil, Angka, Simbol)" });
    
    if (password !== confirmPassword) 
      return res.status(400).json({ success: false, message: "Konfirmasi password tidak cocok" });
    

    // Validasi Umur Minimal 17 Tahun
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    if (age < 17) 
      return res.status(400).json({ success: false, message: "Umur peserta minimal 17 tahun" });

    // Cek File Upload
    if (!req.files || !req.files['cv'] || !req.files['idCard']) 
      return res.status(400).json({ success: false, message: "CV dan ID Card wajib diunggah" });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke Database
    const result = await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          teamName,
          password: hashedPassword,
          isBinusian: isBinusian === 'true' || isBinusian === true,
          leader: {
            create: {
              fullName, email, whatsappNumber, lineId, githubId, birthPlace,
              birthDate: new Date(birthDate),
              cvUrl: req.files['cv'][0].path,
              idCardUrl: req.files['idCard'][0].path
            }
          }
        },
        include: { leader: true }
      });
      return team;
    });

    res.status(201).json({ success: true, message: "Registrasi Berhasil", data: result });

  } catch (error) {
    next(error); // Lempar ke errorMiddleware
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { teamName, password } = req.body;

    if (!teamName || !password) 
      return res.status(400).json({ success: false, message: "Nama tim dan password wajib diisi" });
    

    const team = await prisma.team.findUnique({ where: { teamName } });
    if (!team) 
        return res.status(401).json({ success: false, message: "Tim tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, team.password);
    if (!isMatch) 
        return res.status(401).json({ success: false, message: "Password salah" });

    const token = jwt.sign({ id: team.id, teamName: team.teamName }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      accessToken: token
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { 
    userRegister, 
    userLogin 
};