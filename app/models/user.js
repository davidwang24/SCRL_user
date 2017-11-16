const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
  stage:{
    type: Number,
    required: true
  },
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  message:{
    type: String,
  }
});

const User = module.exports = mongoose.model('User', UserSchema);