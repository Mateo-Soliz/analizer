export type User = {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  birthDate?: Date;
  gender?: string;
  avatar?: string;
  verified: boolean;
  role: string;
  uid: string;
  created: Date;
  _createdAt?: Date;
  _updatedAt?: Date;
};
