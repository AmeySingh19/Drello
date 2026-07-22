const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// POST /api/tasks - Create a new task card
router.post('/', async (req, res) => {
  try {
    const { columnId, title, description, order } = req.body;
    const task = new Task({ columnId, title, description, order });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id - Edit a task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, order } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (order !== undefined) updateData.order = order;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id/move - Move task to another column (and optionally update order)
router.put('/:id/move', async (req, res) => {
  try {
    const { columnId, order } = req.body;
    const updateData = {};
    if (columnId !== undefined) updateData.columnId = columnId;
    if (order !== undefined) updateData.order = order;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
