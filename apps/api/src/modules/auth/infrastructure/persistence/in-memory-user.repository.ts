import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CreateUserData, User, UserRepository } from "./user.repository";

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findByGoogleSub(googleSub: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.googleSub === googleSub) return user;
    }
    return null;
  }

  async create(data: CreateUserData): Promise<User> {
    const user: User = { id: randomUUID(), ...data };
    this.users.set(user.id, user);
    return user;
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<void> {
    const user = this.users.get(id);
    if (user) this.users.set(id, { ...user, avatarUrl });
  }
}
