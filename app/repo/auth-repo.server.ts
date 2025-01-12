import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "db/schema/schema.server";
import { and, eq } from "drizzle-orm";
import {
  generateSessionToken,
  hashPassword,
  verifyPassword,
} from "~/lib/hash.server";
import { DAY } from "~/lib/utils";

let authRepo: AuthRepository;

export function getAuthRepo(env: Env) {
  if (!authRepo) authRepo = new AuthRepository(env);
  return authRepo;
}

class AuthRepository implements IAuthRepository {
  private db: DrizzleD1Database<typeof schema> & {
    $client: D1Database;
  };

  constructor(env: Env) {
    this.db = drizzle(env.DB, { schema });
  }
  async updateUserForAdmin(user: User): Promise<undefined | User> {
    const admin = await this.getUserByUsername("admin");
    if (user.id === admin!!.id) {
      user.username = "admin";
    }

    if (!user.password) {
      const updatedUser = await this.db
        .update(schema.users)
        .set({
          id: user.id,
          username: user.username,
          fullname: user.fullname,
        } as User)
        .where(eq(schema.users.id, user.id))
        .returning();
      return updatedUser.at(0);
    }

    const hashedPassword = await hashPassword(user.password);
    const updatedUser = await this.db
      .update(schema.users)
      .set({
        ...user,
        password: hashedPassword,
      })
      .where(eq(schema.users.id, user.id))
      .returning();
    return updatedUser.at(0);
  }
  async getUserByUsername(username: string): Promise<undefined | User> {
    const user = this.db.query.users.findFirst({
      where: eq(schema.users.username, username),
    });
    return user;
  }

  async updateUser(
    user: User,
    oldPassword?: string
  ): Promise<undefined | User> {
    if (!oldPassword) {
      const updatedUser = await this.db
        .update(schema.users)
        .set(user)
        .where(eq(schema.users.id, user.id))
        .returning();
      return updatedUser.at(0);
    }

    const userInDb = await this.db.query.users.findFirst({
      where: and(eq(schema.users.id, user.id)),
    });

    if (!userInDb) return undefined;

    const isCorrectPassword = await verifyPassword(
      userInDb.password,
      oldPassword
    );

    if (!isCorrectPassword) return undefined;

    const hashedPassword = await hashPassword(user.password);
    const updatedUser = await this.db
      .update(schema.users)
      .set({
        ...user,
        password: hashedPassword,
      })
      .where(eq(schema.users.id, user.id))
      .returning();

    return updatedUser.at(0);
  }

  async deleteUser(userId: number): Promise<void> {
    await this.db.delete(schema.users).where(eq(schema.users.id, userId));
  }
  async getAllUser(): Promise<undefined | User[]> {
    const users = await this.db.query.users.findMany();
    if (!users) return undefined;

    return users;
  }
  async getUserById(id: number): Promise<undefined | User> {
    const users = await this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });

    return users;
  }

  async validateSessionToken(sessionToken: string) {
    const session = await this.getSession(sessionToken);

    if (!session) return false;

    if (session.expiresAt <= new Date()) {
      return false;
    }

    session.expiresAt = new Date(Date.now() + 1 * DAY);
    await this.updateSession(session);
    return true;
  }

  async updateSession(session: Session) {
    await this.db.update(schema.sessions).set(session);
  }

  async createSession(userId: number) {
    const expiresAt = new Date(Date.now() + 1 * DAY);
    const session = await this.db
      .insert(schema.sessions)
      .values({
        expiresAt,
        userId,
        session_token: generateSessionToken(),
      })
      .returning();

    return session[0];
  }

  async getSession(sessionToken: string) {
    const session = await this.db.query.sessions.findFirst({
      with: {
        user: true,
      },
      where: eq(schema.sessions.session_token, sessionToken),
    });

    return session;
  }

  async deleteSession(sessionToken: string) {
    await this.db
      .delete(schema.sessions)
      .where(eq(schema.sessions.session_token, sessionToken));
  }

  async login(username: string, password: string) {
    const user = await this.db.query.users.findFirst({
      where: and(eq(schema.users.username, username)),
    });

    if (!user) return undefined;

    const isCorrectPassword = await verifyPassword(user.password, password);

    if (!isCorrectPassword) return undefined;

    const session = await this.createSession(user.id);

    return session;
  }

  async createUser(username: string, password: string, fullname: string) {
    const passwordHash = await hashPassword(password);
    const user = await this.db
      .insert(schema.users)
      .values({
        username,
        password: passwordHash,
        fullname,
      })
      .returning();
    if (!user[0]) return false;

    return user[0];
  }

  async seedDb() {
    const admin = await this.createUser("admin", "123", "Admin");

    return admin;
  }
}
