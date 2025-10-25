import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchService, SearchResult } from '@core/services/search.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoggerService } from '@core/services/logger.service';

@Component({
    selector: 'app-search-results',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './search-results.component.html',
    styleUrl: './search-results.component.css'
})
export class SearchResultsComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly logger = inject(LoggerService);

    protected readonly searchQuery = signal<string>('');
    protected readonly results = signal<SearchResult[]>([]);
    protected readonly loading = signal<boolean>(true);

    ngOnInit(): void {
        // Subscribe to query params changes
        this.route.queryParams
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(params => {
                const query = params['q'] || '';
                this.performSearch(query);
            });
    }

    private performSearch(query: string): void {
        this.loading.set(true);
        this.searchQuery.set(query);

        this.searchService.search(query).subscribe({
            next: (results) => {
                this.results.set(results);
                this.loading.set(false);
                this.logger.info('Search performed', `Query: "${query}", Results: ${results.length}`);
            },
            error: (err) => {
                this.logger.error('Search failed', err);
                this.results.set([]);
                this.loading.set(false);
            }
        });
    }

    getBreadcrumb(result: SearchResult): string {
        return this.searchService.getBreadcrumbText(result.breadcrumb);
    }

    getIcon(icon?: string): string {
        const iconMap: Record<string, string> = {
            'home': '🏠',
            'rocket': '🚀',
            'architecture': '🏗️',
            'code': '💻',
            'api': '📡',
            'database': '🗄️',
            'tools': '🔧',
            'security': '🔒',
            'folder': '📁'
        };

        return icon ? iconMap[icon] || '📄' : '📄';
    }
}
