
import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { Calendar, ChevronDown, MoreHorizontal, Receipt, RefreshCcw } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Expense, ExpenseCategory } from '@/lib/types';
import { ExpenseFilters } from './ExpenseFilters';

interface ExpenseTableProps {
  expenses: Expense[];
  categories: ExpenseCategory[];
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
  onView: (expense: Expense) => void;
}

export function ExpenseTable({ 
  expenses, 
  categories,
  onEdit,
  onDelete,
  onView
}: ExpenseTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Uncategorized';
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#64748b';
  };

  const columns: ColumnDef<Expense>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('date'));
        return <div className="font-medium">{format(date, 'MMM dd, yyyy')}</div>;
      },
      enableColumnFilter: true,
    },
    {
      accessorKey: 'categoryId',
      header: 'Category',
      cell: ({ row }) => {
        const categoryId = row.getValue('categoryId') as string;
        const categoryName = getCategoryName(categoryId);
        const categoryColor = getCategoryColor(categoryId);
        
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: categoryColor }} 
            />
            {categoryName}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
        
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'payee',
      header: 'Payee/Vendor',
      cell: ({ row }) => row.getValue('payee') || '-',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = row.getValue('description') as string;
        return (
          <div className="max-w-[300px] truncate" title={description}>
            {description}
          </div>
        );
      },
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => row.getValue('paymentMethod'),
    },
    {
      accessorKey: 'receipts',
      header: 'Receipt',
      cell: ({ row }) => {
        const receipts = row.original.receipts;
        return receipts.length > 0 ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onView(row.original);
            }}
          >
            <Receipt className="h-4 w-4" />
            {receipts.length > 1 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {receipts.length}
              </Badge>
            )}
          </Button>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'isRecurring',
      header: 'Recurring',
      cell: ({ row }) => {
        const isRecurring = row.getValue('isRecurring');
        return isRecurring ? (
          <div className="flex items-center">
            <RefreshCcw className="h-4 w-4 mr-1 text-primary" />
            <span>Yes</span>
          </div>
        ) : (
          <span>No</span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const expense = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(expense)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(expense)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(expense.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: expenses,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>
              Manage your gym expenses
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                placeholder="Search expenses..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full sm:w-[250px]"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {showFilters && (
        <ExpenseFilters 
          table={table} 
          categories={categories}
        />
      )}
      
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "flex items-center gap-1 cursor-pointer select-none"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <ChevronDown className="h-4 w-4 rotate-180" />,
                            desc: <ChevronDown className="h-4 w-4" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onView(row.original)}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No expenses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
