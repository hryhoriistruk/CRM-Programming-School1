FROM node:20-alpine

MAINTAINER Hryhorii S.

RUN mkdir /app
WORKDIR /app

COPY ./backend/package.json /app

RUN npm i

