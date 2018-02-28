const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({

  username: {type: String},
  password: {type: String},
  // email: {type: String},
  // charCount: {type: Number}

});

UserSchema.plugin(passportLocalMongoose);


// const User = mongoose.model('User', UserSchema);
//
// module.exports = {User};

module.exports = mongoose.model('User', UserSchema);
