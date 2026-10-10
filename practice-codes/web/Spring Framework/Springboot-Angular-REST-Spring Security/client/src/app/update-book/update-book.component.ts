import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Author } from '../author';
import { Book } from '../book';
import { BookServiceService } from '../book-service.service';

@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.css']
})
export class UpdateBookComponent implements OnInit {
    book!: Book;
    authors: Author[] = [];

    constructor(
        private bookService: BookServiceService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location
    ){}

    ngOnInit(): void {
        this.getBookInfo();
        this.getAuthors();
    }

    getAuthors() : void {
        this.bookService.getAuthors().subscribe(authors => this.authors=authors);
    }

    getBookInfo(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.bookService.getBookById(id).subscribe({
            next: (book) => {
                this.book = book;
            }
        });
    }

    onSubmit(formData: any): void {
        let updateBook = {
            id: this.book.id,
            title: formData['title'],
            published: formData['published'],
            author: this.authors.find(author => author.id===Number(formData['author']))
        }
        this.bookService.updateBook(updateBook).subscribe({
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
