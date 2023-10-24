FROM node:18-alpine

RUN apk add --no-cache postgresql-client

RUN apk add --no-cache openssh-client

WORKDIR /usr/src/app