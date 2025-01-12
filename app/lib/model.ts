type Session = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  session_token: string | null;
  session_data: string | null;
  expiresAt: Date;
  userId: number;
  user?: User;
};

type User = {
  id: number;
  fullname: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

type Link = {
  id: number;
  link: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  title: string;
  slug: string;
};

type Page = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  title: string;
  slug: string;
  content: PageContent | null;
  published: boolean;
  description: string | null;
};

type PageContent = ContentItem[];

type ContentItem = TitleContent | LinkContent;

type TitleContent = {
  title: string;
  id: string
};

type LinkContent = {
  title: string;
  url: string;
  id: string
};
