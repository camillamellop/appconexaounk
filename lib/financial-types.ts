export interface Transaction {
  id: string
  title: string
  amount: number
  type: "income" | "expense"
  category: string
  date: Date
  description?: string
  isRecurring: boolean
  recurringType?: "monthly" | "weekly" | "yearly"
  tags: string[]
}

export interface FixedExpense {
  id: string
  title: string
  amount: number
  category: string
  dueDay: number // Dia do mês para vencimento
  isActive: boolean
  description?: string
  tags: string[]
}

export interface Debt {
  id: string
  title: string
  totalAmount: number
  paidAmount: number
  installments: number
  currentInstallment: number
  monthlyPayment: number
  dueDate: Date
  interestRate?: number
  category: string
}

export interface FinancialGoal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  category: string
  color: string
  description?: string
}

export interface FinancialSummary {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  monthlyIncome: number
  monthlyExpenses: number
  fixedExpenses: number
  variableExpenses: number
}

export const expenseCategories = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Compras",
  "Serviços",
  "Investimentos",
  "Outros",
]

export const incomeCategories = ["Salário", "Freelance", "Investimentos", "Vendas", "Outros"]
