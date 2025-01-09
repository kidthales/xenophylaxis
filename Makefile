# Executables (local)
DKR_CMP = docker compose
NPM     = npm

# Docker containers
TK_RUN := $(DKR_CMP) run --rm toolkit

# Executables (container)
ASE   := $(TK_RUN) ase
TILED := $(TK_RUN) tiled
TILEX := $(TK_RUN) tile-extruder

# Misc
.DEFAULT_GOAL = start
.PHONY        : start docker-build ase tiled tilex

start:
	@$(NPM) run tauri dev

docker-build:
	@$(DKR_CMP) build --pull --no-cache

ase:
	@$(eval c ?=)
	@$(ASE) $(c)

tiled:
	@$(eval c ?=)
	@$(TILED) $(c)

tilex:
	@$(eval c ?=)
	@$(TILEX) $(c)
