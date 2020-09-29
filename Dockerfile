# Use the base image of arm32v7/node
FROM arm32v7/node

RUN apk add --no-cache nodejs npm

WORKDIR /app


COPY . /app

RUN sudo npm install

EXPOSE 10503
