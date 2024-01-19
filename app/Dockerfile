FROM node:18

WORKDIR /app
ADD --chown=555 index.js ./
ADD package.json ./
RUN npm install
EXPOSE 3000

CMD node index.js
