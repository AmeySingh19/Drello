const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  title: { type: String, required: true },
  order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Column', columnSchema);
