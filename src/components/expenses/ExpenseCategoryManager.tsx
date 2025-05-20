
import { useState } from 'react';
import { ChromePicker } from 'react-color';
import { Edit, Plus, Save, Trash, X } from 'lucide-react';

import { ExpenseCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface ExpenseCategoryManagerProps {
  categories: ExpenseCategory[];
  onAdd: (category: Omit<ExpenseCategory, 'id'>) => void;
  onUpdate: (category: ExpenseCategory) => void;
  onDelete: (categoryId: string) => void;
}

export function ExpenseCategoryManager({
  categories,
  onAdd,
  onUpdate,
  onDelete,
}: ExpenseCategoryManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<Omit<ExpenseCategory, 'id'>>({
    name: '',
    color: '#8b5cf6',
  });
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const handleAddCategory = () => {
    onAdd(newCategory);
    setNewCategory({ name: '', color: '#8b5cf6' });
    setIsAddDialogOpen(false);
  };

  const handleUpdateCategory = () => {
    if (editingCategory) {
      onUpdate(editingCategory);
      setEditingCategory(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteCategory = () => {
    if (deletingCategoryId) {
      onDelete(deletingCategoryId);
      setDeletingCategoryId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (category: ExpenseCategory) => {
    setEditingCategory({ ...category });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (categoryId: string) => {
    setDeletingCategoryId(categoryId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Expense Categories</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Color</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-20">Budget</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No categories created yet. Add your first category!
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      {category.budget
                        ? `$${category.budget.amount} ${category.budget.period}`
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(category)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(category.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add Category Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new expense category for better organization.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  placeholder="e.g., Marketing, Utilities"
                />
              </div>
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-10 h-10 p-0"
                        style={{ backgroundColor: newCategory.color }}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <ChromePicker
                        color={newCategory.color}
                        onChange={(color) =>
                          setNewCategory({ ...newCategory, color: color.hex })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    value={newCategory.color}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, color: e.target.value })
                    }
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget">Budget (Optional)</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="budget"
                      type="number"
                      className="pl-8"
                      placeholder="0.00"
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          budget: {
                            amount: parseFloat(e.target.value) || 0,
                            period: newCategory.budget?.period || 'monthly',
                          },
                        })
                      }
                      value={newCategory.budget?.amount || ''}
                    />
                  </div>
                  <Select
                    value={newCategory.budget?.period || 'monthly'}
                    onValueChange={(value) =>
                      setNewCategory({
                        ...newCategory,
                        budget: {
                          amount: newCategory.budget?.amount || 0,
                          period: value as 'monthly' | 'quarterly' | 'annually',
                        },
                      })
                    }
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory} disabled={!newCategory.name}>
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category details.
              </DialogDescription>
            </DialogHeader>
            {editingCategory && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Category Name</Label>
                  <Input
                    id="edit-name"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Color</Label>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-10 h-10 p-0"
                          style={{ backgroundColor: editingCategory.color }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <ChromePicker
                          color={editingCategory.color}
                          onChange={(color) =>
                            setEditingCategory({
                              ...editingCategory,
                              color: color.hex,
                            })
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      value={editingCategory.color}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          color: e.target.value,
                        })
                      }
                      className="font-mono"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-budget">Budget (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="edit-budget"
                        type="number"
                        className="pl-8"
                        placeholder="0.00"
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            budget: {
                              amount: parseFloat(e.target.value) || 0,
                              period:
                                editingCategory.budget?.period || 'monthly',
                            },
                          })
                        }
                        value={editingCategory.budget?.amount || ''}
                      />
                    </div>
                    <Select
                      value={editingCategory.budget?.period || 'monthly'}
                      onValueChange={(value) =>
                        setEditingCategory({
                          ...editingCategory,
                          budget: {
                            amount: editingCategory.budget?.amount || 0,
                            period: value as 'monthly' | 'quarterly' | 'annually',
                          },
                        })
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateCategory}
                disabled={!editingCategory?.name}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this category? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteCategory}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
