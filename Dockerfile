FROM node:8

WORKDIR /opt/pwnbot

COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY . .
ENV TOKEN NTc4NzIyNjE2Njc2ODQzNTIy.XN3vpQ.SXp0UdRMbJu77fv_xMwcJ5QLBEg
CMD [ "node", "index.js" ]