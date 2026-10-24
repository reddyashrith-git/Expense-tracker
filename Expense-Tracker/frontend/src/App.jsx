import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import './App.css'
const API_URL = 'http://localhost:5000/api'

function App() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().slice(0, 10),
  })

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
    try {
      setError('')
      const response = await fetch(`${API_URL}/transactions`)

      if (!response.ok) {
        throw new Error('Could not load transactions')
      }

      const data = await response.json()
      setTransactions(Array.isArray(data) ? data : data.transactions || [])
    } catch (err) {
      setError(
        'Could not load transactions. Check your backend API route and server.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function addTransaction(event) {
    event.preventDefault()
    setError('')

    const amount = Number(form.amount)

    if (!form.title.trim() || !Number.isFinite(amount) || amount <= 0) {
      setError('Enter a description and an amount greater than zero.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          amount,
        }),
      })

      if (!response.ok) {
        throw new Error('Could not save transaction')
      }

      setForm({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        date: new Date().toISOString().slice(0, 10),
      })

      await loadTransactions()
    } catch {
      setError(
        'Could not save transaction. Your backend may use different API routes or field names.'
      )
    }
  }

  async function deleteTransaction(id) {
    if (!window.confirm('Delete this transaction?')) return

    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Delete failed')

      await loadTransactions()
    } catch {
      setError(
        'Could not delete transaction. Check your backend delete route.'
      )
    }
  }

  const getAmount = (transaction) => Number(transaction.amount) || 0

  const isIncome = (transaction) =>
    transaction.type === 'income' ||
    transaction.type === 'Income'

  const income = transactions
    .filter(isIncome)
    .reduce((sum, transaction) => sum + getAmount(transaction), 0)

  const expenses = transactions
    .filter((transaction) => !isIncome(transaction))
    .reduce((sum, transaction) => sum + getAmount(transaction), 0)

  const balance = income - expenses
  const expenseByCategory = Object.values(
  transactions
    .filter((transaction) => !isIncome(transaction))
    .reduce((groups, transaction) => {
      const category = transaction.category || 'Other'

      if (!groups[category]) {
        groups[category] = { name: category, value: 0 }
      }

      groups[category].value += getAmount(transaction)
      return groups
    }, {})
)

const incomeExpenseData = [
  { name: 'Income', amount: income },
  { name: 'Expenses', amount: expenses },
]

