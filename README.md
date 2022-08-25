# sku-path-finder

An example of developing a product specification (SKU) selection using next.

## Project layout

```text
.
|-- README.md
|-- components
|   `-- sku
|       `-- index.tsx
|-- next.config.js
|-- package.json
|-- pages
|   |-- _app.tsx
|   |-- api
|   |   `-- hello.ts
|   `-- index.tsx
|-- public
|   |-- favicon.ico
|   `-- vercel.svg
|-- styles
|   |-- Home.module.css
|   `-- globals.css
|-- tsconfig.json
|-- utils
|   `-- index.ts
`-- yarn.lock
```

## Setup

Install dependencies:

```bash
cd skuPathFinder

yarn install
```

## Build the code

Build all packages:

```bash
yarn build
```

## Auto Deploy

After pushing to the `main` branch, it will automatically deploy the project.

ref: <https://fedeantuna.github.io/article/deploy-nextjs-app-to-github-pages>

## License

This is a fork from [skuPathFinder-back](https://github.com/zcy-inc/skuPathFinder-back)

MIT
