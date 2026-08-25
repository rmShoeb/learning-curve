import { Component, computed, inject } from '@angular/core';
import { NavigationService } from '@app/core/services/navigation.service';

@Component({
    selector: 'app-doc-home',
    standalone: true,
    templateUrl: './doc-home.component.html',
    styleUrl: './doc-home.component.css'
})
export class DocHomeComponent {
    private readonly navigationService = inject(NavigationService);
    readonly titles = computed(() => {
        if (this.navigationService.isLoading()) {
            return [];
        }

        return this.navigationService.getNavigationItems()
            .filter(group => group.children)
            .map(group => group.label);
    });
}
