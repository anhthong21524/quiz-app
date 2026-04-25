export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  passwordSalt?: string;
  googleSub?: string;
  avatarUrl?: string;
}

export interface CreateUserData {
  email: string;
  passwordHash?: string;
  passwordSalt?: string;
  googleSub?: string;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByGoogleSub(googleSub: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  updateAvatar(id: string, avatarUrl: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");
