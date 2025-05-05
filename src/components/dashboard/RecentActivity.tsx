
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckIn, Member, GymClass, Note } from '@/lib/types';
import { members as allMembers } from '@/data/mockData';
import { format, isToday, parseISO } from 'date-fns';
import { UserRole } from '@/pages/Dashboard';

interface ActivityProps {
  checkIns: CheckIn[];
  classes: GymClass[];
  notes: Note[];
  userRole: UserRole;
}

export function RecentActivity({ checkIns, classes, notes, userRole }: ActivityProps) {
  // Helper function to get member by ID
  const getMember = (id: string): Member | undefined => {
    return allMembers.find(member => member.id === id);
  };

  // Format today's classes
  const todayClasses = classes.filter(c => {
    const classDate = parseISO(c.date);
    return isToday(classDate);
  }).slice(0, 3);

  // Format recent check-ins
  const recentCheckInsList = checkIns.slice(0, 5).map(checkIn => {
    const member = getMember(checkIn.memberId);
    return {
      id: checkIn.id,
      name: member ? `${member.firstName} ${member.lastName}` : 'Unknown Member',
      image: member?.profileImage,
      time: format(parseISO(checkIn.dateTime), 'h:mm a')
    };
  });

  // Format recent notes
  const recentNotesList = notes.slice(0, 3).map(note => {
    return {
      id: note.id,
      title: note.title,
      excerpt: note.content.length > 70 ? `${note.content.substring(0, 70)}...` : note.content,
      createdBy: note.createdBy,
      date: format(parseISO(note.createdAt), 'MMM d')
    };
  });

  // For trainers, show more focused activity (just their classes and assigned members)
  if (userRole === 'trainer') {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {/* Today's Classes - Trainer specific view */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Classes</CardTitle>
            <CardDescription>Your classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayClasses.length > 0 ? (
                todayClasses
                  // In a real app, filter by the trainer's ID
                  .filter(c => c.trainerId === 'trainer-1') 
                  .map(cls => (
                    <div key={cls.id} className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {cls.startTime.split(':')[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">{cls.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cls.startTime} - {cls.endTime} • {cls.room}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {cls.attendees.length}/{cls.capacity}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No classes scheduled for you today
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Client Check-ins - Trainer specific view */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Client Check-ins</CardTitle>
            <CardDescription>Your clients' recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCheckInsList.length > 0 ? (
                recentCheckInsList.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.image} />
                      <AvatarFallback>{item.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Checked in at {item.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No client check-ins recorded today
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default view for owner and staff
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Today's Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Check-ins</CardTitle>
          <CardDescription>Today's gym activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCheckInsList.length > 0 ? (
              recentCheckInsList.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.image} />
                    <AvatarFallback>{item.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Checked in at {item.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No check-ins recorded today
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Today's Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Classes</CardTitle>
          <CardDescription>Upcoming gym sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayClasses.length > 0 ? (
              todayClasses.map(cls => (
                <div key={cls.id} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {cls.startTime.split(':')[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">{cls.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cls.startTime} - {cls.endTime} • {cls.room}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {cls.attendees.length}/{cls.capacity}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No classes scheduled for today
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Notes</CardTitle>
          <CardDescription>Latest staff updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentNotesList.map(note => (
              <div key={note.id} className="space-y-1">
                <h4 className="text-sm font-medium leading-none">{note.title}</h4>
                <p className="text-xs text-muted-foreground">{note.excerpt}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                  <span>{note.createdBy}</span>
                  <span>{note.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
