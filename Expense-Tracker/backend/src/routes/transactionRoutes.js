import { Router } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';

const router = Router();

// Validate transaction ID
const isValidId = (id) => mongoose.isValidObjectId(id);

// Validate transaction input
function validateTransaction(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate || data.title !== undefined) {
    if (typeof data.title !== 'string' || !data.title.trim()) {
      errors.push('A transaction title is required');
    }
  }

  if (!isUpdate || data.amount !== undefined) {
    if (
      data.amount === '' ||
      data.amount === null ||
      data.amount === undefined ||
      !Number.isFinite(Number(data.amount)) ||
      Number(data.amount) <= 0
    ) {
      errors.push('Amount must be greater than zero');
    }
  }

  if (
    data.type !== undefined &&
    !['income', 'expense'].includes(data.type)
  ) {
    errors.push('Type must be income or expense');
  }

  if (
    data.category !== undefined &&
    (typeof data.category !== 'string' || !data.category.trim())
  ) {
    errors.push('Category must be a non-empty string');
  }

  if (
    data.date !== undefined &&
    (Number.isNaN(Date.parse(data.date)) ||
      !Number.isFinite(new Date(data.date).getTime()))
  ) {
    errors.push('Please provide a valid date');
  }

  return errors;
}

// GET: Retrieve all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ date: -1 })
      .lean();

    res.json(transactions);
  } catch (error) {
    console.error('Retrieve transactions error:', error.message);
    res.status(500).json({ message: 'Failed to retrieve transactions' });
  }
});

// POST: Create a transaction
router.post('/', async (req, res) => {
  try {
    const errors = validateTransaction(req.body);

    if (errors.length) {
      return res.status(400).json({ message: errors.join('. ') });
    }

    const { title, amount, type, category, date } = req.body;

    const transaction = await Transaction.create({
      title: title.trim(),
      amount: Number(amount),
      type,
      category: category?.trim() || 'Other',
      ...(date ? { date: new Date(date) } : {}),
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error.message);
    res.status(500).json({ message: 'Failed to save transaction' });
  }
});

// PUT: Update an existing transaction
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const errors = validateTransaction(req.body, true);

    if (errors.length) {
      return res.status(400).json({ message: errors.join('. ') });
    }

    const allowedFields = ['title', 'amount', 'type', 'category', 'date'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.title !== undefined) {
      updates.title = updates.title.trim();
    }

    if (updates.amount !== undefined) {
      updates.amount = Number(updates.amount);
    }

    if (updates.category !== undefined) {
      updates.category = updates.category.trim();
    }

    if (updates.date !== undefined) {
      updates.date = new Date(updates.date);
    }

    const transaction = await Transaction.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Update transaction error:', error.message);
    res.status(500).json({ message: 'Failed to update transaction' });
  }
});

// DELETE: Remove a transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error.message);
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
});

// GET: Monthly summary
// Example: /api/transactions/summary/monthly?year=2026&month=10
router.get('/summary/monthly', async (req, res) => {
  try {
    const now = new Date();
    const year = req.query.year === undefined ? now.getFullYear() : Number(req.query.year);
    const month = req.query.month === undefined ? now.getMonth() + 1 : Number(req.query.month);

    if (
      !Number.isInteger(year) ||
      year < 1900 ||
      year > 9999 ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      return res.status(400).json({ message: 'Provide a valid year and month' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const summary = await Transaction.aggregate([
      { $match: { date: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      year,
      month,
      income: 0,
      expenses: 0,
      transactionCount: 0,
    };

    for (const item of summary) {
      if (item._id === 'income') result.income = item.total;
      if (item._id === 'expense') result.expenses = item.total;
      result.transactionCount += item.count;
    }

    result.balance = result.income - result.expenses;

    res.json(result);
  } catch (error) {
    console.error('Monthly summary error:', error.message);
    res.status(500).json({ message: 'Failed to generate monthly summary' });
  }
});

// GET: Yearly summary
// Example: /api/transactions/summary/yearly?year=2026
router.get('/summary/yearly', async (req, res) => {
  try {
    const now = new Date();
    const year = req.query.year === undefined ? now.getFullYear() : Number(req.query.year);

    if (!Number.isInteger(year) || year < 1900 || year > 9999) {
      return res.status(400).json({ message: 'Provide a valid year' });
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const summary = await Transaction.aggregate([
      { $match: { date: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      year,
      income: 0,
      expenses: 0,
      transactionCount: 0,
    };

    for (const item of summary) {
      if (item._id === 'income') result.income = item.total;
      if (item._id === 'expense') result.expenses = item.total;
      result.transactionCount += item.count;
    }

    result.balance = result.income - result.expenses;

    res.json(result);
  } catch (error) {
    console.error('Yearly summary error:', error.message);
    res.status(500).json({ message: 'Failed to generate yearly summary' });
  }
});

// GET: Expense totals grouped by category
// Example: /api/transactions/summary/categories
router.get('/summary/categories', async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1,
          count: 1,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error('Category summary error:', error.message);
    res.status(500).json({ message: 'Failed to generate category summary' });
  }
});

export default router;
