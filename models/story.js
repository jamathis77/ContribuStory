const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const storySchema = new mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String},
  authors: [ {type: String} ]
})

storySchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    authors: this.authors
  }
}

module.exports = mongoose.model('Story', storySchema);
