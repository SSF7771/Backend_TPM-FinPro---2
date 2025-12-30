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

    let hasUpperCase = false;
    let hasLowerCase = false;
    let hasNumber = false;
    let hasSymbol = false;

    const allowedSymbols = "!@#$%^&*()_+-=[]{}|;':\",./<>?";

    for (let char of password) {
        if (char >= 'A' && char <= 'Z') hasUpperCase = true;
        else if (char >= 'a' && char <= 'z') hasLowerCase = true;
        else if (char >= '0' && char <= '9') hasNumber = true;
        else if (allowedSymbols.includes(char)) hasSymbol = true;
    }

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol) {
        return res.status(400).json({
            status: 'error',
            message: 'Password harus mengandung satu huruf besar, satu huruf kecil, satu angka, dan satu simbol.'
        });
    }
    
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
    
    let user = await prisma.team.findUnique({ where: { teamName } });
    let role = 'USER';

    // Jika tidak ada di Team, cek di tabel Admin
    if (!user) {
      user = await prisma.admin.findUnique({ where: { username: teamName } });
      role = 'ADMIN';
    }

    // Jika tetap tidak ada
    if (!user) 
      return res.status(401).json({ success: false, message: "Akun tidak ditemukan" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
      return res.status(401).json({ success: false, message: "Password salah" });
    

    const token = jwt.sign({ 
      id: user.id, 
      name: role === 'ADMIN' ? user.username : user.teamName, 
      role
    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      message: `Login berhasil sebagai ${role}`,
      accessToken: token,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { 
    userRegister, 
    userLogin 
};