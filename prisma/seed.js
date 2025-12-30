require('dotenv').config(); 

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  // upsert -> agar jika di-run berkali-kali tidak error (karena teamName unique)
  await prisma.admin.upsert({
    where: { username: 'admin_hackathon' },
    update: {},
    create: {
      username: 'admin_hackathon',
      password: hashedPassword,
      isBinusian: true,
    },
  });

  console.log('Seed Admin Berhasil!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());