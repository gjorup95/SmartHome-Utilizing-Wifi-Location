
# Use the base image of arm32v7/node
FROM arm32v7/node:14-alpine


RUN apk add --no-cache git python python-dev gcc g++ curl make ca-certificates && \
 git clone -b V71 --single-branch https://github.com/joan2937/pigpio.git /usr/src/pigpio && \
 (cd /usr/src/pigpio && \
  sed -i 's,/usr/local,/usr,' Makefile && \
  sed -i 's,ldconfig,,' Makefile && \
  make && \
  make install) && \
 rm -rf /usr/src/pigpio

COPY package*.json ./

COPY . .


RUN npm install

EXPOSE 10503


CMD ["node", "server.js"]
