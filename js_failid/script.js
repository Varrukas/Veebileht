// Viited:
// Algne funktsionaalsus, nüüdseks aegunud, kuid kasutame reset button funktsionaalsust.
// https://chatgpt.com/share/674dee9e-7364-800c-bd23-3d118c738673 Autor: Patrick
// 
// Esilehel olev kalkulaator.
// https://chatgpt.com/share/674ded66-f47c-800b-becc-1139f7d1f7d9 Autor: Marek

// Aruande lehel olev sõõriku graafik ning kulusi ja tulusi kajastav tabel.
// Doc fail GPT logidest, kuna vestluse link oli katkine.
// https://docs.google.com/document/d/1kHev-Dz5na5Fz7hY12SlRMsF-2cDx7SBs-rZNOqHsPo/edit?tab=t.0 Autor: Marten


// Lähtestame ja käivitame vastavad funktsioonid sõltuvalt leheküljest
document.addEventListener('DOMContentLoaded', function () {
    initializeData();
    handleBudgetSubmission();
    handleDataReset();
    handleExpenseSubmission();
    
    // Kontrolli, kas praegusel lehel on elemente, mis nõuavad aruanne funktsioone
    if (document.getElementById('myChart') || document.getElementById('detailed-table-body')) {
        displayReport();
    }

    // Kontrolli, kas on olemas säästukalkulaatori nupud
    const calculateButton = document.querySelector('.calculate-button');
    if (calculateButton) {
        calculateButton.addEventListener('click', function () {
            // Võta sisendväljade väärtused
            const income = parseFloat(document.querySelector('.income').value);
            const goal = parseFloat(document.querySelector('.goal').value);
            const percent = parseFloat(document.querySelector('.percent').value);
        
            // Kontrolli, kas kõik sisendid on korrektsed
            if (isNaN(income) || isNaN(goal) || isNaN(percent) || income <= 0 || goal <= 0 || percent <= 0 || percent > 100) {
                document.querySelector('.result').innerHTML = 'Palun sisesta korrektsed väärtused!';
                return;
            }
        
            // Arvuta säästetav summa kuus
            const savingsPerMonth = (income * percent) / 100;
        
            if (savingsPerMonth <= 0) {
                document.querySelector('.result').innerHTML = 'Säästetav summa peab olema suurem kui null!';
                return;
            }
        
            // Arvuta kuude arv
            const monthsNeeded = Math.ceil(goal / savingsPerMonth);
        
            // Kuvab tulemuse veebilehel
            document.querySelector(".result").innerHTML = `
                Kui säästate ${percent}% oma sissetulekust (€${savingsPerMonth.toFixed(2)} kuus), 
                saavutate oma eesmärgi €${goal} umbes ${monthsNeeded} kuuga.
            `;
        });
    }
});

// Initsialeerime andmed localStorage'is
// Seame tehingute listi tühjaks järjendiks
// Eelarvet seame 0
function initializeData() {
    if (localStorage.getItem('budget') === null) {
        localStorage.setItem('budget', '0');
    }

    if (localStorage.getItem('transactions') === null) {
        localStorage.setItem('transactions', JSON.stringify([]));
    }
}

// Seadistame eelarve vormi loogika
function handleBudgetSubmission() {
    const budgetForm = document.querySelector('.budget-input');
    if (budgetForm) {
        budgetForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const budgetValue = document.querySelector('.budget-value').value;

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

// Anname nupule andmete lähtestamise funktsionaalsuse
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

// Käsitleme kulude ja tulude lisamise nuppe ning lisame neile soovitud funktsionaalsuse
function handleExpenseSubmission() {
    const expenseForm = document.querySelector('.profit-expense-inputs');
    if (expenseForm) {
        // Kulu lisamine
        const addExpenseButton = document.querySelector('.add-expense-button');
        addExpenseButton.addEventListener('click', function (e) {
            e.preventDefault();
            const expenseValue = document.querySelector('.expense-value').value;
            const expenseDescription = document.querySelector('.expense-description').value.trim();

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

        // Tulu lisamine
        const addProfitButton = document.querySelector('.add-profit-button');
        addProfitButton.addEventListener('click', function (e) {
            e.preventDefault();
            const profitValue = document.querySelector('.profit-value').value;
            const profitDescription = document.querySelector('.profit-description').value.trim();

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

// Kogume andmed sisestustest, mis asuvad localStorage'is, arvutame nende põhjal vajalikud summad
// ja genereerime graafiku
function displayReport() {
    const chartCanvas = document.getElementById('myChart'); // Muudetud vastavalt teie HTML-le
    if (!chartCanvas) {
        console.error("Graafiku jaoks vajalik <canvas> element puudub!");
        return;
    }

    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

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
        type: 'doughnut', // Kasutame sõõrikgraafikut
        data: {
            labels: ['Tulu', 'Kulu'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#F5C28B', '#7F8C8D'],
                hoverBackgroundColor: ['#E2A970', '#5C5E5E'],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14,
                            family: "'Libre Franklin', sans-serif"
                        },
                        color: '#2C3E50'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value.toFixed(2)}€`;
                        }
                    }
                }
            },
            layout: {
                padding: {
                    top: 20,
                    bottom: 20
                }
            },
            cutout: '60%'
        }
    });

    // Tabeli täitmine
    const detailedTableBody = document.getElementById('detailed-table-body');
    if (detailedTableBody) {
        // Eemalda olemasolevad read
        detailedTableBody.innerHTML = '';
        
        transactions.forEach(transaction => {
            const row = document.createElement('tr');

            const typeCell = document.createElement('td');
            typeCell.textContent = transaction.type === 'income' ? 'Tulu' : 'Kulu';
            row.appendChild(typeCell);

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = transaction.description;
            row.appendChild(descriptionCell);

            const amountCell = document.createElement('td');
            amountCell.textContent = `${transaction.amount.toFixed(2)}€`;
            row.appendChild(amountCell);

            detailedTableBody.appendChild(row);
        });
    }
}
