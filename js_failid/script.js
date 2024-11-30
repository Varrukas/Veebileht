// script.js

// Function to initialize data from localStorage
function initializeData() {
    if (localStorage.getItem('budget') === null) {
        localStorage.setItem('budget', '0');
    }

    if (localStorage.getItem('expenses') === null) {
        localStorage.setItem('expenses', JSON.stringify([]));
    }
}

// Function to handle budget submission on index.html
function handleBudgetSubmission() {
    const budgetForm = document.querySelector('.budget-input');
    if (budgetForm) {
        budgetForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const budgetValue = document.querySelector('.budget-value').value;
            localStorage.setItem('budget', budgetValue);
            alert('Eelarve on salvestatud!');
            budgetForm.reset();
        });
    }
}

// Function to handle reset data on index.html
function handleDataReset() {
    const resetButton = document.querySelector('.reset-data');
    if (resetButton) {
        resetButton.addEventListener('click', function () {
            if (confirm('Kas olete kindel, et soovite kõik andmed lähtestada?')) {
                localStorage.clear();
                initializeData();
                alert('Kõik andmed on lähtestatud.');
            }
        });
    }
}

// Function to handle expense submission on kulud.html
function handleExpenseSubmission() {
    const expenseForm = document.querySelector('.expense-inputs');
    if (expenseForm) {
        expenseForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const expenseValue = document.querySelector('.expense-value').value;
            const expenseDescription = document.querySelector('.expense-description').value;

            const newExpense = {
                date: new Date().toLocaleDateString('et-EE'),
                description: expenseDescription,
                amount: parseFloat(expenseValue),
            };

            let expenses = JSON.parse(localStorage.getItem('expenses'));
            expenses.push(newExpense);
            localStorage.setItem('expenses', JSON.stringify(expenses));

            alert('Kulu on lisatud!');
            expenseForm.reset();
        });
    }
}

// Function to display data on aruanne.html
function displayReport() {
    const transactionTableBody = document.querySelector('.transaction-table tbody');
    if (transactionTableBody) {
        const expenses = JSON.parse(localStorage.getItem('expenses'));
        transactionTableBody.innerHTML = '';

        expenses.forEach(function (expense) {
            const row = document.createElement('tr');

            const dateCell = document.createElement('td');
            dateCell.textContent = expense.date;
            row.appendChild(dateCell);

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = expense.description;
            row.appendChild(descriptionCell);

            const amountCell = document.createElement('td');
            amountCell.textContent = `-${expense.amount}€`;
            amountCell.classList.add('expense');
            row.appendChild(amountCell);

            transactionTableBody.appendChild(row);
        });
    }
}

// Initialize and run appropriate functions based on the page
document.addEventListener('DOMContentLoaded', function () {
    initializeData();
    handleBudgetSubmission();
    handleDataReset();
    handleExpenseSubmission();
    displayReport();
});
