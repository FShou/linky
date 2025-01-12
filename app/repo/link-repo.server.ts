import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "db/schema/schema.server";
import { count, desc, eq } from "drizzle-orm";

let linkRepo: LinkRepository;

export function getLinkRepo(env: Env) {
  if (!linkRepo) linkRepo = new LinkRepository(env);
  return linkRepo;
}

class LinkRepository implements ILinkRepository {
  private db: DrizzleD1Database<typeof schema> & {
    $client: D1Database;
  };

  constructor(env: Env) {
    this.db = drizzle(env.DB, { schema });
  }
  async getAllByUserId(id: number): Promise<undefined | Link[]> {
    const links = await this.db.query.links.findMany({
      where: eq(schema.links.userId, id),
      orderBy: desc(schema.links.updatedAt),
    });
    return links
  }
  async getTotalLinksByUserId(userId: number): Promise<undefined | number> {
    const totals = await this.db
      .select({ total: count() })
      .from(schema.links)
      .where(eq(schema.links.userId, userId));
    if (!totals) return undefined;
    const total = totals[0].total;

    return total;
  }
  async getTotalLink(): Promise<undefined | number> {
    const totals = await this.db.select({ total: count() }).from(schema.links);
    if (!totals) return undefined;
    const total = totals[0].total;
    return total;
  }

  async getRecentLinksByUserId(userId: number): Promise<undefined | Link[]> {
    const recentLinks = await this.db.query.links.findMany({
      where: eq(schema.links.userId, userId),
      orderBy: desc(schema.links.updatedAt),
      limit: 3,
    });
    if (!recentLinks) return undefined;
    return recentLinks;
  }

  async create(_link: Link): Promise<undefined | Link> {
    const { title, slug, userId, link } = _link;
    const newLink = await this.db
      .insert(schema.links)
      .values({
        link,
        userId,
        title,
        slug,
      })
      .returning();

    return newLink.at(0);
  }
  async update(_link: Link): Promise<undefined | Link> {
    const newLink = await this.db
      .update(schema.links)
      .set(_link)
      .where(eq(schema.links.id, _link.id))
      .returning();

    return newLink.at(0);
  }
  async delete(id: number): Promise<void> {
    await this.db.delete(schema.links).where(eq(schema.links.id, id));
  }
  async getAll(): Promise<undefined | Link[]> {
    const links = await this.db.query.links.findMany({
      orderBy: [desc(schema.links.updatedAt)],
    });

    return links;
  }
  async getBySlug(slug: string): Promise<undefined | Link> {
    const link = await this.db.query.links.findFirst({
      where: eq(schema.links.slug, slug),
    });

    return link;
  }

  async seedDb() {
    const data = [
      {
        link: "https://www.facebook.com",
        description:
          "Facebook homepage keajaiban duniawi yang ada di indonesia ini",
        userId: 1,
        title: "Surat Keputusan Pergilaan Duniawi SKPD",
        slug: "facebook",
        qrCode: null,
      },
      {
        link: "https://www.instagram.com",
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01"),
        description: "Instagram homepage",
        userId: 1,
        title: "Instagram",
        slug: "instagram",
      },
      {
        link: "https://www.instagram.com",
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01"),
        description: "Instagram homepage",
        userId: 1,
        title: "Instagram",
        slug: "gg",
      },
    ];

    await this.db.insert(schema.links).values(data);
  }
}
