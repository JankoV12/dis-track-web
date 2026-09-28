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


## Topgun deployment

Directory: `/home/janko/dis-track-web`. Run:

```sh
docker compose -f docker-compose.topgun.yml up --build -d
```

Attach Traefik to `proxy-public` and route `disbot.slavetraders.tech` to
`http://dis-track-web:80`. The frontend proxies `/api/` to `http://dis-track:3000`
on the same Docker network. No host port is published. The public Discord client
ID is compiled into the frontend; client secrets and bot tokens stay in the backend.

Configure `CLIENT_ID` and `CLIENT_SECRET` in `/home/janko/dis-track/.env` and
register `https://disbot.slavetraders.tech/login` as the Discord OAuth redirect URI.

## Player and queue

The player refreshes every five seconds while visible. Queue requests use 50-item
pages and debounced search; the interface retains the last known data on network
errors. Shuffle changes upcoming songs only. Track links open their source in a
new tab. Playback/add failures are shown inline rather than silently clearing data.

### Browser regression check

Install Google Chrome, then run the following in separate terminals:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
npm run test:player
```

The test intercepts API calls with a 1,000-song fixture; it does not modify a live
Discord queue. It checks pagination, search, shuffle, pause, add failures,
network recovery, server switching, and mobile overflow. On Node 25, use
`NODE_OPTIONS=--no-experimental-webstorage npm run build` for the older Vue devtools
plugin. Production builds use Node 24 in Docker.
