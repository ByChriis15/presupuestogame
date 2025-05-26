
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let income = parseFloat(localStorage.getItem('income')) || 0;
let chart;
let editIndex = null;

function updateUI(filterDate = null) {
  const list = document.getElementById('expense-list');
  list.innerHTML = '';
  let total = 0;
  const visibleExpenses = filterDate
    ? expenses.filter(e => e.date === filterDate)
    : expenses;

  visibleExpenses.forEach((e, i) => {
    const isIncome = e.category === "Ingreso";
    const color = isIncome ? "green" : "red";
    const sign = isIncome ? "+" : "-";
    total += isIncome ? 0 : e.amount;

    const li = document.createElement('li');
    li.className = 'expense-item';
    li.innerHTML = `
      <span>${e.desc} (${e.category})<br><small>${e.date}</small></span>
      <span class="amount" style="color:${color};">${sign}$${e.amount.toFixed(2)}</span>
      <button onclick="editExpense(${i})">✏️</button>
      <button onclick="deleteExpense(${i})">🗑️</button>
    `;
    list.appendChild(li);
  });

  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
  document.getElementById('income').textContent = `$${income.toFixed(2)}`;
  document.getElementById('balance').textContent = `$${(income - total).toFixed(2)}`;
  updateChart(visibleExpenses);
}

function updateChart(data) {
  const ctx = document.getElementById('chart').getContext('2d');
  const categoryTotals = data.reduce((acc, e) => {
    if (e.category !== 'Ingreso') {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
    }
    return acc;
  }, {});

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        label: 'Gastos',
        data: values,
        backgroundColor: ['#765D67','#6D3C52','#4B2138']
      }]
    }
  });
}

document.getElementById('expense-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const desc = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;
  expenses.push({ desc, amount, category, date });
  localStorage.setItem('expenses', JSON.stringify(expenses));
  e.target.reset();
  updateUI();
});

function editExpense(index) {
  editIndex = index;
  const item = expenses[index];
  document.getElementById('edit-desc').value = item.desc;
  document.getElementById('edit-amount').value = item.amount;
  document.getElementById('edit-date').value = item.date;
  document.getElementById('edit-modal').classList.add('active');
}

function saveEdit() {
  const desc = document.getElementById('edit-desc').value;
  const amount = parseFloat(document.getElementById('edit-amount').value);
  const date = document.getElementById('edit-date').value;
  if (desc && !isNaN(amount) && date) {
    expenses[editIndex] = { ...expenses[editIndex], desc, amount, date };
    localStorage.setItem('expenses', JSON.stringify(expenses));
    closeEditModal();
    updateUI();
  }
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.remove('active');
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  updateUI();
}

function openIncomeModal() {
  document.getElementById('income-modal').classList.add('active');
}

function closeIncomeModal() {
  document.getElementById('income-modal').classList.remove('active');
}

function addIncome() {
  const val = parseFloat(document.getElementById('income-amount').value);
  const date = document.getElementById('income-date').value;
  if (!isNaN(val) && date) {
    income += val;
    expenses.push({ desc: 'Ingreso manual', amount: val, category: 'Ingreso', date });
    localStorage.setItem('income', income);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    closeIncomeModal();
    updateUI();
  }
}

function exportCSV() {
  const rows = [['Descripción', 'Categoría', 'Monto', 'Fecha']];
  expenses.forEach(e => rows.push([e.desc, e.category, e.amount, e.date]));
  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', 'presupuesto.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  document.body.style.backgroundColor = document.body.classList.contains('dark') ? '#1B0C1A' : 'var(--light)';
}

function filterByDate() {
  const filterDate = document.getElementById('filter-date').value;
  updateUI(filterDate);
}

updateUI();
