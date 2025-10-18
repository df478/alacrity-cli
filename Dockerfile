FROM node:14-alpine
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install && \
     npm cache clean --force && \
     npm run build

ENV NODE_ENV production

WORKDIR /usr/src/app/built/commands
ENV PATH="/usr/src/app/built/commands:${PATH}"

RUN mv alacrity.js alacrity



CMD ["echo" , "'Usage: docker run -it alacrity/cli-alacrity:VERSION_HERE alacrity serversetup'"]
