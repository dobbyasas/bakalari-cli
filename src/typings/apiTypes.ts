import type {
  Hour,
  Day,
  Teacher,
  Subject,
  Room,
  Change,
} from './timetableTypes';
import type { SubjectMark, FinalMark } from './markTypes';
import type { Absence, SubjectAbsence } from './absenceTypes';

export type APIEndpointRoute =
  | ''
  | '/timetable/actual'
  | `/timetable/actual?date=${string}`
  | '/timetable/permanent'
  | '/marks'
  | '/marks/final'
  | '/absence/student'
  | '/substitutions'
  | '/subjects'
  | any;

export type APITokenObject = {
  access_token: string;
  refresh_token: string;
  error?: string;
};

export type APIVersionResult = {
  ApiVersion: string;
  ApplicationVersion: string;
  BaseUrl: string;
};

export type TimetableResult = {
  Hours: Hour[];
  Days: Day[];
  Teachers: Teacher[];
  Subjects: Subject[];
  Rooms: Room[];
};

export type MarksResult = {
  Subjects: SubjectMark[];
};

export type FinalMarksResult = {
  CertificateTerms: {
    FinalMarks: FinalMark[];
    Subjects: Subject[];
    GradeName: string;
    Grade: number;
    YearInSchool: number;
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

export type AbsenceResult = {
  PercentageThreshold: number;
  Absences: Absence[];
  AbsencesPerSubject: SubjectAbsence[];
};

export type SubstitutionsResult = {
  Changes: Change[];
};

export type SubjectsResult = {
  Subjects: {
    SubjectID: Subject['Id'];
    SubjectName: Subject['Name'];
    SubjectAbbrev: Subject['Abbrev'];
    TeacherID: Teacher['Id'];
    TeacherName: Teacher['Name'];
    TeacherAbbrev: Teacher['Abbrev'];
    TeacherEmail: string | null;
    TeacherWeb: string | null;
    TeacherSchoolPhone: string | null;
    TeacherHomePhone: string | null;
    TeacherMobilePhone: string | null;
  }[];
};

export type KomensResult = {
  Messages: {
    Id: string;
    Title: string;
    Text: string;
    SentDate: string;
    RelevantName: string;
  }[];
};
