
import { useMemo } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

import { Expense, ExpenseCategory, ExpenseBudget } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface BudgetVsActualProps {
  expenses: Expense[];
  categories: ExpenseCategory[];
  budgets: ExpenseBudget[];
}

export function BudgetVsActual({ expenses, categories, budgets }: BudgetVsActualProps) {
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category;
      return acc;
    }, {} as Record<string, ExpenseCategory>);
  }, [categories]);

  const budgetMap = useMemo(() => {
    return budgets.reduce((acc, budget) => {
      acc[budget.categoryId] = budget;
      return acc;
    }, {} as Record<string, ExpenseBudget>);
  }, [budgets]);

  const currentMonthExpenses = useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });
  }, [expenses]);

  const budgetVsActualData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    // Calculate current month spending by category
    currentMonthExpenses.forEach(expense => {
      const categoryId = expense.categoryId;
      categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + expense.amount;
    });
    
    // Create data for chart
    return categories
      .filter(category => budgetMap[category.id])
      .map(category => {
        const budget = budgetMap[category.id];
        const actual = categoryTotals[category.id] || 0;
        const percentage = budget ? (actual / budget.amount) * 100 : 0;
        
        return {
          categoryId: category.id,
          name: category.name,
          color: category.color,
          budget: budget?.amount || 0,
          actual,
          percentage: Math.min(percentage, 100), // Cap at 100% for display purposes
          overBudget: percentage > 100,
        };
      })
      .filter(item => item.budget > 0) // Only show categories with budgets
      .sort((a, b) => b.percentage - a.percentage); // Sort by percentage
  }, [categories, budgetMap, currentMonthExpenses]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Actual Spending</CardTitle>
        <CardDescription>
          Monthly spending compared to your budget
        </CardDescription>
      </CardHeader>
      <CardContent>
        {budgetVsActualData.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No budget data available. Set up budgets in the Categories tab.
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={budgetVsActualData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis 
                  type="number" 
                  tickFormatter={formatCurrency}
                  domain={[0, 'dataMax']}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={80}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    formatCurrency(value as number), 
                    name === 'budget' ? 'Budget' : 'Actual'
                  ]}
                  labelFormatter={(label) => label}
                />
                <Legend />
                <Bar 
                  dataKey="budget" 
                  fill="#94a3b8" 
                  name="Budget" 
                  barSize={20} 
                />
                <Bar 
                  dataKey="actual" 
                  name="Actual" 
                  barSize={20}
                >
                  {budgetVsActualData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.overBudget ? '#ef4444' : entry.color} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {budgetVsActualData.length > 0 && (
          <div className="mt-4 space-y-4">
            <h3 className="text-sm font-medium">Budget Usage</h3>
            <div className="space-y-3">
              {budgetVsActualData.map((item) => (
                <div key={item.categoryId} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </div>
                    <span className={item.overBudget ? 'text-destructive font-medium' : ''}>
                      {formatPercentage(item.percentage)}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        item.overBudget ? 'bg-destructive' : ''
                      }`}
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.overBudget ? undefined : item.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(item.actual)}</span>
                    <span>of {formatCurrency(item.budget)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
