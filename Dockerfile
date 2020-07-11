FROM node:12.18.0 as builder

WORKDIR /server

# Copy package file
COPY yarn.lock .
COPY package.json .
RUN yarn

# Copy src
COPY . .

#Run lint, tests & build
RUN yarn lint
RUN yarn test
RUN yarn build

ENV PORT=3000
ARG APP_VERSION=0.0.0
ENV APP_VERSION=$APP_VERSION

CMD yarn run start
