const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  title: { type: String, default: 'New Board' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Board', boardSchema);
