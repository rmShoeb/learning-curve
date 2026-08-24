import { Component, effect, inject, signal } from '@angular/core';
import { NavigationService } from '@app/core/services/navigation.service';

@Component({
    selector: 'app-doc-home',
    standalone: true,
    templateUrl: './doc-home.component.html',
    styleUrl: './doc-home.component.css'
})
export class DocHomeComponent {
    titles = signal<string[]>([]);
    private readonly navigationService = inject(NavigationService);

    constructor() {

        effect(() => {
            if(!this.navigationService.isLoading()) {
                this.generateQuickLinks()
            }
        });
    }

    generateQuickLinks() {
        this.navigationService.getNavigationItems().forEach((group) => {
            if(group.children) {
                this.titles.update((list) => [...list, group.label]);
            }
        });
    }
}
