import { Injectable, inject } from '@angular/core';
import { NavigationService } from './navigation.service';
import { NavigationItem } from '@core/models/doc-metadata.model';
import { LoggerService } from './logger.service';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface SearchResult {
  label: string;
  route: string;
  icon?: string;
  breadcrumb: string[]; // Path to the document (e.g., ["Getting Started", "Setup"])
  contentMatches?: ContentMatch[]; // Matching content snippets
  matchType: 'title' | 'content' | 'both'; // Where the match was found
}

export interface ContentMatch {
  snippet: string; // Text snippet containing the match
  highlightedSnippet: string; // Snippet with <mark> tags around matches
  lineNumber?: number; // Optional line number
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly navigationService = inject(NavigationService);
  private readonly logger = inject(LoggerService);
  private readonly http = inject(HttpClient);

  /**
   * Search through document titles and content
   * @param query Search query string
   * @returns Observable of matching documents
   */
  search(query: string): Observable<SearchResult[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    const normalizedQuery = query.toLowerCase().trim();
    const titleResults: SearchResult[] = [];
    const navigation = this.navigationService.navigation();

    // First, search through navigation items (titles)
    this.searchItems(navigation, normalizedQuery, [], titleResults);

    // Then, load content and search through it
    const contentSearches = titleResults.map(result => {
      if (result.route) {
        const mdFilePath = `assets/docs${result.route}.md`;
        return this.http.get(mdFilePath, { responseType: 'text' }).pipe(
          map(content => {
            const contentMatches = this.searchInContent(content, query);
            const titleMatch = result.label.toLowerCase().includes(normalizedQuery);

            return {
              ...result,
              contentMatches: contentMatches.length > 0 ? contentMatches : undefined,
              matchType: (titleMatch && contentMatches.length > 0) ? 'both' :
                        (titleMatch ? 'title' : 'content')
            } as SearchResult;
          }),
          catchError(() => of({
            ...result,
            matchType: 'title' as const
          }))
        );
      }
      return of({
        ...result,
        matchType: 'title' as const
      });
    });

    // Also search through all documents not yet in title results
    const allDocSearches = this.getAllDocuments(navigation)
      .filter(doc => !titleResults.find(r => r.route === doc.route))
      .map(doc => {
        const mdFilePath = `assets/docs${doc.route}.md`;
        return this.http.get(mdFilePath, { responseType: 'text' }).pipe(
          map(content => {
            const contentMatches = this.searchInContent(content, query);
            if (contentMatches.length > 0) {
              return {
                label: doc.label,
                route: doc.route,
                icon: doc.icon,
                breadcrumb: doc.breadcrumb,
                contentMatches,
                matchType: 'content' as const
              } as SearchResult;
            }
            return null;
          }),
          catchError(() => of(null))
        );
      });

    // Combine all searches
    return forkJoin([...contentSearches, ...allDocSearches]).pipe(
      map(results => {
        const filtered = results.filter(r => r !== null) as SearchResult[];

        // Sort by relevance: both > title > content
        const sorted = filtered.sort((a, b) => {
          const order = { both: 0, title: 1, content: 2 };
          return order[a.matchType] - order[b.matchType];
        });

        this.logger.debug('Search results', `Query: "${query}", Found: ${sorted.length}`);
        return sorted;
      })
    );
  }

  /**
   * Recursively search through navigation items and their children
   */
  private searchItems(
    items: NavigationItem[],
    query: string,
    breadcrumb: string[],
    results: SearchResult[]
  ): void {
    for (const item of items) {
      const currentBreadcrumb = [...breadcrumb, item.label];

      // Check if this item matches (and has a route)
      if (item.route && item.label.toLowerCase().includes(query)) {
        results.push({
          label: item.label,
          route: item.route,
          icon: item.icon,
          breadcrumb: currentBreadcrumb,
          matchType: 'title'
        });
      }

      // Search in children
      if (item.children && item.children.length > 0) {
        this.searchItems(item.children, query, currentBreadcrumb, results);
      }
    }
  }

  /**
   * Get all documents from navigation tree
   */
  private getAllDocuments(items: NavigationItem[]): Array<{label: string, route: string, icon?: string, breadcrumb: string[]}> {
    const docs: Array<{label: string, route: string, icon?: string, breadcrumb: string[]}> = [];

    const traverse = (items: NavigationItem[], breadcrumb: string[]) => {
      for (const item of items) {
        const currentBreadcrumb = [...breadcrumb, item.label];

        if (item.route) {
          docs.push({
            label: item.label,
            route: item.route,
            icon: item.icon,
            breadcrumb: currentBreadcrumb
          });
        }

        if (item.children && item.children.length > 0) {
          traverse(item.children, currentBreadcrumb);
        }
      }
    };

    traverse(items, []);
    return docs;
  }

  /**
   * Search within markdown content and extract snippets
   */
  private searchInContent(content: string, query: string): ContentMatch[] {
    const normalizedQuery = query.toLowerCase().trim();
    const lines = content.split('\n');
    const matches: ContentMatch[] = [];
    const contextLines = 1; // Lines before/after match
    const maxMatches = 3; // Maximum snippets per document

    for (let i = 0; i < lines.length && matches.length < maxMatches; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();

      if (lowerLine.includes(normalizedQuery)) {
        // Get context (lines before and after)
        const startIdx = Math.max(0, i - contextLines);
        const endIdx = Math.min(lines.length - 1, i + contextLines);
        const snippetLines = lines.slice(startIdx, endIdx + 1);

        // Remove markdown headers and clean up
        const snippet = snippetLines
          .map(l => l.replace(/^#+\s*/, '').trim())
          .filter(l => l.length > 0)
          .join(' ')
          .substring(0, 200); // Limit snippet length

        // Highlight the matching term (case-insensitive)
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        const highlightedSnippet = snippet.replace(regex, '<mark>$1</mark>');

        matches.push({
          snippet,
          highlightedSnippet,
          lineNumber: i + 1
        });
      }
    }

    return matches;
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Get breadcrumb path for display (e.g., "Getting Started > Setup")
   */
  getBreadcrumbText(breadcrumb: string[]): string {
    return breadcrumb.join(' > ');
  }
}
