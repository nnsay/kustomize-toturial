FROM --platform=linux/amd64 node:18-alpine
WORKDIR /app
ADD package.json ./
ADD index.js ./
RUN npm install
RUN npm install bytenode -g
EXPOSE 3000
CMD node index.js
# RUN bytenode -c index.js
# CMD bytenode index.jsc
