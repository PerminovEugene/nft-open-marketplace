FROM node:18

WORKDIR /app

COPY yarn.lock .
COPY package.json .

# Копируем package.json пакета
COPY packages/pnft-market-etherium/package.json ./packages/pnft-market-etherium/

RUN yarn install

WORKDIR /app/packages/pnft-market-etherium

RUN yarn install

EXPOSE 8545

CMD ["npm", "run", "node"]