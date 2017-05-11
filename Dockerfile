FROM mhart/alpine-node:7.9.0
MAINTAINER Ross Hendry "rhendry@googlemail.com"

ENV HASH_SECRET='not really this'

ADD . /opt/apps/ace-volume-updater
WORKDIR /opt/apps/ace-volume-updater

RUN npm install && npm cache clean
EXPOSE 7777
CMD ["npm", "start"]
