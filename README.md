# Welcome to Remix + Cloudflare!

- 📖 [Remix docs](https://remix.run/docs)
- 📖 [Remix Cloudflare docs](https://remix.run/guides/vite#cloudflare)

## Migration 
### Local
```sh
pnpm generate
pnpm db:migrate:local
```
### Preview
```sh
pnpm generate
pnpm db:migrate:preview
```
### Production
```sh
pnpm generate
pnpm db:migrate:production
```
## Development

Run the dev server:

```sh
pnpm dev
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
pnpm typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
