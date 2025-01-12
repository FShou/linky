# Welcome to Linky
![Linky](https://linky-8yt.pages.dev/preview-wa.png)
Linky is crafted for simple link management.
You can create and manage short-link as well creating linktree linke page.
You can use this by deploying this to Cloudflare Pages if you want.

# Guides
## Deployment
1. Clone the repo
2. Create DB1 in Cloudflare Dashboard named `linky`
3. Create wrangler.toml from the example
4. Migrate DB
5. Connect to Cloudflare Pages
8. open /seeder on first visit.

## Usage
1. Login default  username `admin`, password `123`
2. Create Short-URL ![screenshot_12012025_194159](https://github.com/user-attachments/assets/3c359a74-5ae3-444e-9116-19538fa698c9)
3. Create linktree like Page ![15-Real-Page-Linky](https://github.com/user-attachments/assets/8597e9ed-c2cc-48bc-a4c9-c3852c8a5b14)
4. Multi-user support

## DB Migration 
If you change your db name in CF Dashboard also change it in `package.json`
### Production
```sh
pnpm db:migrate:prod
```
### Local for development
```sh
pnpm db:migrate:local
```
### Preview
```sh
pnpm db:migrate:preview
```
## Development
Run the dev server:
```sh
pnpm dev
```
### Preview Branch
You can see deplyed version off preview by pushing to branch other than main
For the preview run DB migration also
