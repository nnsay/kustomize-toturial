FROM node:18-alpine
WORKDIR /app
ADD --chown=555 index.js ./
RUN npm install bytenode -g
RUN bytenode -c index.js

FROM node:18-alpine
WORKDIR /app
ADD package.json ./
COPY --from=0 /app/index.jsc ./
RUN npm install
RUN npm install bytenode -g
EXPOSE 3000
CMD bytenode index.jsc
