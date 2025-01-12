import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "db/schema/schema.server";
import { and, count, desc, eq } from "drizzle-orm";

let pageRepo: PageRepository;

export function getPageRepo(env: Env) {
  if (!pageRepo) pageRepo = new PageRepository(env);
  return pageRepo;
}

class PageRepository implements IPageRepository {
  private db: DrizzleD1Database<typeof schema> & {
    $client: D1Database;
  };

  constructor(env: Env) {
    this.db = drizzle(env.DB, { schema });
  }
  async getTotalPage(): Promise<undefined | number> {
    const totals = await this.db.select({ total: count() }).from(schema.pages);
    if (!totals) return undefined;
    const total = totals[0].total;

    return total;
  }
  async getTotalPagesByUserId(userId: number): Promise<undefined | number> {
    const totals = await this.db
      .select({ total: count() })
      .from(schema.pages)
      .where(eq(schema.pages.userId, userId));
    if (!totals) return undefined;
    const total = totals[0].total;

    return total;
  }
  async getRecentPagesByUserId(userId: number): Promise<undefined | Page[]> {
    const recentPages = this.db.query.pages.findMany({
      where: eq(schema.pages.userId, userId),
      orderBy: desc(schema.pages.updatedAt),
      limit: 3,
    });

    if (!recentPages) return undefined;

    return recentPages;
  }
  async getByIdAndUserId(
    id: number,
    userId: number
  ): Promise<undefined | Page> {
    const page = await this.db.query.pages.findFirst({
      where: and(eq(schema.pages.id, id), eq(schema.pages.userId, userId)),
    });
    return page;
  }
  async setPublished(pageId: number, isPublished: boolean) {
    const page = await this.db
      .update(schema.pages)
      .set({
        published: isPublished,
      })
      .where(eq(schema.pages.id, pageId))
      .returning();

    return page.at(0);
  }
  async create(page: Page): Promise<undefined | Page> {
    const newPage = await this.db.insert(schema.pages).values(page).returning();
    return newPage.at(0);
  }
  async update(page: Page): Promise<undefined | Page> {
    const updatedPage = await this.db
      .update(schema.pages)
      .set(page)
      .where(eq(schema.pages.id, page.id))
      .returning();
    return updatedPage.at(0);
  }
  async delete(id: number): Promise<void> {
    await this.db.delete(schema.pages).where(eq(schema.pages.id, id));
  }
  async getAllByUserId(userId: number): Promise<undefined | Page[]> {
    const pages = await this.db.query.pages.findMany({
      where: eq(schema.pages.userId, userId),
      orderBy: desc(schema.pages.updatedAt),
    });

    return pages;
  }
  async getBySlug(slug: string): Promise<undefined | Page> {
    const page = await this.db.query.pages.findFirst({
      where: eq(schema.pages.slug, slug),
    });
    return page;
  }

  async getPublishedBySlug(slug: string): Promise<undefined | Page> {
    const page = await this.db.query.pages.findFirst({
      where: and(eq(schema.pages.slug, slug), eq(schema.pages.published, true)),
    });

    return page;
  }

  async seed() {
    const dummyPages: Page[] = [
      {
        id: 1,
        createdAt: new Date("2024-11-01T10:00:00Z"),
        updatedAt: new Date("2024-11-02T12:00:00Z"),
        userId: 1,
        title: "Page 1",
        slug: "page-1",
        content: [
          { title: "Welcome to our site!", id: crypto.randomUUID() }, // Title 1
          {
            title: "Google",
            url: "https://google.com",
            id: crypto.randomUUID(),
          }, // Link 1
          {
            title: "YouTube",
            url: "https://youtube.com",
            id: crypto.randomUUID(),
          }, // Link 2
          { title: "Explore our resources!", id: crypto.randomUUID() }, // Title 2
          {
            title: "GitHub",
            url: "https://github.com",
            id: crypto.randomUUID(),
          }, // Link 3
        ],
        published: true,
        description: null,
      },
      {
        id: 2,
        createdAt: new Date("2024-11-03T09:00:00Z"),
        updatedAt: new Date("2024-11-03T15:00:00Z"),
        userId: 1,
        title: "Page 2",
        slug: "page-2",
        content: [
          { title: "Useful Links", id: crypto.randomUUID() } as TitleContent, // Title 1
          {
            title: "Stack Overflow",
            url: "https://stackoverflow.com",
            id: crypto.randomUUID(),
          }, // Link 1
          {
            title: "MDN Web Docs",
            url: "https://developer.mozilla.org",
            id: crypto.randomUUID(),
          }, // Link 2
          { title: "Developer Resources", id: crypto.randomUUID() }, // Title 2
          {
            title: "FreeCodeCamp",
            url: "https://freecodecamp.org",
            id: crypto.randomUUID(),
          }, // Link 3
        ],
        published: true,
        description: null,
      },
      {
        id: 3,
        createdAt: new Date("2024-11-04T08:00:00Z"),
        updatedAt: new Date("2024-11-04T16:00:00Z"),
        userId: 1,
        title: "Page 3",
        slug: "page-3",
        content: [
          { title: "Learn with Us", id: crypto.randomUUID() }, // Title 1
          {
            title: "Hacker News",
            url: "https://news.ycombinator.com",
            id: crypto.randomUUID(),
          }, // Link 1
          {
            title: "Reddit",
            url: "https://reddit.com",
            id: crypto.randomUUID(),
          }, // Link 2
          { title: "Stay Updated", id: crypto.randomUUID() }, // Title 2
          {
            title: "LinkedIn",
            url: "https://linkedin.com",
            id: crypto.randomUUID(),
          }, // Link 3
        ],
        published: false,
        description: null,
      },
    ];

    await this.db.insert(schema.pages).values(dummyPages);
  }
}
