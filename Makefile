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
.PHONY        : help start node_modules docker-build ase tiled tilex clean-assets clean-fonts clean-html clean-configs clean-images clean-animations clean-music app-icons build

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

assets: fonts html configs images animations music app-icons ## Publish all assets

clean-assets: clean-fonts clean-html clean-configs clean-images clean-animations clean-music ## Remove all published assets

# Fonts

FONTS = Michroma-Regular.ttf

ART_FONT_DIR         = art/fonts
PUBLIC_FONT_DIR      = src/assets/fonts
PUBLIC_FONT_TARGETS := $(addprefix $(PUBLIC_FONT_DIR)/,$(FONTS))

fonts: $(PUBLIC_FONT_TARGETS) ## Publish fonts

clean-fonts: ## Remove all published fonts
	@$(TK_RUN) rm -rf $(PUBLIC_FONT_DIR)

$(PUBLIC_FONT_DIR)/%.ttf: $(ART_FONT_DIR)/%.ttf
	@$(TK_RUN) cp $< $@

$(PUBLIC_FONT_TARGETS): | $(PUBLIC_FONT_DIR)

$(PUBLIC_FONT_DIR):
	@$(TK_RUN) mkdir -p $(PUBLIC_FONT_DIR)

# HTML

HTML = title-scene.html demo-narrative-a-scene.html demo-narrative-b-scene.html credits-scene.html

DESIGN_HTML_DIR      = design/html
PUBLIC_HTML_DIR      = src/assets/html
PUBLIC_HTML_TARGETS := $(addprefix $(PUBLIC_HTML_DIR)/,$(HTML))

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

DESIGN_CONFIGS_DIR      = design/configs
PUBLIC_CONFIGS_DIR      = src/assets/configs
PUBLIC_CONFIGS_TARGETS := $(addprefix $(PUBLIC_CONFIGS_DIR)/,$(CONFIGS:.yml=.json))

configs: $(PUBLIC_CONFIGS_TARGETS) ## Publish configs

clean-configs: ## Remove all published configs
	@$(TK_RUN) rm -rf $(PUBLIC_CONFIGS_DIR)

$(PUBLIC_CONFIGS_DIR)/%.json: $(DESIGN_CONFIGS_DIR)/%.yml
	@$(NODE) ./scripts/yaml-to-json.mjs $< $@

$(PUBLIC_CONFIGS_TARGETS): | $(PUBLIC_CONFIGS_DIR)

$(PUBLIC_CONFIGS_DIR):
	@$(TK_RUN) mkdir -p $(PUBLIC_CONFIGS_DIR)

# Images

IMAGES = no-ai_square_large_human-made.aseprite

ART_IMAGES_DIR         = art/images
PUBLIC_IMAGES_DIR      = src/assets/images
PUBLIC_IMAGES_TARGETS := $(addprefix $(PUBLIC_IMAGES_DIR)/,$(IMAGES:.aseprite=.png))

images: $(PUBLIC_IMAGES_TARGETS) ## Publish images

clean-images: ## Remove all published images
	@$(TK_RUN) rm -rf $(PUBLIC_IMAGES_DIR)

$(PUBLIC_IMAGES_DIR)/%.png: $(ART_IMAGES_DIR)/%.aseprite
	@$(ASE) --batch $< --save-as $@

$(PUBLIC_IMAGES_TARGETS): | $(PUBLIC_IMAGES_DIR)

$(PUBLIC_IMAGES_DIR):
	@$(TK_RUN) mkdir -p $(PUBLIC_IMAGES_DIR)

# Animations

ANIMATIONS = stellar-neighborhood.aseprite xonin.aseprite

ART_ANIMATIONS_DIR         = art/animations
PUBLIC_ANIMATIONS_DIR      = src/assets/animations
PUBLIC_ANIMATIONS_TARGETS := $(addprefix $(PUBLIC_ANIMATIONS_DIR)/,$(ANIMATIONS:.aseprite=.png) $(ANIMATIONS:.aseprite=.json))

animations: $(PUBLIC_ANIMATIONS_TARGETS) ## Publish animations

clean-animations: ## Remove all published animations
	@$(TK_RUN) rm -rf $(PUBLIC_ANIMATIONS_DIR)

$(PUBLIC_ANIMATIONS_DIR)/%.png: $(ART_ANIMATIONS_DIR)/%.aseprite
	@$(ASE) --batch --ignore-layer Guide $< --sheet $@ --data $(@:.png=.json) \
	--sheet-type packed --ignore-empty --merge-duplicates --border-padding 1 --shape-padding 1 --inner-padding 1 \
	--trim --trim-sprite --filename-format {frame} --tagname-format '{title} {tag}' --list-tags

$(PUBLIC_ANIMATIONS_TARGETS): | $(PUBLIC_ANIMATIONS_DIR)

$(PUBLIC_ANIMATIONS_DIR):
	@$(TK_RUN) mkdir -p $(PUBLIC_ANIMATIONS_DIR)

# Music

MUSIC = title-scene-fanfare.mp3 state-azure-stellar-descent-01-stellar-drift.mp3

AUDIO_MUSIC_DIR       = audio/music
PUBLIC_MUSIC_DIR      = src/assets/music
PUBLIC_MUSIC_TARGETS := $(addprefix $(PUBLIC_MUSIC_DIR)/,$(MUSIC))

music: $(PUBLIC_MUSIC_TARGETS) ## Publish music

clean-music: ## Remove all published music
	@$(TK_RUN) rm -rf $(PUBLIC_MUSIC_DIR)

$(PUBLIC_MUSIC_DIR)/%.mp3: $(AUDIO_MUSIC_DIR)/%.mp3
	@$(TK_RUN) cp $< $@

$(PUBLIC_MUSIC_TARGETS): | $(PUBLIC_MUSIC_DIR)

$(PUBLIC_MUSIC_DIR):
	@$(TK_RUN) mkdir -p $(PUBLIC_MUSIC_DIR)

# App Icons

app-icons: art/images/app-icon.aseprite ## Rebuild app icons
	@$(ASE) --batch $< --save-as app-icon.png
	@$(NPM) run tauri icon
	@$(TK_RUN) rm app-icon.png
	@$(TK_RUN) rm -rf src-tauri/icons/android src-tauri/icons/ios

## —— Builds 🔨 ————————————————————————————————————————————————————————————————

build: node_modules assets ## Build an executable
	@$(NPM) run tauri build
