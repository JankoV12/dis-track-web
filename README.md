# dis-bot-web

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
npm run server
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your configuration. At minimum, set `VITE_API_BASE_URL` to the URL of the backend API.

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Adding Songs to the Queue

While viewing a server's player page, enter a song or playlist URL in the **Add**
 form and submit it to queue the track using the `/api/queue/{guildId}/add`
 endpoint. The requester field is automatically filled with your Discord
 username.
