FROM ubuntu

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update &&\
    apt-get install -y \
        git \
        dh-make devscripts