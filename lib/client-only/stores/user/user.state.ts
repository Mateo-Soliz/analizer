export interface UserState {
  _id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  birthDate: Date;
  gender: string;
  avatar: string;
  verified: boolean;
  role: string;
  created?: Date | string;
  _createdAt?: Date;
  _updatedAt?: Date;
  id?: string;
}

export interface UserStore {
  user: UserState | null;
  setUser: (user: UserState) => void;
  clearUser: () => void;
}
