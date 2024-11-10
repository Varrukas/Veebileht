let savingsChart;
let goalAmount = 0;
let expensesAmount = 0;

function initializeChart() {
    const ctx = document.getElementById('savingsChart').getContext('2d');
    savingsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Kulud', 'Jääk'],
            datasets: [{
                data: [expensesAmount, goalAmount - expensesAmount],
                backgroundColor: ['#ff6384', '#36a2eb'],
                hoverBackgroundColor: ['#ff6384', '#36a2eb']
            }]
        },
        options: {
            circumference: Math.PI,
            rotation: -Math.PI,
            cutout: '80%',
        }
    });
}

function updateChart() {
    goalAmount = parseFloat(document.getElementById('goal').value) || 0;
    expensesAmount = parseFloat(document.getElementById('expenses').value) || 0;

    if (goalAmount > 0) {
        savingsChart.data.datasets[0].data = [expensesAmount, goalAmount -expensesAmount];
        savingsChart.update();

    }
}

initializeChart();