FROM node:latest

# Create app directory
RUN mkdir -p /usr/stfdigital/src
WORKDIR /usr/stfdigital

# Install app dependencies
RUN npm install -g superstatic

# Bundle app source
COPY . /usr/stfdigital/src/
WORKDIR /usr/stfdigital/src

ENTRYPOINT ["superstatic", "--port", "8080", "--host", "0.0.0.0"]