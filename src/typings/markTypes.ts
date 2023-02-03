import type { Subject } from './timetableTypes';

export type Mark = {
  MarkDate: string;
  EditDate: string;
  Caption: string;
  Theme: string;
  MarkText: string;
  IsInvalidDate: boolean;
  TeacherId: string;
  Type: string;
  TypeNote: string;
  Weight: number;
  SubjectId: string;
  IsNew: boolean;
  IsPoints: boolean;
  CalculatedMarkText: string;
  Id: string;
  PointsText: string;
  MaxPoints: number;
};

export type SubjectMark = {
  Marks: Mark[];
  Subject: Subject;
  AverageText: string;
  TemporaryMark: string;
  SubjectNote: string;
  TemporaryMarkNote: string;
  PointsOnly: boolean;
  MarkPredictionEnabled: true;
};

export type FinalMark = {
  MarkDate: string;
  EditDate: string;
  MarkText: string;
  SubjectId: Subject['Id'];
  Id: string;
};
