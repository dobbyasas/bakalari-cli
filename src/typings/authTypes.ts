export type APIEndpoint = string;
export type APIEndpointRoute = '' | '/timetable/actual' | '/timetable/permanent' | '/marks' | '/marks/final';
export type UserName = string;
export type UserPassword = string;

export type APITokenObject = {
  access_token: string;
  refresh_token: string;
};

export interface UserAuth {
  apiEndpoint: APIEndpoint;
  userName: UserName;
  password: UserPassword;
}

export type APIVersionResponse = {
  ApiVersion: string;
  ApplicationVersion: string;
  BaseUrl: string;
};
