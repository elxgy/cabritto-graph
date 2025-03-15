FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm@latest

COPY package.json pnpm-lock.yaml ./

RUN echo "node-linker=hoisted" > .npmrc

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]