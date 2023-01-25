export type Hour = {
  Id: number;
  Caption: string;
  BeginTime: string;
  EndTime: string;
};

export type Timetable = {
  Hours: Hour[];
};
