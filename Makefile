# Derived from examples Copyright (c) 2017-2024 Kévin Dunglas & contributors

# Executables (local)
AWK     = awk
DKR_CMP = docker compose
GREP    = grep
NODE    = node
NPM     = npm
SED     = sed

# Docker containers
TK_RUN := $(DKR_CMP) run --rm toolkit

# Executables (container)
ASE   := $(TK_RUN) ase
TILED := $(TK_RUN) tiled
TILEX := $(TK_RUN) tile-extruder

# Misc
.DEFAULT_GOAL = help
.PHONY        : help start node_modules docker-build ase tiled tilex clean-assets clean-fonts clean-html clean-configs

## —— 🔫 👾 Xenophylaxis Makefile 👾 🔫 ————————————————————————————————————————
help: ## Outputs this help screen
	@$(GREP) -E '(^[a-zA-Z0-9\./_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | $(AWK) 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | $(SED) -e 's/\[32m##/[33m/'

## —— NPM 🧊 ———————————————————————————————————————————————————————————————————
start: ## Start local development with webpack & tauri
	@$(NPM) run tauri dev

node_modules: ## Install node_modules according to current package-lock.json file
	@$(NPM) install

## —— Docker 🐳 ————————————————————————————————————————————————————————————————
docker-build: ## Builds docker-based tools
	@$(DKR_CMP) build --pull --no-cache

ase: ## Run aseprite (headless). Pass parameter "c=" to run a given command; example: make ase c="--help"
	@$(eval c ?=)
	@$(ASE) $(c)

tiled: ## Run tiled (headless). Pass parameter "c=" to run a given command; example: make tiled c="--help"
	@$(eval c ?=)
	@$(TILED) $(c)

tilex: ## Run tile-extruder. Pass parameter "c=" to run a given command; example: make tilex c="--help"
	@$(eval c ?=)
	@$(TILEX) $(c)

## —— Assets 🎁 ————————————————————————————————————————————————————————————————

assets: fonts html configs ## Publish all assets

clean-assets: clean-fonts clean-html clean-configs ## Remove all published assets

# Fonts

FONTS = Michroma-Regular.ttf

ART_FONT_DIR    = art/fonts
PUBLIC_FONT_DIR = src/assets/fonts
PUBLIC_FONT_TARGETS    := $(addprefix $(PUBLIC_FONT_DIR)/,$(FONTS))

fonts: $(PUBLIC_FONT_TARGETS) ## Publish fonts

clean-fonts: ## Remove all published fonts
	@$(TK_RUN) rm -rf $(PUBLIC_FONT_DIR)

$(PUBLIC_FONT_DIR)/%.ttf: $(ART_FONT_DIR)/%.ttf
	@$(TK_RUN) cp $< $@

$(PUBLIC_FONT_TARGETS): | $(PUBLIC_FONT_DIR)

$(PUBLIC_FONT_DIR):
	@$(TK_RUN) mkdir -p $(PUBLIC_FONT_DIR)

# HTML

HTML = title-scene.html

DESIGN_HTML_DIR = design/html
PUBLIC_HTML_DIR = src/assets/html
PUBLIC_HTML_TARGETS    := $(addprefix $(PUBLIC_HTML_DIR)/,$(HTML))

html: $(PUBLIC_HTML_TARGETS) ## Publish html

clean-html: ## Remove all published html
	@$(TK_RUN) rm -rf $(PUBLIC_HTML_DIR)

$(PUBLIC_HTML_DIR)/%.html: $(DESIGN_HTML_DIR)/%.html
	@$(TK_RUN) cp $< $@

$(PUBLIC_HTML_TARGETS): | $(PUBLIC_HTML_DIR)

$(PUBLIC_HTML_DIR):
	@$(TK_RUN) mkdir -p $(PUBLIC_HTML_DIR)

# Configs

CONFIGS = assets.yml

DESIGN_CONFIGS_DIR     = design/configs
PUBLIC_CONFIGS_DIR     = src/assets/configs
PUBLIC_CONFIGS_TARGETS := $(addprefix $(PUBLIC_CONFIGS_DIR)/,$(CONFIGS:.yml=.json))

configs: $(PUBLIC_CONFIGS_TARGETS) ## Publish configs

clean-configs: ## Remove all published configs
	@$(TK_RUN) rm -rf $(PUBLIC_CONFIGS_DIR)

$(PUBLIC_CONFIGS_DIR)/%.json: $(DESIGN_CONFIGS_DIR)/%.yml
	@$(NODE) ./scripts/yaml-to-json.mjs $< $@

$(PUBLIC_CONFIGS_TARGETS): | $(PUBLIC_CONFIGS_DIR)

$(PUBLIC_CONFIGS_DIR):
	@$(TK_RUN) mkdir -p $(PUBLIC_CONFIGS_DIR)
