FROM node

RUN apt-get update &&\
    apt-get install -y \
        jq
    
RUN npm install -g \
    yo \
    generator-code \
    vsce

USER node