const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

// ...

// Use CORS middleware
app.use(cors());

// ...

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://harshmohan1422:harsh%401422@harshcluster.o6eb3sr.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error(err));

// Define a schema for audio files
const audioSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
});

const Audio = mongoose.model('Audio', audioSchema);

app.post('/api/upload', upload.single('audio'), async (req, res) => {
  try {
    const newAudio = new Audio({
      name: req.file.originalname,
      data: req.file.buffer,
    });
    await newAudio.save();
    res.status(200).send('Audio uploaded successfully');
  } catch (error) {
    res.status(500).send('Error uploading audio');
  }
});
app.get('/api/getAudioFiles', async (req, res) => {
    try {
      const audioFiles = await Audio.find({}, 'name');
      res.status(200).json(audioFiles);
    } catch (error) {
      res.status(500).send('Error retrieving audio files');
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
