import { Component, OnInit } from '@angular/core';

import { BookServiceService } from '../book-service.service'
import { Book } from '../book'
import { Author } from '../author';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    books:Book[] = [];
    authors: Author[] = [];

    constructor(private bookService: BookServiceService) {}

    ngOnInit(): void {
        this.getBooks();
        this.getAuthors();
    }

    getBooks(): void{
        this.bookService.getBooks().subscribe(books => this.books=books);
    }
    getAuthors(): void {
        this.bookService.getAuthors().subscribe(authors => this.authors=authors);
    }
}
