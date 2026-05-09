# Use Ubuntu as the base operating system for my sandbox
FROM ubuntu:latest

# Update system and install Python3 and inotify-tools (for monitoring file changes)
RUN apt-get update && apt-get install -y \
    python3 \
    inotify-tools \
    && rm -rf /var/lib/apt/lists/*

# Create a working directory inside the container
WORKDIR /sandbox

# Copy the Angular honeypot project into the container
# Note: i made dockerignore file so it will not add the node_module to save space
COPY bank-project/ ./bank-project/

# Keep the container running in the background infinitely
CMD ["tail", "-f", "/dev/null"]