import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '@shared/components/header/header.component';

@Component({
    selector: 'app-docs',
    standalone: true,
    imports: [RouterOutlet, SidebarComponent, HeaderComponent],
    templateUrl: './docs.component.html',
    styleUrl: './docs.component.css'
})
export class DocsComponent {
    protected readonly isMobileMenuOpen = signal(false);

    toggleMobileMenu(): void {
        this.isMobileMenuOpen.update(value => !value);
    }

    closeMobileMenu(): void {
        this.isMobileMenuOpen.set(false);
    }
}
