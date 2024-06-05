FROM node:lts-alpine as base

# Set timezone
ENV TZ=Asia/Seoul
RUN apk add tzdata && ln -s /usr/share/zoneinfo/Asia/Seoul /etc/localtime

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