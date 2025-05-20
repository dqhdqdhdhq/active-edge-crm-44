
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { Member, MembershipStatus, MembershipType, MemberTag } from '@/lib/types';
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

const membershipTypes = Object.values(MembershipType);
const membershipStatuses = Object.values(MembershipStatus);
const memberTags: MemberTag[] = [
  'New Member',
  'VIP',
  'Personal Training',
  'Group Classes',
  'Referral',
  'Promotion',
  'Student',
  'Senior',
  'Corporate',
  'Family',
  'Special Needs'
];

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().min(10, {
    message: 'Phone number must be at least 10 digits.',
  }),
  dateOfBirth: z.date({
    required_error: 'Please select a date of birth.',
  }),
  membershipType: z.nativeEnum(MembershipType, {
    required_error: 'Please select a membership type.',
  }),
  membershipStatus: z.nativeEnum(MembershipStatus, {
    required_error: 'Please select a membership status.',
  }),
  membershipStartDate: z.date({
    required_error: 'Please select a membership start date.',
  }),
  membershipEndDate: z.date({
    required_error: 'Please select a membership end date.',
  }),
  tags: z.array(z.enum([
    'New Member',
    'VIP',
    'Personal Training',
    'Group Classes',
    'Referral',
    'Promotion',
    'Student',
    'Senior',
    'Corporate',
    'Family',
    'Special Needs'
  ])).optional(),
  emergencyContactName: z.string().min(2, {
    message: 'Emergency contact name must be at least 2 characters.',
  }),
  emergencyContactPhone: z.string().min(10, {
    message: 'Emergency contact phone number must be at least 10 digits.',
  }),
  emergencyContactRelationship: z.string().min(2, {
    message: 'Emergency contact relationship must be at least 2 characters.',
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (member: Partial<Member>) => void;
  member?: Member;
}

export function MemberFormDialog({
  open,
  onOpenChange,
  onSave,
  member,
}: MemberFormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: member
      ? {
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          phone: member.phone,
          dateOfBirth: new Date(member.dateOfBirth),
          membershipType: member.membershipType as MembershipType,
          membershipStatus: member.membershipStatus as MembershipStatus,
          membershipStartDate: new Date(member.membershipStartDate),
          membershipEndDate: new Date(member.membershipEndDate),
          tags: member.tags,
          emergencyContactName: member.emergencyContact.name,
          emergencyContactPhone: member.emergencyContact.phone,
          emergencyContactRelationship: member.emergencyContact.relationship,
          notes: member.notes,
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: new Date(),
          membershipType: MembershipType.Basic,
          membershipStatus: MembershipStatus.Active,
          membershipStartDate: new Date(),
          membershipEndDate: new Date(),
          emergencyContactName: '',
          emergencyContactPhone: '',
          emergencyContactRelationship: '',
        },
  });

  const handleSubmit = (values: FormValues) => {
    const memberData: Partial<Member> = {
      ...values,
      dateOfBirth: values.dateOfBirth.toISOString(),
      membershipStartDate: values.membershipStartDate.toISOString(),
      membershipEndDate: values.membershipEndDate.toISOString(),
      emergencyContact: {
        name: values.emergencyContactName,
        phone: values.emergencyContactPhone,
        relationship: values.emergencyContactRelationship,
      },
    };

    if (member) {
      memberData.id = member.id;
    }

    onSave(memberData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Member' : 'Add Member'}</DialogTitle>
          <DialogDescription>
            {member
              ? 'Edit member details. Click save when you\'re done.'
              : 'Add a new member to the system. Click save when you\'re done.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'MMM dd, yyyy')
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
                name="membershipType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {membershipTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                name="membershipStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {membershipStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
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
                name="membershipStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Membership Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'MMM dd, yyyy')
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
                name="membershipEndDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Membership End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'MMM dd, yyyy')
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
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {memberTags.map((tag) => (
                        <div key={tag} className="space-x-2">
                          <label
                            htmlFor={tag}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {tag}
                          </label>
                          <input
                            type="checkbox"
                            id={tag}
                            className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            checked={field.value?.includes(tag as MemberTag)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...(field.value || []), tag]);
                              } else {
                                field.onChange(
                                  field.value?.filter((v) => v !== tag)
                                );
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Emergency contact name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Emergency contact phone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContactRelationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Relationship</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Emergency contact relationship"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
