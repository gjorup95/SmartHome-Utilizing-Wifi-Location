
# Use the base image of arm32v7/node
FROM node:14-alpine


RUN apk add --no-cache git python python-dev gcc g++ curl make ca-certificates 


COPY package*.json ./

COPY . .


RUN npm install

EXPOSE 10503


CMD ["node", "server.js"]
