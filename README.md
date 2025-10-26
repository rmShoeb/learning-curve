# Learning Curve

> This repository contains various learning materials, code examples, and projects across different programming languages and technologies.

## Purpose

This repository serves as a learning resource and reference for various programming concepts, frameworks, and technologies. Each directory contains practical examples and implementations to help understand different aspects of software development.

## Features

- **Markdown-based** - Write documentation in plain Markdown
- **Angular 19** - Built with the latest Angular features (signals, standalone components, new control flow)
- **Full-text search** - Search through document titles AND content with highlighted results
- **Mobile-friendly** - Fully responsive on all devices
- **Syntax highlighting** - Beautiful code blocks with Prism.js
- **GitHub Pages Ready** - One-click deployment with GitHub Actions

## Technology Stack

- **Angular 19** - Framework with standalone components
- **Marked** - Markdown parsing
- **Prism.js** - Syntax highlighting

## Prerequisites

- **Node.js** 18.19.0 or higher
- **npm** 10.0.0 or higher

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200`

### 3. Build for Production

```bash
npm run build:prod
```

The build artifacts will be in the `dist/learning-curve` directory.

## Project Structure

```
Learning-Curve/
├── src/
│   ├── app/
│   │   ├── core/                # Core services, models, guards
│   │   │   ├── models/          # TypeScript interfaces and types
│   │   │   └── services/        # Singleton services
│   │   ├── shared/              # Shared components
│   │   │   └── components/      # Reusable UI components
│   │   ├── features/            # Feature modules
│   │   │   └── docs/            # Documentation viewer feature
│   │   ├── app.component.ts     # Root component
│   │   ├── app.config.ts        # App configuration
│   │   └── app.routes.ts        # Route definitions
│   ├── assets/
│   │   ├── docs/                # Markdown files go here!
│   │   │   ├── getting-started/
│   │   │   ├── architecture/
│   │   │   ├── development/
│   │   │   └── ...
│   │   └── images/              # Images referenced in docs
│   ├── styles.scss              # Global styles
│   └── index.html               # HTML entry point
├── angular.json                 # Angular configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## Adding Documentation

### 1. Create a Markdown File

Add your `.md` file to `src/assets/docs/`:

```markdown
# My New Documentation

This is the content of my documentation.

## Code Example

\`\`\`typescript
const greeting = 'Hello World!';
console.log(greeting);
\`\`\`
```

**Folder Structure Example:**
```
src/assets/docs/
├── getting-started.md           # Top-level doc
├── getting-started/
│   ├── installation.md          # Nested doc
│   └── setup.md
└── api/
    └── overview.md
```

### ⚠️ Important: File Naming Restrictions

**Avoid these characters in filenames:**
- `#` (hash/pound) - Use alternatives like "CSharp" instead of "C#"
- `%` (percent) - Use "Percent" spelled out instead

**Why?** These characters have special meaning in URLs and cause loading issues with the development server. The navigation generator will warn you if it detects these characters in your filenames.

**Allowed special characters:**
- Spaces (will be encoded as `%20`)
- `&` (ampersand - will be encoded as `%26`)
- `-` (hyphens)
- `_` (underscores)

### 2. Navigation Auto-Generates!

No need to manually update navigation! The system automatically:
- ✅ Scans `docs/` folder structure
- ✅ Extracts titles from the first `# Heading` in each file
- ✅ Creates hierarchical navigation based on folder structure
- ✅ Generates icons based on folder names

Simply run:
```bash
npm run generate:nav
```

Or it runs automatically when you use `npm start` or `npm run build:prod`.

### 3. Test Locally

```bash
npm start
```

Navigate to your new page - it will appear in the sidebar automatically!

### 4. Commit Changes

```bash
git add src/assets/docs/
git commit -m "docs: Add my new documentation"
git push
```

If using GitHub Pages, deployment happens automatically!

## 🎨 Angular 19 Modern Features Used

This project uses the latest Angular 19 features for optimal performance and developer experience:

### ✅ Standalone Components
All components are standalone - no NgModules required:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  // ...
})
```

### ✅ Signals for State Management
Reactive state with Angular Signals:

```typescript
readonly navigation = signal<NavigationItem[]>([]);
readonly loading = signal<boolean>(false);
```

### ✅ New Control Flow Syntax
Modern template syntax:

```typescript
@if (loading()) {
  <div>Loading...</div>
} @else {
  <div>Content</div>
}

@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}
```

### ✅ inject() Function
Dependency injection without constructors:

```typescript
private readonly http = inject(HttpClient);
private readonly router = inject(Router);
```

### ✅ Application Builder (esbuild)
Fast builds with the new application builder in `angular.json`:

```json
"builder": "@angular-devkit/build-angular:application"
```

### ✅ Modern Router Features
- `withComponentInputBinding()` - Bind route params to inputs
- `withViewTransitions()` - Smooth page transitions
- `withFetch()` - Use Fetch API instead of XHR

## Development Guidelines

### Code Style
- Use **standalone components** everywhere
- Prefer **signals** over BehaviorSubjects for state
- Use **inject()** instead of constructor injection
- Use new **@if/@for** syntax instead of *ngIf/*ngFor
- Follow **strict TypeScript** rules

### File Naming
- Components: `*.component.ts`
- Services: `*.service.ts`
- Models: `*.model.ts`
- Guards: `*.guard.ts`

### Best Practices
1. Keep components small and focused
2. Use services for business logic
3. Use signals for reactive state
4. Implement proper error handling
5. Write meaningful commit messages

## Building for Production

```bash
# Production build with optimizations
npm run build:prod

# Output will be in: dist/learning-curve/browser/
```

## Configuration

### TypeScript Paths
Configured in `tsconfig.json`:

```json
"paths": {
  "@app/*": ["src/app/*"],
  "@core/*": ["src/app/core/*"],
  "@shared/*": ["src/app/shared/*"],
  "@features/*": ["src/app/features/*"]
}
```

Use in imports:
```typescript
import { MarkdownService } from '@core/services/markdown.service';
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server (auto-generates navigation) |
| `npm run build` | Build for production |
| `npm run build:prod` | Build for GitHub Pages with production optimizations |
| `npm run build:gitlab` | Build for GitLab Pages with specific configuration |
| `npm run generate:nav` | Manually generate navigation from docs folder |
| `npm run deploy:github` | Manual deployment to GitHub Pages |
| `npm run watch` | Build and watch for changes |
| `npm test` | Run unit tests |
| `npm run lint` | Lint the codebase |

## License

This is a personal learning project. Feel free to use the code examples for learning purposes.


## 🎉 What's Included

This project comes with:
- ✅ Full-text search through titles and content
- ✅ Auto-generated table of contents for each page
- ✅ Dynamic navigation from folder structure
- ✅ Syntax highlighting for 10+ languages
- ✅ Responsive mobile-friendly design
- ✅ GitHub Actions workflow for auto-deployment
- ✅ Logging service for debugging
- ✅ SPA routing with Angular Router

---

**Built with ❤️ with help from Claude Code!**
