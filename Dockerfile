FROM node:9.7-alpine

WORKDIR /var/app
ADD . /var/app

RUN yarn install &&\
    chown -R node:node /var/app

USER node

EXPOSE 8080

CMD ["yarn", "run", "start"]
