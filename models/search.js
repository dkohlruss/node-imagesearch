const mongoose = require('mongoose');

let SearchSchema = {
  term: {
    type: String,
    required: true,
    unique: false
  },
  when: {
    type: String,
    required: true,
    unique: false
  }
}

let Search = mongoose.model('Search', SearchSchema);

module.exports = {Search};
