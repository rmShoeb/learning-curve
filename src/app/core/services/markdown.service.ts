import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import Prism from 'prismjs';

// Import Prism languages as needed
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private readonly http = inject(HttpClient);

  constructor() {
    this.configureMarked();
  }

  private configureMarked(): void {
    marked.use(
      markedHighlight({
        highlight: (code: string, lang: string) => {
          if (lang && Prism.languages[lang]) {
            return Prism.highlight(code, Prism.languages[lang], lang);
          }
          return code;
        }
      })
    );

    // Configure marked options
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: false,
      pedantic: false,
    });
  }

  /**
   * Load and parse markdown file
   * The filePath may contain special characters like #, %, & that need proper URL encoding
   */
  loadMarkdown(filePath: string): Observable<string> {
    // Encode each path segment to handle special characters
    // This is necessary because HttpClient treats # as fragment identifier
    const pathSegments = filePath.split('/');
    const encodedSegments = pathSegments.map(segment => {
      // Replace special characters that cause issues in URLs
      return segment.replace(/#/g, '%23')
                   .replace(/&/g, '%26')
                   .replace(/ /g, '%20');
    });
    const encodedPath = encodedSegments.join('/');

    return this.http.get(`assets/docs/${encodedPath}`, { responseType: 'text' })
      .pipe(
        map(markdown => this.parseMarkdown(markdown))
      );
  }

  /**
   * Parse markdown string to HTML
   */
  parseMarkdown(markdown: string): string {
    return marked.parse(markdown) as string;
  }

  /**
   * Extract front matter from markdown
   */
  extractFrontMatter(markdown: string): { metadata: Record<string, any>, content: string } {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdown.match(frontMatterRegex);

    if (!match) {
      return { metadata: {}, content: markdown };
    }

    const [, frontMatter, content] = match;
    const metadata: Record<string, any> = {};

    frontMatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        metadata[key.trim()] = value;
      }
    });

    return { metadata, content };
  }
}
