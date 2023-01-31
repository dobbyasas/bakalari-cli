export type APIEndpoint = string;
export type UserName = string;
export type UserPassword = string;

export interface UserAuth {
  apiEndpoint: APIEndpoint;
  userName: UserName;
  password: UserPassword;
}
