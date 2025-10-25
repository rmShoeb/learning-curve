# 02 - Basics of Application

## Environment Setup
1. Download Node.js ([check version compatibility](https://angular.dev/reference/versions))

```bash
# verify installation
node -v
npm -v
```
2. Install Angular CLI

```bash
npm install -g @angular/cli
ng version #check version
```
3. Create new Angular application

```bash
ng new angular-app
```
4. Serve the application.

```bash
ng serve
```

## Project Structure

```
angular-app/
│-- src/                # Source code
│   ├── app/            # Main application folder (components, services)
│   ├── assets/         # Static assets like images, JSON files
│   ├── environments/   # Environment-specific settings
│   ├── index.html      # Main HTML file
│   ├── main.ts         # Entry point of the application
│   ├── styles.css      # Global styles
│   ├── polyfills.ts    # Compatibility settings
│   ├── test.ts         # Test configurations
│-- angular.json        # Angular project configuration
│-- package.json        # Dependencies and scripts
│-- tsconfig.json       # TypeScript configuration
│-- README.md           # Project documentation
```

## Angular JSON

### Schematics
- Instructions for modifying a project by adding new files or modifying existing files.
- These can be configured by mapping the schematic name to a set of default options.
- The `"name"` of a schematic is in the format: `<schematic-package>:<schematic-name>`.
- Schematics for the default Angular CLI ng generate sub-commands are collected in the package `@schematics/angular`.

```json
{
    "projects": {
        "my-app": {
            "schematics": {
                "@schematics/angular:component": {
                    "standalone": false
                }
            }
        }
    }
}
```

### Architect
- It is the tool that the Angular CLI uses to perform complex tasks, such as compilation and test running.
- It is a shell that runs a specified builder to perform a given task, according to a target configuration.
- The architect section of `angular.json` contains a set of Architect targets.
- Each target object specifies
	- builder for that target, which is the npm package for the tool that Architect runs.
	- options section that configures default options for the target.
	- configurations section that names and specifies alternative configurations for the target.

```json
{
    "projects": {
        "my-app": {
            "architect": {
                "build": {
                    "builder": "@angular-devkit/build-angular:application",
                    "options": {
                        "optimization": false,
                        "styles": [
                            "src/styles.css",
                            "node_modules/devextreme/dist/css/dx.light.css"
                        ]
                    },
                    "configurations": {
                        "production": {...},
                        "development": {...}
                    }
                }
            }
        }
    }
}
```

## Resources
1. https://angular.dev/reference/configs/workspace-config
2. https://angular.dev/tools/cli/setup-local