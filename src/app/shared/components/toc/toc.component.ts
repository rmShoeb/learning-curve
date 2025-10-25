import { Component, Input, signal, effect, inject, ElementRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { LoggerService } from '@core/services/logger.service';

export interface TocItem {
    id: string;
    text: string;
    level: number; // 1 for h1, 2 for h2, etc.
}

@Component({
    selector: 'app-toc',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toc.component.html',
    styleUrl: "./toc.component.css"
})
export class TocComponent {
    private readonly destroyRef = inject(DestroyRef);
    private readonly logger = inject(LoggerService);

    protected readonly tocItems = signal<TocItem[]>([]);
    protected readonly activeId = signal<string>('');

    @Input() set content(htmlContent: any) {
        if (htmlContent) {
            this.extractHeadings(htmlContent);
            this.setupScrollListener();
        }
    }

    /**
     * Extract headings from rendered markdown HTML
     */
    private extractHeadings(htmlContent: any): void {
        // Wait for DOM to update
        setTimeout(() => {
            const contentElement = document.querySelector('.markdown-content');
            if (!contentElement) {
                this.logger.warn('TOC: Markdown content element not found');
                return;
            }

            const headings = contentElement.querySelectorAll('h1, h2, h3, h4');
            const items: TocItem[] = [];

            headings.forEach((heading, index) => {
                const level = parseInt(heading.tagName.substring(1)); // h1 -> 1, h2 -> 2, etc.
                const text = heading.textContent || '';

                // Generate ID if not exists
                let id = heading.id;
                if (!id) {
                    id = this.generateId(text, index);
                    heading.id = id; // Set the ID on the actual DOM element
                }

                items.push({ id, text, level });
            });

            this.tocItems.set(items);
            this.logger.debug('TOC: Items extracted', items);
        }, 100);
    }

    /**
     * Generate a URL-friendly ID from heading text
     */
    private generateId(text: string, index: number): string {
        const base = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')      // Replace spaces with hyphens
            .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens

        return base || `heading-${index}`;
    }

    /**
     * Set up scroll listener to highlight active heading
     */
    private setupScrollListener(): void {
        // Wait a bit for DOM to update
        setTimeout(() => {
            // Try to find the scrolling container - either doc-viewer or docs-content
            const contentArea = document.querySelector('.doc-viewer') || document.querySelector('.docs-content');
            if (!contentArea) return;

            fromEvent(contentArea, 'scroll')
                .pipe(
                    throttleTime(100),
                    takeUntilDestroyed(this.destroyRef)
                )
                .subscribe(() => {
                    this.updateActiveHeading();
                });

            // Initial check
            this.updateActiveHeading();
        }, 100);
    }

    /**
     * Update active heading based on scroll position
     */
    private updateActiveHeading(): void {
        const headings = this.tocItems();
        if (headings.length === 0) return;

        const contentArea = document.querySelector('.doc-viewer') || document.querySelector('.docs-content');
        if (!contentArea) return;

        const contentRect = contentArea.getBoundingClientRect();
        const threshold = 100; // Distance from top of viewport to consider "active"

        // Find all heading positions
        const headingPositions: { id: string; top: number }[] = [];

        for (const item of headings) {
            const heading = document.getElementById(item.id);
            if (heading) {
                const rect = heading.getBoundingClientRect();
                const relativeTop = rect.top - contentRect.top;
                headingPositions.push({ id: item.id, top: relativeTop });
            }
        }

        // Find the heading that is currently at the top (or closest to top)
        let activeId = '';

        // Start from the end and find the first heading that's above the threshold
        for (let i = headingPositions.length - 1; i >= 0; i--) {
            if (headingPositions[i].top <= threshold) {
                activeId = headingPositions[i].id;
                break;
            }
        }

        // If no heading is above threshold, use the first one if we're near the top
        if (!activeId && headingPositions.length > 0) {
            if (contentArea.scrollTop < 50) {
                activeId = headingPositions[0].id;
            }
        }

        // Only update if changed
        if (activeId && activeId !== this.activeId()) {
            this.activeId.set(activeId);
            this.logger.debug('TOC: Active heading changed to', activeId);

            // Auto-scroll TOC to keep active item visible
            this.scrollTocToActiveItem(activeId);
        }
    }

    /**
     * Scroll the TOC container to keep the active item visible
     */
    private scrollTocToActiveItem(activeId: string): void {
        // Wait a bit for DOM to update with active class
        setTimeout(() => {
            const tocContainer = document.querySelector('.toc');
            const activeLink = document.querySelector(`.toc-link[href="#${activeId}"]`);

            if (!tocContainer || !activeLink) return;

            const tocRect = tocContainer.getBoundingClientRect();
            const linkRect = activeLink.getBoundingClientRect();

            // Calculate if the active link is outside the visible area
            const isAbove = linkRect.top < tocRect.top;
            const isBelow = linkRect.bottom > tocRect.bottom;

            if (isAbove || isBelow) {
                // Calculate the scroll position to center the active item
                const tocScrollTop = tocContainer.scrollTop;
                const linkOffsetTop = linkRect.top - tocRect.top;
                const tocHeight = tocRect.height;
                const linkHeight = linkRect.height;

                // Center the active item in the TOC view
                const targetScroll = tocScrollTop + linkOffsetTop - (tocHeight / 2) + (linkHeight / 2);

                tocContainer.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
            }
        }, 50);
    }

    /**
     * Scroll to heading when clicked
     */
    scrollToHeading(id: string, event: Event): void {
        event.preventDefault();
        this.logger.debug('TOC: Scrolling to heading', id);

        const heading = document.getElementById(id);
        if (!heading) {
            this.logger.warn('TOC: Heading element not found', id);
            return;
        }

        const contentArea = document.querySelector('.doc-viewer') || document.querySelector('.docs-content');
        if (!contentArea) {
            this.logger.warn('TOC: Content area not found');
            return;
        }

        // Get the position of the heading relative to the content area
        const headingRect = heading.getBoundingClientRect();
        const contentRect = contentArea.getBoundingClientRect();
        const scrollTop = contentArea.scrollTop;

        // Calculate offset (heading position + current scroll - offset from top)
        const targetScroll = headingRect.top - contentRect.top + scrollTop - 80;

        this.logger.debug('TOC: Scrolling to position', targetScroll);

        contentArea.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });

        this.activeId.set(id);
    }

    /**
     * Check if heading is active
     */
    isActive(id: string): boolean {
        return this.activeId() === id;
    }
}
