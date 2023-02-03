export type APIEndpointRoute =
  | ''
  | '/timetable/actual'
  | `/timetable/actual?date=${string}`
  | '/timetable/permanent'
  | '/marks'
  | '/marks/final'
  | '/absence/student'
  | '/substitutions';

export type APITokenObject = {
  access_token: string;
  refresh_token: string;
};

export type APIVersionResult = {
  ApiVersion: string;
  ApplicationVersion: string;
  BaseUrl: string;
};
