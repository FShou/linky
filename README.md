# Welcome to Linky
![Linky](https://linky-8yt.pages.dev/preview-wa.png)
Linky is crafted for simple link management.
You can create and manage short-link as well creating linktree linke page.
You can use this by deploying this to Cloudflare Pages if you want.

# Guides
## Deployment
1. Clone the repo
2. Connect to Cloudflare Pages
4. Configure DB
3. Migrate DB
6. Set Env
8. open /seeder on first visit.

## Usage
1. Login default  username `admin`, password `123`
2. Create Short-URL
3. Create linktree like Page
4. Multi-user support

## DB Migration 
### Production
```sh
pnpm generate
pnpm db:migrate:production
```
### Local for development
```sh
pnpm generate
pnpm db:migrate:local
```
### Preview
```sh
pnpm generate
pnpm db:migrate:preview
```
## Development

Run the dev server:

```sh
pnpm dev
```
