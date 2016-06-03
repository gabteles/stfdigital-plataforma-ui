FROM node:slim

# Create app directory
RUN mkdir -p /usr/stfdigital/src

WORKDIR /usr/stfdigital/src

# Install app dependencies
RUN npm install superstatic --save

# Bundle app source
COPY . /usr/stfdigital/src/

ENTRYPOINT ["node", "./superstatic.js"]
CMD ["--port", "8443", "--host", "0.0.0.0", "--config", "superstatic.json", "--keyFile", "/usr/stfdigital/src/docker/server.key", "--certFile", "/usr/stfdigital/src/docker/server.crt"]