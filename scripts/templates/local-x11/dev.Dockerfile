# Choose the base image
FROM $DEVCONTAINER_NAME-base

# Install libraries we need
RUN apt-get update && \
    apt-get install -y \
    x11-apps

# Create the user
RUN groupadd --gid ${USER_GID} ${USER_UID} \
    && useradd --uid ${USER_UID} --gid ${USER_GID} -m ${USER_NAME} \
    # Install packages for sudo support
    && apt-get update && apt-get install -y sudo acl \
    # Give them passwordless sudo 
    && echo ${USER_NAME} ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/${USER_NAME} \
    && chmod 0440 /etc/sudoers.d/${USER_NAME}

# Set the default user
USER ${USER_NAME}