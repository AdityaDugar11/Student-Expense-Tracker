// ====================================
// Expense Tracker App - Frontend Logic
// Student Expense Tracker
// ====================================

// API base URL - change this when deploying
const API_URL = '/api/expenses';

// grab all the elements we need
const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseCategoryInput = document.getElementById('expense-category');
const expenseDateInput = document.getElementById('expense-date');
const submitBtn = document.getElementById('submit-btn');
const statusMsg = document.getElementById('status-msg');
const expenseList = document.getElementById('expense-list');
const loadingDiv = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');
const expenseCount = document.getElementById('expense-count');
const navTotal = document.getElementById('nav-total');

// emoji map for categories
const categoryEmojis = {
    coffee: '☕',
    travel: '🚗',
    food: '🍕',
    other: '📦'
};

// ====================================
// SET TODAY'S DATE AS DEFAULT
// ====================================

// when the page loads, set the date input to today
const today = new Date().toISOString().split('T')[0];
expenseDateInput.value = today;

// ====================================
// FETCH ALL EXPENSES
// ====================================

async function fetchExpenses() {
    try {
        // show loading
        loadingDiv.style.display = 'flex';
        emptyState.style.display = 'none';
        expenseList.innerHTML = '';

        // make the GET request to our API
        const response = await fetch(API_URL);
        const expenses = await response.json();

        // hide loading
        loadingDiv.style.display = 'none';

        // if no expenses, show empty state
        if (expenses.length === 0) {
            emptyState.style.display = 'block';
            expenseCount.textContent = '0 entries';
            navTotal.textContent = 'Total: ₹0';
            return;
        }

        // calculate total
        let total = 0;

        // loop through each expense and create a card
        expenses.forEach((expense) => {
            total += expense.amount;
            const card = createExpenseCard(expense);
            expenseList.appendChild(card);
        });

        // update the count and total
        expenseCount.textContent = expenses.length + ' entries';
        navTotal.textContent = 'Total: ₹' + total.toFixed(0);

    } catch (error) {
        console.log('Error fetching expenses:', error);
        loadingDiv.style.display = 'none';
        showStatus('Failed to load expenses. Is the server running?', 'error');
    }
}

// ====================================
// CREATE AN EXPENSE CARD (HTML)
// ====================================

function createExpenseCard(expense) {
    const card = document.createElement('div');
    card.className = 'expense-card';

    // format the date nicely
    const date = new Date(expense.date);
    const dateStr = date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    // get the emoji for this category
    const emoji = categoryEmojis[expense.category] || '📦';

    // build the card HTML
    card.innerHTML = `
        <div class="expense-left">
            <div class="expense-emoji ${expense.category}">${emoji}</div>
            <div class="expense-info">
                <h3>${expense.name}</h3>
                <p>${expense.category} · ${dateStr}</p>
            </div>
        </div>
        <div class="expense-right">
            <span class="expense-amount">₹${expense.amount}</span>
            <button class="delete-btn" onclick="deleteExpense('${expense._id}')">Delete</button>
        </div>
    `;

    return card;
}

// ====================================
// ADD A NEW EXPENSE
// ====================================

expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // stop the form from refreshing the page

    // get the values from the form
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategoryInput.value;
    const date = expenseDateInput.value;

    // basic check
    if (!name || !amount || !category) {
        showStatus('Please fill in all fields!', 'error');
        return;
    }

    // disable button while adding
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';

    try {
        // make the POST request
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, amount, category, date })
        });

        if (!response.ok) {
            throw new Error('Failed to add expense');
        }

        const newExpense = await response.json();
        console.log('Added:', newExpense);

        // show success message
        showStatus('Expense added successfully! 🎉', 'success');

        // clear the form
        expenseForm.reset();
        expenseDateInput.value = today; // keep today's date

        // refresh the list
        fetchExpenses();

    } catch (error) {
        console.log('Error adding expense:', error);
        showStatus('Failed to add expense. Try again!', 'error');
    } finally {
        // re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Expense 💸';
    }
});

// ====================================
// DELETE AN EXPENSE
// ====================================

async function deleteExpense(id) {
    try {
        // make the DELETE request
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete');
        }

        console.log('Deleted expense:', id);
        showStatus('Expense deleted! 🗑️', 'success');

        // refresh the list
        fetchExpenses();

    } catch (error) {
        console.log('Error deleting expense:', error);
        showStatus('Failed to delete expense. Try again!', 'error');
    }
}

// ====================================
// SHOW STATUS MESSAGE
// ====================================

function showStatus(message, type) {
    statusMsg.textContent = message;
    statusMsg.className = 'status-msg ' + type;

    // hide the message after 3 seconds
    setTimeout(() => {
        statusMsg.style.display = 'none';
        statusMsg.className = 'status-msg';
    }, 3000);
}

// ====================================
// LOAD EXPENSES WHEN PAGE OPENS
// ====================================

fetchExpenses();
