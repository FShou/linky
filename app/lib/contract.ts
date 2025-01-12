interface ILinkRepository {
  create: (link: Link) => Promise<undefined | Link>;
  update: (link: Link) => Promise<undefined | Link>;
  delete: (id: number) => Promise<void>;
  getAll: () => Promise<undefined | Link[]>;
  getAllByUserId: (id: number) => Promise<undefined | Link[]>;
  getBySlug: (slug: string) => Promise<undefined | Link>;
  getTotalLinksByUserId: (userId: number) => Promise<undefined | number> 
  getTotalLink:()=> Promise<undefined | number>
  getRecentLinksByUserId: (userId: number) => Promise<undefined | Link[]>
}

interface IPageRepository{
  create: (page: Page) => Promise<undefined | Page>;
  update: (page: Page) => Promise<undefined | Page>;
  delete: (id: number) => Promise<void>;
  getAllByUserId: (id: number) => Promise<undefined | Page[]>;
  getBySlug: (slug: string) => Promise<undefined | Page>;
  getByIdAndUserId: (id: number, userId: number) => Promise<undefined | Page>
  getPublishedBySlug: (slug: string) => Promise<undefined | Page>;
  setPublished: (page: number, isPublished: boolean) => Promise<undefined | Page>
  getTotalPagesByUserId: (userId: number) => Promise<undefined | number> 
  getRecentPagesByUserId: (userId: number) => Promise<undefined | Page[]>
  getTotalPage:()=> Promise<undefined | number>
}


interface IAuthRepository {
  validateSessionToken(sessionToken: string): Promise<boolean>;
  updateSession(session: Session): Promise<void>;
  createSession(userId: number): Promise<Session | undefined>;
  getSession(sessionToken: string): Promise<Session | undefined>;
  deleteSession(sessionToken: string): Promise<void>;
  login(username: string, password: string): Promise<Session | undefined>;
  createUser(username: string, password: string, fullname: string): Promise<User | false>;
  updateUser(user: User, oldPassword?: string): Promise<undefined | User>
  updateUserForAdmin(user: User ): Promise<undefined | User>
  deleteUser(userId: number): Promise<void>
  getAllUser(): Promise<undefined | User[]>
  getUserById(id: number): Promise<undefined| User>
  getUserByUsername(username: string): Promise<undefined|User>
}
