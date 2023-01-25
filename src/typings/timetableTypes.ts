export type Hour = {
  Id: number;
  Caption: string;
  BeginTime: string;
  EndTime: string;
};

export type Teacher = {
  Id: string;
  Abbrev: string;
  Name: string;
};

export type Timetable = {
  Hours: Hour[];
  Teachers: Teacher[];
};
