#!/bin/bash

# Build our container with tools required
docker build -t devcontainer-packager .

# Clean any previous build artifacts
rm -f devcontainer_*.*

export AUTHOR_NAME=${AUTHOR_NAME:-"Ani Balasubramaniam"}
export AUTHOR_EMAIL=${AUTHOR_EMAIL:-"ani@anionline.me"}
export SRC_FOLDER=${SRC_FOLDER:-"/devcontainer/src"}
export PACKAGE_NAME=${PACKAGE_NAME:-"devcontainer"}
export PACKAGE_VERSION=${PACKAGE_VERSION:-"0.0"}

# Pipe commands from our packaging script to the container we just built
# And replace any vars we need
this_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
envsubst '$AUTHOR_NAME $AUTHOR_EMAIL $SRC_FOLDER $PACKAGE_NAME $PACKAGE_VERSION'<$this_dir/build-package.sh |\
    docker run --rm -i -v $PWD:/devcontainer devcontainer-packager /bin/bash