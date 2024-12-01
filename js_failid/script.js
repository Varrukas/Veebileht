// script.js

// Function to initialize data from localStorage
function initializeData() {
    if (localStorage.getItem('budget') === null) {
        localStorage.setItem('budget', '0');
    }

    if (localStorage.getItem('transactions') === null) {
        localStorage.setItem('transactions', JSON.stringify([]));
    }
}

// Function to handle budget submission on index.html
function handleBudgetSubmission() {
    const budgetForm = document.querySelector('.budget-input');
    if (budgetForm) {
        budgetForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const budgetValue = document.querySelector('.budget-value').value;

            // Input validation
            if (!budgetValue || isNaN(budgetValue) || parseFloat(budgetValue) <= 0) {
                alert('Palun sisestage korrektne eelarve summa.');
                return;
            }

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
    const expenseForm = document.querySelector('.profit-expense-inputs');
    if (expenseForm) {
        // Handle adding expense
        const addExpenseButton = document.querySelector('.add-expense-button');
        addExpenseButton.addEventListener('click', function (e) {
            e.preventDefault();
            const expenseValue = document.querySelector('.expense-value').value;
            const expenseDescription = document.querySelector('.expense-description').value.trim();

            // Input validation for expense
            if (!expenseValue || isNaN(expenseValue) || parseFloat(expenseValue) <= 0) {
                alert('Palun sisestage korrektne kulu summa.');
                return;
            }

            if (!expenseDescription) {
                alert('Palun sisestage kulu kirjeldus.');
                return;
            }

            const newExpense = {
                date: new Date().toLocaleDateString('et-EE'),
                description: expenseDescription,
                amount: parseFloat(expenseValue),
                type: 'expense',
            };

            let transactions = JSON.parse(localStorage.getItem('transactions'));
            transactions.push(newExpense);
            localStorage.setItem('transactions', JSON.stringify(transactions));

            alert('Kulu on lisatud!');
            expenseForm.reset();
        });

        // Handle adding income
        const addProfitButton = document.querySelector('.add-profit-button');
        addProfitButton.addEventListener('click', function (e) {
            e.preventDefault();
            const profitValue = document.querySelector('.profit-value').value;
            const profitDescription = document.querySelector('.profit-description').value.trim();

            // Input validation for income
            if (!profitValue || isNaN(profitValue) || parseFloat(profitValue) <= 0) {
                alert('Palun sisestage korrektne tulu summa.');
                return;
            }

            if (!profitDescription) {
                alert('Palun sisestage tulu kirjeldus.');
                return;
            }

            const newIncome = {
                date: new Date().toLocaleDateString('et-EE'),
                description: profitDescription,
                amount: parseFloat(profitValue),
                type: 'income',
            };

            let transactions = JSON.parse(localStorage.getItem('transactions'));
            transactions.push(newIncome);
            localStorage.setItem('transactions', JSON.stringify(transactions));

            alert('Tulu on lisatud!');
            expenseForm.reset();
        });
    }
}

// Function to display data on aruanne.html
// Function to display data as a doughnut chart on aruanne.html
// Function to display data as a doughnut chart on aruanne.html
// Function to display data as a bar chart on aruanne.html
function displayReport() {
    const chartCanvas = document.getElementById('doughnutChart'); // Graafiku lõuend (muuda vastavalt HTML-i id-le)
    if (!chartCanvas) {
        console.error("Graafiku jaoks vajalik <canvas> element puudub!");
        return;
    }

    // Andmete saamine localStorage-st
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Andmete ettevalmistamine
    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            income += parseFloat(transaction.amount);
        } else if (transaction.type === 'expense') {
            expense += parseFloat(transaction.amount);
        }
    });

    // Graafiku loomine
    const ctx = chartCanvas.getContext('2d');
    if (window.barChartInstance) {
        window.barChartInstance.destroy(); // Eemalda vana graafik, kui see on olemas
    }

    window.barChartInstance = new Chart(ctx, {
        type: 'bar', // Kasutame ribadiagrammi
        data: {
            labels: ['Tulu', 'Kulu'], // Telje sildid
            datasets: [
                {
                    label: 'Tehingud (€)',
                    data: [income, expense], // Andmed: tulu ja kulu
                    backgroundColor: ['#4CAF50', '#FF5722'], // Tulu: roheline, Kulu: punane
                    borderColor: ['#388E3C', '#D32F2F'],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true, // Y-telg algab nullist
                },
            },
            plugins: {
                legend: {
                    position: 'top', // Legendi asukoht
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value.toFixed(2)}€`;
                        },
                    },
                },
            },
        },
    });
}

// Kutsu funktsiooni peale DOM-i laadimist
document.addEventListener('DOMContentLoaded', displayReport);






// Initialize and run appropriate functions based on the page
document.addEventListener('DOMContentLoaded', function () {
    initializeData();
    handleBudgetSubmission();
    handleDataReset();
    handleExpenseSubmission();
    displayReport();
});
