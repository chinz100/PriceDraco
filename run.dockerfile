FROM node:14.2-alpine

WORKDIR /usr/src/app

VOLUME [ "/usr/src/app" ]


CMD ["npm","start"]
