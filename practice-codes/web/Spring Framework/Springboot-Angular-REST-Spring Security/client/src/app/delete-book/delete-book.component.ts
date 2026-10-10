import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BookServiceService } from '../book-service.service'

@Component({
    selector: 'app-delete-book',
    templateUrl: './delete-book.component.html',
    styleUrls: ['./delete-book.component.css']
})
export class DeleteBookComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private bookService: BookServiceService
    ) { }

    ngOnInit(): void {
        this.deleteBook();
    }

    deleteBook(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.bookService.deleteBook(id).subscribe({
            next: () => {
                this.router.navigateByUrl('home');
            },
            error: (error) => {
                console.log(error);
            }
        });
    }
}
