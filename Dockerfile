FROM node:6.9.1

# create app
RUN mkdir -p /usr/src/app

# create workdir
WORKDIR /usr/src/app

# Copy the package.json
COPY package.json /usr/src/app/

# Install the dependencies
RUN npm install

# Src
RUN mkdir src

# RUn the project after build
CMD npm start