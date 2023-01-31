export interface AbsenceBase {
  Late: number;
  Soon: number;
  School: number;
  DistanceTeaching: number;
}

export interface Absence extends AbsenceBase {
  Date: string;
  Unsolved: number;
  Ok: number;
}

export interface SubjectAbsence extends AbsenceBase {
  SubjectName: string;
  LessonsCount: number;
  Base: number;
}

export type AbsenceResult = {
  PercentageThreshold: number;
  Absences: Absence[];
  AbsencesPerSubject: SubjectAbsence[];
};
