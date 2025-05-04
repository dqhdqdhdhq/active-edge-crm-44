
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, CalendarIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClassType, Room, Trainer } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ClassFiltersProps {
  filters: {
    dateRange: { from: Date | null; to: Date | null };
    timeOfDay: string[];
    classType: ClassType[];
    trainerId: string[];
    room: Room[];
    availability: string[];
  };
  onFilterChange: (filters: any) => void;
  trainers: Trainer[];
}

export const ClassFilters = ({ filters, onFilterChange, trainers }: ClassFiltersProps) => {
  const [date, setDate] = useState<{ from: Date | null; to: Date | null }>({
    from: filters.dateRange.from,
    to: filters.dateRange.to,
  });

  const timeOptions = [
    { label: "Morning (5am-12pm)", value: "morning" },
    { label: "Afternoon (12pm-5pm)", value: "afternoon" },
    { label: "Evening (5pm-10pm)", value: "evening" },
  ];

  const classTypeOptions: ClassType[] = [
    "Yoga", "Spin", "HIIT", "Pilates", "Zumba", "Boxing", "CrossFit", "Strength", "Cardio"
  ];

  const roomOptions: Room[] = [
    "Studio A", "Studio B", "Main Floor", "Spin Room", "Yoga Studio", "Pool", "Outdoor"
  ];

  const availabilityOptions = [
    { label: "Available", value: "available" },
    { label: "Full", value: "full" },
    { label: "Waitlist Available", value: "waitlist" },
  ];

  // Handle date selection
  const handleDateSelect = (range: { from: Date | null; to: Date | null }) => {
    setDate(range);
    onFilterChange({ dateRange: range });
  };

  // Handle toggle arrays (timeOfDay, classType, etc)
  const handleToggleFilter = (filterName: string, value: string) => {
    // Check if the current filter is the dateRange, which isn't an array
    if (filterName === 'dateRange') {
      // Handle dateRange separately as an object
      onFilterChange({ [filterName]: value });
      return;
    }
    
    // For array-type filters, we need proper type checking
    if (filterName === 'timeOfDay') {
      const currentValues = filters.timeOfDay;
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      onFilterChange({ [filterName]: newValues });
    } else if (filterName === 'classType') {
      const currentValues = filters.classType;
      const newValues = currentValues.includes(value as ClassType)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value as ClassType];
      onFilterChange({ [filterName]: newValues });
    } else if (filterName === 'trainerId') {
      const currentValues = filters.trainerId;
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      onFilterChange({ [filterName]: newValues });
    } else if (filterName === 'room') {
      const currentValues = filters.room;
      const newValues = currentValues.includes(value as Room)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value as Room];
      onFilterChange({ [filterName]: newValues });
    } else if (filterName === 'availability') {
      const currentValues = filters.availability;
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      onFilterChange({ [filterName]: newValues });
    }
  };

  const resetFilters = () => {
    setDate({ from: null, to: null });
    onFilterChange({
      dateRange: { from: null, to: null },
      timeOfDay: [],
      classType: [],
      trainerId: [],
      room: [],
      availability: [],
    });
  };

  const hasActiveFilters = () => {
    return (
      (filters.dateRange.from !== null) ||
      (filters.dateRange.to !== null) ||
      filters.timeOfDay.length > 0 ||
      filters.classType.length > 0 ||
      filters.trainerId.length > 0 ||
      filters.room.length > 0 ||
      filters.availability.length > 0
    );
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-muted/30">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Filters</h2>
        {hasActiveFilters() && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="mr-2 h-4 w-4" />
            Reset filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date Range Picker */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time of Day */}
        <div className="space-y-2">
          <Label>Time of Day</Label>
          <div className="flex flex-wrap gap-2">
            {timeOptions.map((option) => (
              <Badge
                key={option.value}
                variant={filters.timeOfDay.includes(option.value) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleToggleFilter("timeOfDay", option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Class Type */}
        <div className="space-y-2">
          <Label>Class Type</Label>
          <div className="flex flex-wrap gap-2">
            {classTypeOptions.map((type) => (
              <Badge
                key={type}
                variant={filters.classType.includes(type) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleToggleFilter("classType", type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Trainers */}
        <div className="space-y-2">
          <Label>Trainers</Label>
          <div className="flex flex-wrap gap-2">
            {trainers.map((trainer) => (
              <Badge
                key={trainer.id}
                variant={filters.trainerId.includes(trainer.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleToggleFilter("trainerId", trainer.id)}
              >
                {trainer.firstName} {trainer.lastName}
              </Badge>
            ))}
          </div>
        </div>

        {/* Room */}
        <div className="space-y-2">
          <Label>Room</Label>
          <div className="flex flex-wrap gap-2">
            {roomOptions.map((room) => (
              <Badge
                key={room}
                variant={filters.room.includes(room) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleToggleFilter("room", room)}
              >
                {room}
              </Badge>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <Label>Availability</Label>
          <div className="flex flex-wrap gap-2">
            {availabilityOptions.map((option) => (
              <Badge
                key={option.value}
                variant={filters.availability.includes(option.value) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleToggleFilter("availability", option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
