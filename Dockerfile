#syntax=docker/dockerfile:1.4

FROM ghcr.io/kidthales/aseprite:headless-v1.3.10.1 AS aseprite

FROM node:lts

ENV XDG_RUNTIME_DIR /tmp/runtime-root

WORKDIR /tmp

# Install dependencies.
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
	curl \
	ca-certificates \
	libc++1-16 \
	libfontconfig1 \
	libgl1 \
	libqt5svg5-dev \
	libsm6 \
	libssl3 \
	libxcursor1 \
	qbs \
	qtbase5-dev \
	qtbase5-private-dev \
	qtdeclarative5-dev \
	qtdeclarative5-private-dev \
	qttools5-dev-tools \
	xauth \
	xvfb \
	zlib1g-dev \
	&& rm -rf /var/lib/apt/lists/*

# Install Aseprite
WORKDIR /opt/aseprite/bin
COPY --from=aseprite /opt/aseprite/bin .
RUN chmod +x /opt/aseprite/bin/aseprite && \
	ln -s /opt/aseprite/bin/aseprite /usr/local/bin/aseprite && \
	ln -s /opt/aseprite/bin/aseprite /usr/local/bin/ase && \
	# Smoke test
	ase --help

# Install Tiled
WORKDIR /opt/tiled
RUN curl --show-error --silent --location --output AppImage https://github.com/mapeditor/tiled/releases/download/v1.11.0/Tiled-1.11.0_Linux_Qt-5_x86_64.AppImage && \
	chmod +x /opt/tiled/AppImage && \
	./AppImage --appimage-extract && \
	rm ./AppImage && \
	echo '#!/usr/bin/env bash\nxvfb-run /opt/tiled/squashfs-root/usr/bin/tiled ${@}' > /usr/local/bin/tiled && \
	chmod +x /usr/local/bin/tiled && \
	# Smoke test
	tiled --help

# Global NPM packages
WORKDIR /tmp
RUN npm install -g tile-extruder

WORKDIR /workspace
