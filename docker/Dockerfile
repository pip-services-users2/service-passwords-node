FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy project file
COPY package.json .

# Install ALL node_modules, including 'devDependencies'
RUN npm install

# Copy entire project
COPY . .

# set default environment variables
ENV MONGO_SERVICE_URI ""
ENV MONGO_SERVICE_HOST mongo
ENV MONGO_SERVICE_PORT 27017
ENV MONGO_DB app

EXPOSE 8080

ENTRYPOINT [ "node", "./bin/main.js" ]
