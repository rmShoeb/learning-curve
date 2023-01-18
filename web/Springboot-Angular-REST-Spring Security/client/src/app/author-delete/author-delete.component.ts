import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BookServiceService } from '../book-service.service'

@Component({
    selector: 'app-author-delete',
    templateUrl: './author-delete.component.html',
    styleUrls: ['./author-delete.component.css']
})
export class AuthorDeleteComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private bookService: BookServiceService
    ) { }

    ngOnInit(): void {
        this.deleteAuthor();
    }

    deleteAuthor(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.bookService.deleteAuthor(id).subscribe({
            next: () => {
                this.router.navigateByUrl('home');
            },
            error: (error) => {
                console.log(error);
            }
        });
    }
}
