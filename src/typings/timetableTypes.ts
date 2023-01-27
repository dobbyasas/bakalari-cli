export type Hour = {
  Id: number;
  Caption: string;
  BeginTime: string;
  EndTime: string;
};

export type Subject = {
  Id: string;
  Abbrev: string;
  Name: string;
};

export type Room = {
  Id: string;
  Abbrev: string;
  Name: string;
};

export type Change = {
  Day: string;
  Hours: string;
  ChangeType: 'Added' | 'Canceled' | 'RoomChanged' | 'Substitution';
  Description: string;
};

export type Atom = {
  HourId: number;
  SubjectId: Subject['Id'];
  RoomId: Room['Id'];
  TeacherId: Teacher['Id'];
  Change: Change | null;
};

export type Day = {
  Atoms: Atom[];
  DayOfWeek: number;
  Date: string;
  DayDescription: string;
  DayType: string;
};

export type Teacher = {
  Id: string;
  Abbrev: string;
  Name: string;
};

export type Timetable = {
  Hours: Hour[];
  Days: Day[];
  Teachers: Teacher[];
  Subjects: Subject[];
  Rooms: Room[];
};
