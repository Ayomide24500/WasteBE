import { HTTP } from "./enums";

export interface iError {
  name: string;
  message: string;
  status: HTTP;
  success: boolean;
}

export interface iUser {
  email: string;
  password: string;
  token: string;
  status: string;
  verify: boolean;
  allpassword: any[];
}

export interface iUserData extends iUser, Document {}
export interface iPassword {
  password: string;
}
export interface iPasswordData extends iPassword, Document {}
