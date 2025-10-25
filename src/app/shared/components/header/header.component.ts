import { Component, inject, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, FormsModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
    private readonly router = inject(Router);

    protected searchQuery = '';

    // Event emitter for mobile menu toggle
    readonly menuToggle = output<void>();

    onSearch(): void {
        if (this.searchQuery.trim()) {
            this.router.navigate(['/search'], {
                queryParams: { q: this.searchQuery.trim() }
            });
        }
    }

    onSearchKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onSearch();
        }
    }

    toggleMobileMenu(): void {
        this.menuToggle.emit();
    }
}
