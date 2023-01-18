import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { BookServiceService } from '../book-service.service';


@Component({
    selector: 'app-author-add',
    templateUrl: './author-add.component.html',
    styleUrls: ['./author-add.component.css']
})
export class AuthorAddComponent {
    constructor(
        private location: Location,
        private router: Router,
        private bookService: BookServiceService
    ) { }

    onSubmit(formData: any): void {
        this.bookService.addAuthor(formData).subscribe({
            next: () => {
                this.router.navigateByUrl('home');
            },
            error: (error) => {
                console.log(error);
            }
        })
    }

    goBack(): void {
        this.location.back();
    }
}
