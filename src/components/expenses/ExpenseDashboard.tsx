
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid, 
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis
} from 'recharts';
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';

import { Expense, ExpenseCategory } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExpenseDashboardProps {
  expenses: Expense[];
  categories: ExpenseCategory[];
}

export function ExpenseDashboard({ expenses, categories }: ExpenseDashboardProps) {
  const totalExpenses = useMemo(() => {
    return expenses.reduce((acc, expense) => acc + expense.amount, 0);
  }, [expenses]);

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category;
      return acc;
    }, {} as Record<string, ExpenseCategory>);
  }, [categories]);

  // Monthly expense data for the trend chart
  const monthlyData = useMemo(() => {
    const now = new Date();
    const months = Array(6)
      .fill(0)
      .map((_, i) => {
        const monthDate = subMonths(now, 5 - i);
        return {
          month: format(monthDate, 'MMM'),
          date: monthDate,
          start: startOfMonth(monthDate),
          end: endOfMonth(monthDate),
          total: 0,
        };
      });

    // Calculate totals for each month
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const monthIndex = months.findIndex(
        m => expenseDate >= m.start && expenseDate <= m.end
      );
      if (monthIndex >= 0) {
        months[monthIndex].total += expense.amount;
      }
    });

    return months.map(m => ({
      month: m.month,
      total: m.total,
    }));
  }, [expenses]);

  // Category breakdown data for the pie chart
  const categoryData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(expense => {
      const categoryId = expense.categoryId;
      categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + expense.amount;
    });
    
    return Object.entries(categoryTotals).map(([categoryId, total]) => ({
      id: categoryId,
      name: categoryMap[categoryId]?.name || 'Uncategorized',
      value: total,
      color: categoryMap[categoryId]?.color || '#64748b',
    }))
    .sort((a, b) => b.value - a.value);
  }, [expenses, categoryMap]);

  // Top expense items
  const topExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map(expense => ({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        category: categoryMap[expense.categoryId]?.name || 'Uncategorized',
        color: categoryMap[expense.categoryId]?.color || '#64748b',
      }));
  }, [expenses, categoryMap]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(totalExpenses)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              From {expenses.length} expenses
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Monthly</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(totalExpenses / (monthlyData.length || 1))}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Over the last {monthlyData.length} months
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Top Category</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              {categoryData.length > 0 ? (
                <>
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: categoryData[0].color }}
                  />
                  {categoryData[0].name}
                </>
              ) : (
                'No data'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {categoryData.length > 0
                ? formatCurrency(categoryData[0].value)
                : '$0'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Spending Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="top">Top Expenses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="h-80 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expenses</CardTitle>
              <CardDescription>
                Expense trends over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={monthlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Total']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#8b5cf6" 
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="h-80 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown by Category</CardTitle>
              <CardDescription>
                Distribution of expenses across categories
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                      labelFormatter={(index) => categoryData[index as number]?.name || ''}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-col gap-2">
                {categoryData.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(category.value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="top" className="h-80 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Expenses</CardTitle>
              <CardDescription>
                Your largest expense items
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topExpenses}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
                >
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="description" 
                    tick={{ fontSize: 12 }}
                    width={100}
                  />
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                    labelFormatter={(label) => label}
                  />
                  <Bar dataKey="amount">
                    {topExpenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
