const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/userRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));

// Main Route
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.json({
    message: "API FinPro 2",
    status: "Server Ready :) "
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}`));