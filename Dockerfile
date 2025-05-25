FROM node:20.17-bookworm

ARG NEXT_PUBLIC_SUPABASE_URL

ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

LABEL org.opencontainers.image.source=https://github.com/yosrahajtaieb/homefix
