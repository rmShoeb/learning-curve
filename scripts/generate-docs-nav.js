#!/usr/bin/env node

/**
 * Generate Navigation JSON from Markdown Files
 *
 * This script scans the src/assets/docs directory and generates
 * a navigation structure based on the folder structure and markdown files.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DOCS_DIR = path.join(__dirname, '../src/assets/docs');
const OUTPUT_FILE = path.join(__dirname, '../src/assets/docs-navigation.json');

/**
 * Convert kebab-case or snake_case to Title Case
 * e.g., "getting-started" -> "Getting Started"
 */
function toTitleCase(str) {
    return str
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Extract title from markdown file
 * Reads the first # heading from the file
 */
function extractTitle(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const match = content.match(/^#\s+(.+)$/m);
        if (match) {
            return match[1].trim();
        }
    } catch (error) {
        console.warn(`[WARNING] Could not read file ${filePath}`);
    }
    return null;
}

/**
 * Get the display label for a file/folder
 * Priority: 1) Title from markdown, 2) Formatted filename
 */
function getLabel(fullPath, isFile) {
    if (isFile && path.extname(fullPath) === '.md') {
        const title = extractTitle(fullPath);
        if (title) return title;
    }

    const basename = path.basename(fullPath, '.md');
    return toTitleCase(basename);
}

/**
 * Generate route path from file path
 * e.g., "getting-started/setup.md" -> "/getting-started/setup"
 * Special characters are kept as-is - Angular Router will handle encoding
 */
function generateRoute(relativePath) {
    // Remove .md extension and normalize path separators
    const pathWithoutExt = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');

    // Return the path as-is - Angular RouterLink will handle URL encoding
    return '/' + pathWithoutExt;
}

/**
 * Check if path should be excluded
 */
function shouldExclude(name) {
    const excludes = ['.', '_', 'node_modules', '.git'];
    return excludes.some(ex => name.startsWith(ex));
}

/**
 * Check if filename contains problematic characters for URLs
 * Returns true if file has issues, along with a warning message
 */
function hasProblematicCharacters(filename) {
    const problematicChars = ['#', '%'];
    const foundChars = problematicChars.filter(char => filename.includes(char));

    if (foundChars.length > 0) {
        return {
            hasIssue: true,
            chars: foundChars,
            message: `Contains URL-problematic characters: ${foundChars.join(', ')}`
        };
    }

    return { hasIssue: false };
}

/**
 * Recursively scan directory and build navigation structure
 */
function scanDirectory(dir, baseDir = DOCS_DIR, depth = 0) {
    const items = [];
    const indent = '  '.repeat(depth);

    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        // Separate files and directories
        const files = entries.filter(e => e.isFile() && e.name.endsWith('.md'));
        const directories = entries.filter(e => e.isDirectory() && !shouldExclude(e.name));

        if (depth < 5) { // Only log first 5 levels to avoid spam
            console.log(`[INFO]${indent} Scanning: ${path.relative(baseDir, dir) || '/'} (${files.length} files, ${directories.length} folders)`);
        }

        // Process files first
        for (const file of files) {
            const fullPath = path.join(dir, file.name);
            const relativePath = path.relative(baseDir, fullPath);
            const label = getLabel(fullPath, true);
            const route = generateRoute(relativePath);

            // Check for problematic characters
            const fileCheck = hasProblematicCharacters(file.name);
            if (fileCheck.hasIssue) {
                console.warn(`[WARNING]${indent} ${file.name} - ${fileCheck.message}`);
                console.warn(`${indent} This file may not load properly in the browser.`);
                console.warn(`${indent} Consider renaming to avoid: ${fileCheck.chars.join(', ')}`);
            } else if (depth < 5) {
                console.log(`[INFO]${indent} ${file.name} -> ${route}`);
            }

            items.push({
                label,
                route
            });
        }

        // Process directories RECURSIVELY
        for (const directory of directories) {
            const fullPath = path.join(dir, directory.name);

            // IMPORTANT: Recursively scan subdirectory with increased depth
            const children = scanDirectory(fullPath, baseDir, depth + 1);

            if (children.length > 0) {
                const folderName = path.basename(fullPath);
                const item = {
                    label: toTitleCase(folderName),
                    children,
                    expanded: false
                };

                if (depth < 5) {
                    console.log(`[INFO]${indent} ${folderName}/ (${children.length} children)`);
                }

                items.push(item);
            }
        }

        // Sort items: directories first, then files, both alphabetically
        items.sort((a, b) => {
            const aIsFolder = !!a.children;
            const bIsFolder = !!b.children;

            if (aIsFolder && !bIsFolder) return -1;
            if (!aIsFolder && bIsFolder) return 1;

            if(a.route === undefined || a.route === null) {
                return a.label.localeCompare(b.label);
            }

            return a.route.localeCompare(b.route);
        });

    } catch (error) {
        console.error(`[ERROR] Error scanning directory ${dir}:`, error.message);
    }

    return items;
}

/**
 * Generate the complete navigation structure
 */
function generateNavigation() {
    console.log('[INFO] Scanning documentation files...');
    console.log(`       Source: ${DOCS_DIR}`);

    if (!fs.existsSync(DOCS_DIR)) {
        console.error(`[ERROR] Documentation directory not found: ${DOCS_DIR}`);
        process.exit(1);
    }

    // Always include Home as the first item
    const navigation = [
        {
            label: 'Home',
            route: '/',
        }
    ];

    // Scan and add documentation structure
    const docItems = scanDirectory(DOCS_DIR);
    navigation.push(...docItems);

    console.log(`[INFO] Found ${docItems.length} documentation categories/files`);

    return navigation;
}

/**
 * Check all files for problematic characters and return warnings
 */
function checkAllFiles(dir, issues = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isFile() && entry.name.endsWith('.md')) {
            const check = hasProblematicCharacters(entry.name);
            if (check.hasIssue) {
                issues.push({
                    file: path.relative(DOCS_DIR, fullPath),
                    chars: check.chars
                });
            }
        } else if (entry.isDirectory() && !shouldExclude(entry.name)) {
            checkAllFiles(fullPath, issues);
        }
    }

    return issues;
}

/**
 * Write navigation to JSON file
 */
function writeNavigationFile(navigation) {
    const outputDir = path.dirname(OUTPUT_FILE);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const json = JSON.stringify(navigation, null, 2);
    fs.writeFileSync(OUTPUT_FILE, json, 'utf-8');

    console.log(`[INFO] Navigation file generated: ${OUTPUT_FILE}`);
    console.log(`[INFO] Total items: ${navigation.length}`);
}

/**
 * Main execution
 */
function main() {
    console.log('[INFO] Generating documentation navigation...\n');

    try {
        const navigation = generateNavigation();
        writeNavigationFile(navigation);

        // Check for problematic filenames
        const issues = checkAllFiles(DOCS_DIR);
        if (issues.length > 0) {
            console.log('[WARNING] Found files with problematic characters:');
            issues.forEach(issue => {
                console.log(`   - ${issue.file} (contains: ${issue.chars.join(', ')})`);
            });
            console.log('   These files may not load properly in the browser.');
            console.log('   Recommendation: Rename files to avoid # and % characters.\n');
        }

        console.log('[INFO] Navigation generation complete!\n');
        process.exit(0);
    } catch (error) {
        console.error('[ERROR] Error generating navigation:', error);
        process.exit(1);
    }
}

// Run the script
main();
