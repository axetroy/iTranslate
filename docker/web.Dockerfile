FROM node:8.12.0-alpine

RUN npm config set registry https://registry.npm.taobao.org \
    && npm install pm2 -g \
    && apk add python

USER node

RUN mkdir -p /home/node/app \
    && chown node /home/node/app

WORKDIR /home/node/app

ADD ./package.json /home/node/app/package.json
ADD ./yarn.lock /home/node/app/yarn.lock

RUN rm -rf ./node_modules
RUN yarn