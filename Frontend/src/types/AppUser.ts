export type AppUser = {
  id: number;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  suspend: boolean;
  roles: string[];
}