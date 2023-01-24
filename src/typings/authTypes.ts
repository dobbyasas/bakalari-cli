export type APIEndpoint = string;
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
