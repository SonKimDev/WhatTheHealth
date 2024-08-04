export interface AuthState {
  user: {
    id: string;
    avatar: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    height: number;
    weight: number;
    bmi: number;
    friends: string[];
    roles: string;
  } | null;
  gratitudes: string[];
}
