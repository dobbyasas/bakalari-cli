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
  ChangeType: 'Added' | 'Canceled' | 'Removed' | 'RoomChanged' | 'Substitution';
  Description: string;
  TypeAbbrev: string;
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
