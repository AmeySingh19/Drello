const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const Column = require('../models/column');
const Task = require('../models/task');

// POST /api/boards - Create a new board
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    const board = new Board({ title });
    await board.save();
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/boards - Get all boards
router.get('/', async (req, res) => {
  try {
    const boards = await Board.find().sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/boards/:id - Get a single board with columns and tasks
router.get('/:id', async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const columns = await Column.find({ boardId: board._id }).sort('order');
    const columnIds = columns.map(col => col._id);
    const tasks = await Task.find({ columnId: { $in: columnIds } }).sort('order');

    const columnsWithTasks = columns.map(col => ({
      ...col.toObject(),
      tasks: tasks.filter(task => task.columnId.toString() === col._id.toString())
    }));

    res.json({ board, columns: columnsWithTasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/boards/:id - Update board title
router.put('/:id', async (req, res) => {
  try {
    const { title } = req.body;
    const board = await Board.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/boards/:id - Delete a board and all its data
router.delete('/:id', async (req, res) => {
  try {
    const columns = await Column.find({ boardId: req.params.id });
    const columnIds = columns.map(col => col._id);

    await Task.deleteMany({ columnId: { $in: columnIds } });
    await Column.deleteMany({ boardId: req.params.id });
    await Board.findByIdAndDelete(req.params.id);

    res.json({ message: 'Board deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
