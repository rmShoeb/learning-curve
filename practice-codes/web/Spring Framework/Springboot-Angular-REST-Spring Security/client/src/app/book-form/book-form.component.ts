import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { BookServiceService } from '../book-service.service'
import { Author } from '../author';
import { Conditional } from '@angular/compiler';

@Component({
    selector: 'app-book-form',
    templateUrl: './book-form.component.html',
    styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
    authors: Author[] = [];

    constructor(
        private location: Location,
        private router: Router,
        private bookService: BookServiceService
    ) { }

    ngOnInit(): void {
        this.bookService.getAuthors().subscribe(authors => this.authors=authors);
    }

    onSubmit(formData: any): void {
        let book = {
            title: formData['title'],
            published: formData['published'],
            author: this.authors.find(author => author.id===Number(formData['author']))
        }
        this.bookService.addBook(book).subscribe({
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
