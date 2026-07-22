const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  columnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Column', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Task', taskSchema);
