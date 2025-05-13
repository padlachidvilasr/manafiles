const mongoose = require('mongoose');
const uri = "mongodb+srv://chidvilaspadla12:Chiddu@2005@manafiles.yxdasxy.mongodb.net/manafiles?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));