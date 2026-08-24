# Retain

A cross-platform, local-first active-recall study app built with Electron, React,
and TypeScript.

## Development

```bash
npm install
npm run dev
```

## Checks and builds

```bash
npm run typecheck
npm run build
npm run package
npm run dist
```

To run the standard build in the project container:

```bash
docker build -t retain-build .
docker run --rm retain-build
```

- `build` creates the production application bundles in `out/`.
- `package` creates an unpacked application for the current platform in `dist/`.
- `dist` creates an installer or distributable for the current platform.

## Process structure

- `src/main/` owns Electron windows, OS integration, persistence, and native services.
- `src/preload/` exposes narrowly scoped, typed APIs to the renderer.
- `src/renderer/` contains the React user interface.

The renderer runs with context isolation and without direct Node.js access.
