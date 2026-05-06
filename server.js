// ====================================
// Student Expense Tracker - Server
// Made by Aditya (1st Year Student)
// ====================================

// importing all the packages we need
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// load the .env file so we can use the MongoDB URL
dotenv.config();

// create the express app
const app = express();
const PORT = process.env.PORT || 3000;

// middleware - these help our server understand JSON and handle requests
app.use(cors());                          // allows requests from anywhere
app.use(express.json());                  // parses JSON data from requests
app.use(express.static(path.join(__dirname, 'public')));  // serve our frontend files

// ====================================
// MongoDB Connection
// ====================================

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas!');
  })
  .catch((err) => {
    console.log('❌ MongoDB connection error:', err.message);
  });

// ====================================
// Expense Schema (like a blueprint)
// ====================================

// this defines what an expense looks like in our database
const expenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true        // every expense must have a name
  },
  amount: {
    type: Number,
    required: true        // every expense must have an amount
  },
  category: {
    type: String,
    required: true,
    enum: ['coffee', 'travel', 'food', 'other']   // only these categories allowed
  },
  date: {
    type: Date,
    default: Date.now     // if no date given, use today's date
  }
});

// create the model from the schema
const Expense = mongoose.model('Expense', expenseSchema);

// ====================================
// API Routes
// ====================================

// GET all expenses - when someone visits /api/expenses
app.get('/api/expenses', async (req, res) => {
  try {
    // find all expenses, newest first
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.log('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error, could not fetch expenses' });
  }
});

// POST a new expense - when someone adds a new expense
app.post('/api/expenses', async (req, res) => {
  try {
    // get the data from the request body
    const { name, amount, category, date } = req.body;

    // basic validation
    if (!name || !amount || !category) {
      return res.status(400).json({ message: 'Please fill in all fields!' });
    }

    // create a new expense
    const newExpense = new Expense({
      name,
      amount,
      category,
      date: date || Date.now()
    });

    // save it to the database
    const savedExpense = await newExpense.save();
    console.log('💰 New expense added:', savedExpense.name);

    res.status(201).json(savedExpense);
  } catch (error) {
    console.log('Error adding expense:', error);
    res.status(500).json({ message: 'Server error, could not add expense' });
  }
});

// DELETE an expense - when someone wants to remove an expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found!' });
    }

    console.log('🗑️ Expense deleted:', deletedExpense.name);
    res.json({ message: 'Expense deleted successfully!' });
  } catch (error) {
    console.log('Error deleting expense:', error);
    res.status(500).json({ message: 'Server error, could not delete expense' });
  }
});

// ====================================
// Serve the frontend pages
// ====================================

// landing page (scrollytelling)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// expense tracker app page
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// ====================================
// Start the server
// ====================================

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Open your browser and go to http://localhost:${PORT}`);
});
