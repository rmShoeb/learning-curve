import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownService } from '@core/services/markdown.service';
import { NavigationService } from '@core/services/navigation.service';
import { LoggerService } from '@core/services/logger.service';
import { TocComponent } from '@shared/components/toc/toc.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-doc-viewer',
    standalone: true,
    imports: [CommonModule, RouterLink, TocComponent],
    templateUrl: './doc-viewer.component.html',
    styleUrl: './doc-viewer.component.css'
})
export class DocViewerComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly markdownService = inject(MarkdownService);
    private readonly navigationService = inject(NavigationService);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly destroyRef = inject(DestroyRef);
    private readonly logger = inject(LoggerService);

    // Signals for reactive state
    protected readonly content = signal<SafeHtml>('');
    protected readonly loading = signal<boolean>(true);
    protected readonly error = signal<string>('');

    ngOnInit(): void {
        // Load document on initial navigation
        this.loadCurrentDocument();

        // Subscribe to route changes to reload document
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.loadCurrentDocument();
            });
    }

    private loadCurrentDocument(): void {
        // Get the path from route segments
        // UrlSegment.path is already decoded by Angular Router
        // For example: URL "/C%23" -> segment.path = "C#"
        const path = this.route.snapshot.url
            .map(segment => segment.path)
            .join('/');

        this.logger.debug('Loading document', {
            path,
            segments: this.route.snapshot.url.map(s => ({ path: s.path, original: s.toString() }))
        });
        this.loadDocument(path);
    }

    private loadDocument(path: string): void {
        this.loading.set(true);
        this.error.set('');

        // Construct markdown file path
        const mdFilePath = `${path}.md`;

        this.logger.debug('Requesting markdown file', { mdFilePath });

        this.markdownService.loadMarkdown(mdFilePath).subscribe({
            next: (html) => {
                const safeHtml = this.sanitizer.sanitize(1, html) || '';
                this.content.set(this.sanitizer.bypassSecurityTrustHtml(safeHtml));
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set('The requested documentation page could not be found.');
                this.loading.set(false);
                // Clear active navigation state when document not found
                this.navigationService.clearActiveRoute();
                this.logger.error('Error loading markdown', err);
            }
        });
    }

    /**
     * Intercept clicks on links in markdown content
     * If link is internal, use Angular Router for SPA navigation
     * If link is external, allow default browser behavior
     */
    onMarkdownClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        // Check if clicked element is a link or inside a link
        const link = target.closest('a') as HTMLAnchorElement;

        if (!link) {
            return; // Not a link, ignore
        }

        const href = link.getAttribute('href');

        if (!href) {
            return; // No href, ignore
        }

        // Check if it's an external link
        const isExternal = href.startsWith('http://') ||
            href.startsWith('https://') ||
            href.startsWith('//') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:');

        if (isExternal) {
            return; // External link, let browser handle it
        }

        // Check if it's an anchor link (same page)
        if (href.startsWith('#')) {
            return; // Anchor link, let browser handle it
        }

        // Internal link - use Angular Router for SPA navigation
        event.preventDefault();
        this.router.navigate([href]);
    }
}
