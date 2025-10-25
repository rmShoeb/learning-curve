import { Component, inject, output } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavigationService } from '@core/services/navigation.service';
import { NavigationItem } from '@core/models/doc-metadata.model';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, NgTemplateOutlet],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    protected readonly navigationService = inject(NavigationService);

    // Event emitter for when a navigation link is clicked
    readonly linkClick = output<void>();

    toggleItem(item: NavigationItem): void {
        this.navigationService.toggleItem(item);
    }

    onLinkClick(): void {
        this.linkClick.emit();
    }

    /**
     * Track function for @for loop to uniquely identify items
     * Uses route if available, otherwise uses index + label combination
     */
    trackByItem(index: number, item: NavigationItem): string {
        return item.route || `${index}-${item.label}`;
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