const monthlyExpenses = Object.values(
  transactions
    .filter((transaction) => !isIncome(transaction))
    .reduce((groups, transaction) => {
      const date = transaction.date
        ? new Date(transaction.date)
        : new Date()

      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`

      if (!groups[month]) {
        groups[month] = { month, expenses: 0 }
      }

      groups[month].expenses += getAmount(transaction)
      return groups
    }, {})
).sort((a, b) => a.month.localeCompare(b.month))

  const formatMoney = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount)

  return (
    <main className="app">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">₹</span>
          <span>Expense<span className="brand-accent">Tracker</span></span>
        </a>
        <span className="status">
          <span className="status-dot" />
          Personal Finance
        </span>
      </header>

      <section className="welcome">
        <p className="eyebrow">YOUR MONEY, YOUR CONTROL</p>
        <h1>Financial Overview</h1>
        <p className="subtitle">
          Track your income, manage expenses, and understand your spending.
        </p>
      </section>

      {error && <div className="error-message">{error}</div>}

      <section className="summary-grid">
        <article className="summary-card balance-card">
          <p>Total Balance</p>
          <h2>{formatMoney(balance)}</h2>
          <span>Income minus expenses</span>
        </article>

        <article className="summary-card">
          <p>Total Income</p>
          <h2>{formatMoney(income)}</h2>
          <span className="positive">Money received</span>
        </article>

        <article className="summary-card">
          <p>Total Expenses</p>
          <h2>{formatMoney(expenses)}</h2>
          <span className="negative">Money spent</span>
        </article>
      </section>
<section className="charts-grid">
  <article className="panel chart-panel">
    <div className="panel-heading">
      <div>
        <h2>Expenses by Category</h2>
        <p>Understand where your money goes.</p>
      </div>
    </div>

    {expenseByCategory.length === 0 ? (
      <div className="empty-state">No expense data available yet.</div>
    ) : (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={expenseByCategory}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={90}
            paddingAngle={3}
          >
            {expenseByCategory.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={[
                  '#635bdb',
                  '#25b981',
                  '#f59e0b',
                  '#e15d6b',
                  '#3b82f6',
                  '#a855f7',
                  '#14b8a6',
                ][index % 7]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )}
  </article>

  <article className="panel chart-panel">
    <div className="panel-heading">
      <div>
        <h2>Income vs Expenses</h2>
        <p>Compare money received and spent.</p>
      </div>
    </div>

    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={incomeExpenseData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
        <Bar
          dataKey="amount"
          fill="#635bdb"
          radius={[7, 7, 0, 0]}
          maxBarSize={65}
        />
      </BarChart>
    </ResponsiveContainer>
  </article>

  <article className="panel chart-panel monthly-chart">
    <div className="panel-heading">
      <div>
        <h2>Monthly Spending</h2>
        <p>Track your expenses over time.</p>
      </div>
    </div>

    {monthlyExpenses.length === 0 ? (
      <div className="empty-state">Add expenses to see your monthly spending.</div>
    ) : (
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={monthlyExpenses}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
          <Bar
            dataKey="expenses"
            fill="#25b981"
            radius={[7, 7, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    )}
  </article>
</section>
      <section className="content-grid">
        <article className="panel form-panel">
          <div className="panel-heading">
            <div>
              <h2>Add Transaction</h2>
              <p>Record your income or spending.</p>
            </div>
            <span className="heading-icon">＋</span>
          </div>

          <form onSubmit={addTransaction}>
            <label htmlFor="title">Description</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Grocery shopping"
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              required
            />

            <label htmlFor="amount">Amount (₹)</label>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(event) =>
                setForm({ ...form, amount: event.target.value })
              }
              required
            />

            <div className="field-row">
              <div>
                <label htmlFor="type">Transaction Type</label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(event) =>
                    setForm({ ...form, type: event.target.value })
                  }
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                >
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Shopping</option>
                  <option>Bills</option>
                  <option>Education</option>
                  <option>Health</option>
                  <option>Salary</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={(event) =>
                setForm({ ...form, date: event.target.value })
              }
              required
            />

            <button className="submit-button" type="submit">
              + Add Transaction
            </button>
          </form>
        </article>

        <article className="panel history-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Transactions</h2>
              <p>Your recorded financial activity.</p>
            </div>
            <span className="transaction-count">{transactions.length}</span>
          </div>

          {loading ? (
            <div className="empty-state">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">₹</div>
              <h3>No transactions yet</h3>
              <p>Add your first transaction using the form.</p>
            </div>
          ) : (
            <div className="transaction-list">
              {transactions.map((transaction) => {
                const id = transaction._id || transaction.id
                const positive = isIncome(transaction)

                return (
                  <div className="transaction-item" key={id}>
                    <div className="transaction-icon">
                      {positive ? '↙' : '↗'}
                    </div>

                    <div className="transaction-info">
                      <strong>
                        {transaction.title ||
                          transaction.description ||
                          transaction.name ||
                          transaction.category ||
                          'Transaction'}
                      </strong>
                      <span>
                        {transaction.category || 'Other'}
                        {transaction.date
                          ? ` · ${String(transaction.date).slice(0, 10)}`
                          : ''}
                      </span>
                    </div>

                    <div
                      className={`transaction-amount ${
                        positive ? 'positive' : 'negative'
                      }`}
                    >
                      {positive ? '+' : '-'}
                      {formatMoney(getAmount(transaction))}
                    </div>

                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => deleteTransaction(id)}
                      aria-label="Delete transaction"
                      title="Delete transaction"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </article>
      </section>

      <footer>
        ExpenseTracker · Manage your money with confidence.
      </footer>
    </main>
  )
}

export default App
