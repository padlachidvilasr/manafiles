const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'dist'))); // React build folder
app.use('/uploads', express.static('uploads'));

// ... (previous middleware and routes remain same)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, req.body.fileName + '-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    const fileName = req.body.fileName;
    if (!fileName || !req.file) return res.status(400).json({ message: 'File and name are required!' });
    res.json({ message: `File uploaded successfully!`, filePath: `/uploads/${req.file.filename}` });
});

app.listen(port, () => {
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
    console.log(`Server running at http://localhost:${port}`);
});