export interface UserState {
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
  _createdAt?: Date;
  _updatedAt?: Date;
}

export interface UserStore {
  user: UserState | null;
  setUser: (user: UserState) => void;
  clearUser: () => void;
}
