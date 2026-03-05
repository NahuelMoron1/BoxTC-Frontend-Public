import { UserStatus } from './enums/UserStatus';

export class User {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  userID: string;
  password?: string;
  status?: UserStatus;
  profileImage?: string;
  temporaryFile: File | null = null;

  constructor(
    fullName: string,
    email: string,
    phone: string,
    userID: string,
    password?: string,
    profileImage?: string,
    id?: string,
    status?: UserStatus
  ) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.userID = userID;
    this.status = status;
    this.profileImage = profileImage;
  }
}
