const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/pinterstclone");

const postSchema = mongoose.Schema({
  postText: {
    type: String,
    required: true
  },
  image:{
    type: String
  },
  
  createDate: {
    type: Date,
    default: Date.now
  },
  users:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
});

module.exports = mongoose.model('Post', postSchema);

