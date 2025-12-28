const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || null;

  // Error spesifik dari Prisma (Unique Constraint)
  if (err.code === 'P2002') {
    statusCode = 400;
    const field = err.meta.target.split('_')[1]; // Mengambil nama field yang duplikat
    message = "Data sudah terdaftar";
    errors = [{
      field: field,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} sudah digunakan, gunakan yang lain.`
    }];
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    error: errors
  });
};

module.exports = errorMiddleware;