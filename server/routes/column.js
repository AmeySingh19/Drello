const express = require('express');
const router = express.Router();
const Column = require('../models/column');
const Task = require('../models/task');

// POST /api/columns - Add a new column
router.post('/', async (req, res) => {
  try {
    const { boardId, title, order } = req.body;
    const column = new Column({ boardId, title, order });
    await column.save();
    res.status(201).json(column);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/columns/:id - Edit column (title/order)
router.put('/:id', async (req, res) => {
  try {
    const { title, order } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (order !== undefined) updateData.order = order;

    const column = await Column.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(column);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/columns/:id - Delete a column and its tasks
router.delete('/:id', async (req, res) => {
  try {
    await Task.deleteMany({ columnId: req.params.id });
    await Column.findByIdAndDelete(req.params.id);
    res.json({ message: 'Column deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
