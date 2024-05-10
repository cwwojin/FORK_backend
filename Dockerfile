FROM node:latest as base

# Install necessary packages
# RUN apt-get update && apt-get install -y \
#     unzip \
#     curl

# AWS CLI
# RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
# RUN unzip awscliv2.zip
# RUN ./aws/install

# App setup & dependencies
WORKDIR /usr/myapp
COPY ./myapp/package.json ./
RUN npm install --omit=dev
COPY ./myapp .

# Dev image
FROM base as dev
EXPOSE 3000
RUN npm install -D
CMD [ "npm", "run", "dev" ]

# Test image
FROM base as test
EXPOSE 3000
CMD [ "npm", "run", "test" ]

# Prod image
FROM base as prod
EXPOSE 3000
CMD [ "npm", "run", "prod" ]