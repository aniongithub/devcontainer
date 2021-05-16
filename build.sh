#!/bin/bash

# Build our container with tools required
docker build -t devcontainer-packager .

# Clean any previous build artifacts
rm -f devcontainer_*.*

# Pipe commands from our packaging script to the container we just built
cat build-package.sh | docker run --rm -i -v $PWD:/devcontainer devcontainer-packager /bin/bash