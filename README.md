# Xenophylaxis

Client code, asset pipeline, & distribution support for an entry to ["The Year Long Jam"](https://itch.io/jam/the-year-long-jam-1) game jam.

> Although this is a public repository, due to licensing and distribution constraints, some content must exist in git submodules with private remote access. Having said that, I hope some development examples or insights can be found.

## Requirements

Primary development & build support assumes a Windows environment with the following systems available:

- Git
    - [Git for Windows](https://git-scm.com/downloads/win) (Git Bash shell is also recommended)
- NodeJS
    - [Windows Installer](https://nodejs.org/en/download) (v22 LTS recommended, Chocolatey package manager recommended)
- Make
    - [Chocolatey Package](https://community.chocolatey.org/packages/make)
- Docker & Docker Compose
    - [Install Docker Desktop on Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
- Rust
    - [rustup](https://rustup.rs/)

## Quick Start

1. `git clone --recurse-submodules https://github.com/kidthales/xenophylaxis.git`
2. `cd xenophylaxis`
3. `make node_modules assets start`

## Usage

### Make

- List available make targets: `make help`

## License

[MIT](./LICENSE)
