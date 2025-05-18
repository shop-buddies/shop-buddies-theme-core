# Shop Buddies Core - Modern Shopify Theme Development Build

A comprehensive Shopify theme development build with modern tooling and best practices, featuring TypeScript, React, and Tailwind CSS integration.

## 🎯 Quick Start

```bash
# Clone and setup
git clone https://github.com/shop-buddies/shop-buddies-theme-core
cd shop-buddies-theme-core
yarn install

# Start development
yarn build      # Build the project
yarn dev        # Start development server with hot reloading
yarn cli        # Start Shopify CLI development server
```

## 🚀 Key Features

- **Modern JavaScript/TypeScript**: Full TypeScript support with modern JavaScript features and strict type checking
- **React Integration**: Built-in React support for component-based development with TypeScript
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Advanced Build System**: Gulp-based workflow with hot reloading, optimization, and asset processing
- **Development Tools**: ESLint, Prettier, and Shopify Theme Check integration for code quality
- **Component Architecture**: Modular section and snippet system with scoped styles
- **Asset Optimization**: Automatic minification, bundling, and optimization of all assets

## 📦 Prerequisites

- **Node.js** (v16.x or higher)
- **Yarn** package manager (v1.22.x or higher)
- **Shopify CLI** (v3.x or higher)
- **Git** (v2.x or higher)


## 🚀 Development Workflow

### Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server with hot reloading |
| `yarn build` | Build for production with optimization |
| `yarn build:devops` | Build devops tools and utilities |
| `yarn tw` | Build Tailwind CSS  |
| `yarn prettify` | Format code with Prettier |
| `yarn theme-check` | Run Shopify theme check for validation |
| `yarn lint` | Run ESLint for code quality |
| `yarn lint:fix` | Fix ESLint issues automatically |
| `yarn cli` | Start Shopify CLI development server |
| `yarn cli:sync` | Start CLI with theme editor sync enabled |
| `yarn create:section` | Create new section with boilerplate |
| `yarn create:snippet` | Create new snippet with boilerplate |

### Development Process

1. **Setup**:
   ```bash
   yarn install
   yarn build
   ```

2. **Start Development Servers**:
   - Terminal 1: `yarn dev` (hot reloading for assets)
   - Terminal 2: `yarn cli` (Shopify CLI for theme development)

3. **Development Workflow**:
   - Edit files in `src/` directory
   - Changes auto-compile with hot reloading
   - Run `yarn lint` and `yarn theme-check` regularly
   - Test in Shopify theme editor
   - Use `yarn prettify` before committing

4. **Production Build**:
   ```bash
   yarn build
   ```

## 🛠️ Build System

### 1. Core Build System

#### Global Assets

- **Global Styles**
  - Source: `src/core/scss/main.scss`
  - Output: `assets/sbc-global-styles.min.css`
  - Purpose: Core theme styles and variables

- **Global Scripts**
  - Source: `src/core/index.ts`
  - Output: `assets/sbc-global-script.min.js`
  - Purpose: Core JavaScript functionality and utilities

- **Theme Customizer**
  - Source: `src/core/theme-customizer/index.ts`
  - Output: `assets/sbc-theme-customizer.min.js`
  - Purpose: Theme customization and settings management

> **Note**: These compiled files should be included in your main layout file (`layout/theme.liquid`). 
> 
> The scripts should be added using the `sbc-layout-scripts` snippet:
> ```liquid
> {% render 'sbc-layout-scripts' %}
> ```
>  The global styles should be added using the `link:stylesheet` tag:
> ```liquid
>  <link rel="stylesheet" href="{{ 'sbc-global-styles.min.css' | asset_url }}">
> ```
> This ensures proper loading order and initialization of all core functionality.

### 2. Asset Processing

#### JavaScript Processing
- **Location**: `src/scripts/vanilla-js-minification/`
- **Features**:
  - Terser minification
  - Automatic `.min.js` suffix
  - Output to `assets/`
  - Watch mode with hot reloading
  - ES6+ transpilation

#### CSS Processing
- **Location**: `src/styles/plain-css-minification/`
- **Features**:
  - CSS minification
  - Output to `assets/`
  - Watch mode support

### 3. Component Processing

#### Section Processing
- **Location**: `src/sections/**/*.{ts,tsx,liquid,scss}`
- **File Structure**:
  ```
  section/
  ├── section.liquid      # Main template
  ├── style.module.scss   # Scoped styles
  └── index.ts/tsx        # Component logic (optional)
  ```
- **Processing Pipeline**:
  1. Scripts:
     - TypeScript/React compilation via esbuild
     - Output as `sbc-[name].min.js` in `assets/`
     - Automatic script injection with section metadata
  2. Styles:
     - SCSS module compilation with PostCSS
     - Section ID scoping via `#shopify-section-{{ section.id }}`
     - CSS optimization with autoprefixer and cssnano
     - Output as inline styles in the section
  3. Templates:
     - Liquid template processing with custom transformers
     - Automatic class injection from style modules
     - Handles dynamic class merging from style modules

#### Snippet Processing
- **Location**: `src/snippets/**/*.{liquid,scss}`
- **File Structure**:
  ```
  snippet/
  ├── snippet.liquid      # Main template
  └── style.module.scss   # Scoped styles (optional)
  ```
- **Processing Pipeline**:
  1. Styles (if present):
     - SCSS module compilation with PostCSS
     - Custom prefix transformation
     - Output as `sbc-[name]-stylesheet.liquid` in `snippets/`
  2. Templates:
     - Liquid processing
     - Dynamic class injection from style modules

> **SCSS Compilation in modular section and snippets**
> - Bypass patterns for special classes (these classes won't be transformed to modular format):
>   - `.js-` - JavaScript hooks and selectors
>   - `.u-` - Utility classes
>   - `.is-` - State classes
>   - `.has-` - State classes
>   - `.sbc-` - Custom Shopify Builder Component classes
> 
> **Note**: The bypass patterns can be extended in the `devops/gulp/utils/scss-selectors-transformer.ts` file to accommodate additional naming conventions as needed.

### 4. Special Processing

#### Tailwind CSS
- Integrated into the main Gulp build pipeline
- Build command: `yarn tw` (uses Gulp task `tBuild`)
- Processing paths:
  - Content scanning: 
    - `templates/*.liquid`
    - `layout/*.liquid`
    - `sections/*.liquid`
    - `snippets/*.liquid`
    - `src/**/*.{liquid,js,ts,jsx,tsx}`
  - Configuration: `tailwind.config.js`
- Output:
  - Generated CSS: `assets/sbc-tailwind.min.css`
  - Purged and optimized for production
  - Includes only used utility classes
  - Minified for optimal performance
- Customization:
  - Core component styles: `src/styles/tailwind/tailwind-core.css`
  - tailwind.config.js: `src/styles/tailwind/tailwind.config.js`

> The tailwind styles should be added using the `link:stylesheet` tag:
> ```liquid
> <link rel="stylesheet" href="{{ 'sbc-tailwind.min.css' | asset_url }}">
> ```

## 🔧 Configuration

### Key Configuration Files

| File | Purpose |
|------|---------|
| `.eslintrc.js` | ESLint configuration and rules |
| `.prettierrc` | Prettier code formatting rules |
| `tailwind.config.js` | Tailwind CSS settings and customization |
| `.theme-check.yml` | Theme check settings and validation rules |
| `shopify.theme.toml` | Shopify CLI configuration and settings |
| `tsconfig.json` | TypeScript configuration and compiler options |
| `gulpfile.js` | Build system configuration and tasks |



## 📝 License

This project is licensed under the MIT License.


