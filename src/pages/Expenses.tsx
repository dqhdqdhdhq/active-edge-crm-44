
import { useState } from 'react';
import { PlusCircle, Receipt } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Expense, ExpenseCategory, ExpenseBudget } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpenseTable } from '@/components/expenses/ExpenseTable';
import { ExpenseFormDialog } from '@/components/expenses/ExpenseForm';
import { ExpenseDashboard } from '@/components/expenses/ExpenseDashboard';
import { ExpenseCategoryManager } from '@/components/expenses/ExpenseCategoryManager';
import { BudgetVsActual } from '@/components/expenses/BudgetVsActual';
import { ReceiptViewer } from '@/components/expenses/ReceiptViewer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { expenseCategories, expenses, expenseBudgets } from '@/data/mockData';

const ExpensesPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [expensesList, setExpensesList] = useState<Expense[]>(expenses);
  const [categoriesList, setCategoriesList] = useState<ExpenseCategory[]>(expenseCategories);
  const [budgetsList, setBudgetsList] = useState<ExpenseBudget[]>(expenseBudgets);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);
  const [isReceiptViewerOpen, setIsReceiptViewerOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  
  const { toast } = useToast();

  const handleAddExpense = (expenseData: Partial<Expense>) => {
    const newExpense: Expense = {
      id: `exp-${uuidv4()}`,
      date: expenseData.date || new Date().toISOString(),
      categoryId: expenseData.categoryId || '',
      amount: expenseData.amount || 0,
      payee: expenseData.payee || '',
      description: expenseData.description || '',
      paymentMethod: expenseData.paymentMethod || 'Credit Card',
      receipts: expenseData.receipts || [],
      isRecurring: expenseData.isRecurring || false,
      recurrenceFrequency: expenseData.recurrenceFrequency,
      recurrenceStartDate: expenseData.recurrenceStartDate,
      recurrenceEndDate: expenseData.recurrenceEndDate,
      tags: expenseData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setExpensesList([newExpense, ...expensesList]);
    
    toast({
      title: "Expense Added",
      description: "The expense has been successfully added.",
    });
  };

  const handleEditExpense = (expenseData: Partial<Expense>) => {
    if (!currentExpense) return;
    
    const updatedExpenses = expensesList.map(expense => 
      expense.id === currentExpense.id 
        ? { ...expense, ...expenseData, updatedAt: new Date().toISOString() }
        : expense
    );
    
    setExpensesList(updatedExpenses);
    setCurrentExpense(null);
    
    toast({
      title: "Expense Updated",
      description: "The expense has been successfully updated.",
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpensesList(expensesList.filter(expense => expense.id !== expenseId));
    
    toast({
      title: "Expense Deleted",
      description: "The expense has been successfully deleted.",
    });
  };

  const handleAddCategory = (categoryData: Omit<ExpenseCategory, 'id'>) => {
    const newCategory: ExpenseCategory = {
      id: `cat-${uuidv4()}`,
      ...categoryData,
    };
    
    setCategoriesList([...categoriesList, newCategory]);
    
    // If budget is provided, add it to budgets list
    if (categoryData.budget && categoryData.budget.amount > 0) {
      const newBudget: ExpenseBudget = {
        id: `budget-${uuidv4()}`,
        categoryId: newCategory.id,
        amount: categoryData.budget.amount,
        periodType: categoryData.budget.period,
        periodStartDate: new Date().toISOString(),
      };
      
      setBudgetsList([...budgetsList, newBudget]);
    }
    
    toast({
      title: "Category Added",
      description: "The expense category has been successfully added.",
    });
  };

  const handleUpdateCategory = (category: ExpenseCategory) => {
    setCategoriesList(
      categoriesList.map(cat => 
        cat.id === category.id ? category : cat
      )
    );
    
    // Update the budget if it exists
    if (category.budget) {
      const existingBudgetIndex = budgetsList.findIndex(
        budget => budget.categoryId === category.id
      );
      
      if (existingBudgetIndex >= 0) {
        // Update existing budget
        const updatedBudgets = [...budgetsList];
        updatedBudgets[existingBudgetIndex] = {
          ...updatedBudgets[existingBudgetIndex],
          amount: category.budget.amount,
          periodType: category.budget.period,
        };
        setBudgetsList(updatedBudgets);
      } else {
        // Create new budget
        const newBudget: ExpenseBudget = {
          id: `budget-${uuidv4()}`,
          categoryId: category.id,
          amount: category.budget.amount,
          periodType: category.budget.period,
          periodStartDate: new Date().toISOString(),
        };
        setBudgetsList([...budgetsList, newBudget]);
      }
    } else {
      // Remove budget if it exists but was removed
      setBudgetsList(
        budgetsList.filter(budget => budget.categoryId !== category.id)
      );
    }
    
    toast({
      title: "Category Updated",
      description: "The expense category has been successfully updated.",
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Check if any expenses use this category
    const hasExpenses = expensesList.some(expense => expense.categoryId === categoryId);
    
    if (hasExpenses) {
      toast({
        title: "Cannot Delete Category",
        description: "This category is used by one or more expenses. Update those expenses first.",
        variant: "destructive",
      });
      return;
    }
    
    setCategoriesList(categoriesList.filter(cat => cat.id !== categoryId));
    setBudgetsList(budgetsList.filter(budget => budget.categoryId !== categoryId));
    
    toast({
      title: "Category Deleted",
      description: "The expense category has been successfully deleted.",
    });
  };

  const handleEditClick = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsEditExpenseOpen(true);
  };

  const handleViewReceipts = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsReceiptViewerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gym Expenses</h1>
        <Button onClick={() => setIsAddExpenseOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="list">Expenses List</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <ExpenseTable
            expenses={expensesList}
            categories={categoriesList}
            onEdit={handleEditClick}
            onDelete={handleDeleteExpense}
            onView={handleViewReceipts}
          />
        </TabsContent>
        
        <TabsContent value="categories">
          <ExpenseCategoryManager
            categories={categoriesList}
            onAdd={handleAddCategory}
            onUpdate={handleUpdateCategory}
            onDelete={handleDeleteCategory}
          />
        </TabsContent>
        
        <TabsContent value="dashboard">
          <ExpenseDashboard
            expenses={expensesList}
            categories={categoriesList}
          />
        </TabsContent>
        
        <TabsContent value="budget">
          <BudgetVsActual
            expenses={expensesList}
            categories={categoriesList}
            budgets={budgetsList}
          />
        </TabsContent>
      </Tabs>
      
      {/* Add Expense Dialog */}
      <ExpenseFormDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onSubmit={handleAddExpense}
        categories={categoriesList}
      />
      
      {/* Edit Expense Dialog */}
      {currentExpense && (
        <ExpenseFormDialog
          open={isEditExpenseOpen}
          onOpenChange={setIsEditExpenseOpen}
          onSubmit={handleEditExpense}
          categories={categoriesList}
          expense={currentExpense}
        />
      )}
      
      {/* Receipt Viewer Dialog */}
      {currentExpense && (
        <ReceiptViewer
          receipts={currentExpense.receipts}
          isOpen={isReceiptViewerOpen}
          onOpenChange={setIsReceiptViewerOpen}
        />
      )}
    </div>
  );
};

export default ExpensesPage;
