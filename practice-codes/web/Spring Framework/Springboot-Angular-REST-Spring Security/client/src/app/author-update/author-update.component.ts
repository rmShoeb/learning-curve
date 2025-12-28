import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Author } from '../author';

import { BookServiceService } from '../book-service.service';

@Component({
    selector: 'app-author-update',
    templateUrl: './author-update.component.html',
    styleUrls: ['./author-update.component.css']
})
export class AuthorUpdateComponent implements OnInit {
    author!: Author;

    constructor(
        private bookService: BookServiceService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location
    ){}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.bookService.getAuthorById(id).subscribe(author => this.author=author);
    }

    onSubmit(): void {
        this.bookService.updateAuthor(this.author).subscribe({
            next: () => {
                this.router.navigateByUrl('home');
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    goBack(): void {
        this.location.back();
    }
}
