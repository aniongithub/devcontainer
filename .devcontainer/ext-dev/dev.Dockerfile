# Choose the base image
FROM $DEVCONTAINER_NAME-base

ARG DEVCONTAINER_CLI_URL="https://github.com/aniongithub/devcontainer/releases/download/0.2/devcontainer_0.2-1_all.deb"

# Install our devcontainer CLI tool
RUN apt-get update &&\
    apt-get install -y wget &&\
    wget -O /tmp/devcontainer.deb $DEVCONTAINER_CLI_URL &&\
    dpkg -i /tmp/devcontainer.deb

# Create the user
RUN groupadd --force --gid ${USER_GID} ${USER_UID} \
    && useradd --non-unique --uid ${USER_UID} --gid ${USER_GID} -m ${USER_NAME} \
    # Install packages for sudo support
    && apt-get update && apt-get install -y sudo acl \
    # Give them passwordless sudo 
    && echo ${USER_NAME} ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/${USER_NAME} \
    && chmod 0440 /etc/sudoers.d/${USER_NAME}

# Set the default user
USER ${USER_NAME}