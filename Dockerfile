FROM node:8

WORKDIR /opt/pwnbot

COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY . .
CMD [ "node", "index.js" ]