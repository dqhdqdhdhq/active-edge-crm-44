
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { Expense, PaymentMethod, ExpenseCategory, RecurrenceFrequency } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

const paymentMethods: PaymentMethod[] = [
  'Credit Card',
  'Bank Transfer',
  'Cash',
  'Check',
  'Other',
];

const recurrenceFrequencies: RecurrenceFrequency[] = [
  'Daily',
  'Weekly',
  'Bi-Weekly',
  'Monthly',
  'Quarterly',
  'Yearly',
];

const formSchema = z.object({
  date: z.date({
    required_error: 'Please select a date.',
  }),
  categoryId: z.string({
    required_error: 'Please select a category.',
  }),
  amount: z.coerce.number({
    required_error: 'Please enter an amount.',
    invalid_type_error: 'Please enter a valid number.',
  }).min(0.01, {
    message: 'Amount must be greater than zero.',
  }),
  payee: z.string().optional(),
  description: z.string().min(1, {
    message: 'Please enter a description.',
  }),
  paymentMethod: z.enum(['Credit Card', 'Bank Transfer', 'Cash', 'Check', 'Other'], {
    required_error: 'Please select a payment method.',
  }),
  isRecurring: z.boolean().default(false),
  recurrenceFrequency: z.enum([
    'Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly', 'Yearly'
  ]).optional(),
  recurrenceStartDate: z.date().optional(),
  recurrenceEndDate: z.date().optional(),
  tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (expense: Partial<Expense>) => void;
  categories: ExpenseCategory[];
  expense?: Expense;
}

export function ExpenseFormDialog({
  open,
  onOpenChange,
  onSubmit,
  categories,
  expense,
}: ExpenseFormDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: expense ? {
      date: new Date(expense.date),
      categoryId: expense.categoryId,
      amount: expense.amount,
      payee: expense.payee,
      description: expense.description,
      paymentMethod: expense.paymentMethod,
      isRecurring: expense.isRecurring,
      recurrenceFrequency: expense.recurrenceFrequency as any, // Type cast to avoid TS error
      recurrenceStartDate: expense.recurrenceStartDate ? new Date(expense.recurrenceStartDate) : undefined,
      recurrenceEndDate: expense.recurrenceEndDate ? new Date(expense.recurrenceEndDate) : undefined,
      tags: expense.tags || [],
    } : {
      date: new Date(),
      amount: 0,
      description: '',
      isRecurring: false,
    },
  });

  const isRecurring = form.watch('isRecurring');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (values: FormValues) => {
    // Prepare data for submission
    const expenseData: Partial<Expense> = {
      ...values,
      date: values.date.toISOString(),
      recurrenceStartDate: values.recurrenceStartDate?.toISOString(),
      recurrenceEndDate: values.recurrenceEndDate?.toISOString(),
      // In a real app, we would upload the files and add their URLs here
      receipts: [],
      createdAt: expense?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onSubmit(expenseData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{expense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          <DialogDescription>
            Enter the details of your expense. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "MMM dd, yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="payee"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Payee/Vendor</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter payee or vendor name" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="col-span-1 md:col-span-2 space-y-4">
                <FormLabel>Receipt Attachment</FormLabel>
                <div className="border border-dashed border-input rounded-md p-4">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center gap-2 cursor-pointer text-center"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload or drag and drop receipts
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/jpg,image/jpeg,image/png,application/pdf"
                      multiple
                      onChange={handleFileChange}
                    />
                    <Button type="button" variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </label>
                </div>
                
                {files.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 border rounded-md text-sm"
                      >
                        <div className="flex-1 truncate">{file.name}</div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="col-span-1 md:col-span-2 space-y-4 border-t pt-4">
                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Recurring Expense</FormLabel>
                        <FormDescription>
                          Set this as a recurring expense
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {isRecurring && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="recurrenceFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {recurrenceFrequencies.map((frequency) => (
                                <SelectItem key={frequency} value={frequency}>
                                  {frequency}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="recurrenceStartDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "MMM dd, yyyy")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="recurrenceEndDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date (Optional)</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "MMM dd, yyyy")
                                    ) : (
                                      <span>No end date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Expense</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
