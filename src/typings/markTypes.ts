import type { Subject } from './timetableTypes';

export type FinalMark = {
  MarkDate: string;
  EditDate: string;
  MarkText: string;
  SubjectId: Subject['Id'];
  Id: string;
};

export type FinalMarksResult = {
  CertificateTerms: {
    FinalMarks: FinalMark[];
    Subjects: Subject[];
    GradeName: string;
    Grade: number;
    YearInSchool: 1,
    SchoolYear: string;
    Semester: string;
    SemesterName: string;
    Repeated: boolean;
    Closed: boolean;
    AchievementText: string;
    MarksAverage: number;
    AbsentHours: number;
    NotExcusedHours: number;
    CertficateDate: string;
  }[];
};
