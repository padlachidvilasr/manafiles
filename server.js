import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}
app.use('/uploads', express.static(uploadsPath));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsPath),
  filename: (req, file, cb) => cb(null, req.body.fileName + '-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  const fileName = req.body.fileName;
  const userEmail = req.body.userEmail;
  if (!fileName || !req.file || !userEmail) return res.status(400).json({ message: 'File, name, and email are required!' });

  const File = mongoose.model('File', new mongoose.Schema({
    userEmail: { type: String, required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }));
  const newFile = new File({
    userEmail,
    fileName,
    filePath: `/uploads/${req.file.filename}`
  });
  await newFile.save();

  res.json({ message: `File uploaded successfully!`, filePath: `/uploads/${req.file.filename}` });
});

app.get('/files', async (req, res) => {
  const userEmail = req.query.userEmail;
  const File = mongoose.model('File', new mongoose.Schema({
    userEmail: { type: String, required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }));
  const files = await File.find({ userEmail });
  res.json(files);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const MONGO_URI = 'mongodb+srv://chidvilaspadla12:Chiddu@2005@manafiles.yxdasxy.mongodb.net/manafiles?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));