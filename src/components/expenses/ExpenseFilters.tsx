
import { startOfMonth, endOfMonth, format, subDays, startOfWeek, endOfWeek, startOfYear, endOfYear } from 'date-fns';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Expense, ExpenseCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

interface DateRangeOption {
  label: string;
  value: string;
  getRange: () => { from: Date; to: Date };
}

const dateRangeOptions: DateRangeOption[] = [
  {
    label: 'Today',
    value: 'today',
    getRange: () => {
      const today = new Date();
      return { from: today, to: today };
    },
  },
  {
    label: 'Yesterday',
    value: 'yesterday',
    getRange: () => {
      const yesterday = subDays(new Date(), 1);
      return { from: yesterday, to: yesterday };
    },
  },
  {
    label: 'This Week',
    value: 'this-week',
    getRange: () => {
      const today = new Date();
      return {
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 }),
      };
    },
  },
  {
    label: 'This Month',
    value: 'this-month',
    getRange: () => {
      const today = new Date();
      return {
        from: startOfMonth(today),
        to: endOfMonth(today),
      };
    },
  },
  {
    label: 'This Year',
    value: 'this-year',
    getRange: () => {
      const today = new Date();
      return {
        from: startOfYear(today),
        to: endOfYear(today),
      };
    },
  },
  {
    label: 'Custom Range',
    value: 'custom',
    getRange: () => ({ from: new Date(), to: new Date() }),
  },
];

interface ExpenseFiltersProps {
  table: Table<Expense>;
  categories: ExpenseCategory[];
}

export function ExpenseFilters({ table, categories }: ExpenseFiltersProps) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [dateRangeType, setDateRangeType] = useState<string>('this-month');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  
  const applyDateFilter = (dateFrom: Date, dateTo: Date) => {
    table.getColumn('date')?.setFilterValue([
      dateFrom.toISOString(),
      dateTo.toISOString(),
    ]);
  };
  
  const handleDateRangeChange = (value: string) => {
    setDateRangeType(value);
    
    if (value === 'custom') {
      // Don't apply filter yet, wait for custom date selection
      return;
    }
    
    const option = dateRangeOptions.find(o => o.value === value);
    if (option) {
      const range = option.getRange();
      setDateRange(range);
      applyDateFilter(range.from, range.to);
    }
  };
  
  const handleCustomDateChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      setDateRange({ from: range.from, to: range.to });
      applyDateFilter(range.from, range.to);
    }
  };
  
  const handleCategoryChange = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(updated);
    table.getColumn('categoryId')?.setFilterValue(updated.length ? updated : undefined);
  };
  
  const handleAmountFilterChange = () => {
    const min = minAmount ? parseFloat(minAmount) : undefined;
    const max = maxAmount ? parseFloat(maxAmount) : undefined;
    
    if (min !== undefined || max !== undefined) {
      table.getColumn('amount')?.setFilterValue([min, max]);
    } else {
      table.getColumn('amount')?.setFilterValue(undefined);
    }
  };
  
  const clearFilters = () => {
    table.resetColumnFilters();
    setDateRange(null);
    setDateRangeType('this-month');
    setSelectedCategories([]);
    setMinAmount('');
    setMaxAmount('');
  };
  
  return (
    <div className="px-6 py-3 border-t">
      <div className="flex flex-wrap gap-4 items-start">
        <div className="space-y-1">
          <p className="text-sm font-medium">Date Range</p>
          <div className="flex items-center gap-2">
            <Select value={dateRangeType} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Time Period</SelectLabel>
                  {dateRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            {dateRangeType === 'custom' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange as any}
                    onSelect={handleCustomDateChange as any}
                    numberOfMonths={2}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        
        <Separator orientation="vertical" className="h-10" />
        
        <div className="space-y-1">
          <p className="text-sm font-medium">Categories</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category.id}
                variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleCategoryChange(category.id)}
                style={{
                  backgroundColor: selectedCategories.includes(category.id) ? category.color : 'transparent',
                  borderColor: category.color,
                  color: selectedCategories.includes(category.id) ? 'white' : 'inherit',
                }}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
        
        <Separator orientation="vertical" className="h-10" />
        
        <div className="space-y-1">
          <p className="text-sm font-medium">Amount Range</p>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              className="w-20"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              onBlur={handleAmountFilterChange}
              min="0"
              step="0.01"
            />
            <span>to</span>
            <Input
              type="number"
              placeholder="Max"
              className="w-20"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              onBlur={handleAmountFilterChange}
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        <div className="ml-auto self-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 gap-1"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
