FROM node:8-alpine

USER node

RUN mkdir -p /home/node/app
RUN chown node /home/node/app

WORKDIR /home/node/app

ADD ./package.json /home/node/app/package.json
ADD ./yarn.lock /home/node/app/yarn.lock

RUN rm -rf ./node_modules
RUN yarn