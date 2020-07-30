FROM node:12
WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/api/server
RUN npm install

WORKDIR /usr/src/app/api
RUN npm install

EXPOSE 3000
CMD [ "node", "-r" , "esm" , "index.js" ]
