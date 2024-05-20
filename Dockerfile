FROM node:lts-slim as base

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
COPY ./myapp .

# Dev image
FROM base as dev
EXPOSE 3000
RUN yarn install
CMD [ "yarn", "run", "dev" ]

# Test image
FROM base as test
EXPOSE 3000
RUN yarn install
CMD [ "yarn", "run", "test" ]

# Prod image
FROM base as prod
EXPOSE 3000
RUN yarn install --prod
CMD [ "yarn", "run", "prod" ]