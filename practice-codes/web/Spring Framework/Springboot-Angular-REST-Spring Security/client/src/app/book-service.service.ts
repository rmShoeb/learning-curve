import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Book } from './book'
import { UtilService } from './util.service'
import { Author } from './author';

@Injectable({
    providedIn: 'root'
})
export class BookServiceService {
    private readonly serverUrl = 'http://localhost:8080/';

    constructor(
        private http: HttpClient,
        private util: UtilService
    ) { }

    authenticate(user: object): Observable<any> {
        return this.http.post<object>(
            this.serverUrl + 'authenticate',
            user,
            {
                headers: new HttpHeaders({ 'Content-Type': 'application/json' })
            }
        );
    }

    getBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(
            this.serverUrl+'books',
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.util.getJwt()
                })
            }
        );
    }
    getAuthors(): Observable<Author[]> {
        return this.http.get<Author[]>(
            this.serverUrl+'authors',
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.util.getJwt()
                })
            }
        );
    }

    addBook(book: object): Observable<any> {
        return this.http.post<object>(
            this.serverUrl+'book/new',
            book,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.util.getJwt()
                })
            }
        );
    }
    addAuthor(author: object): Observable<any> {
        return this.http.post<object>(
            this.serverUrl+'author/new',
            author,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.util.getJwt()
                })
            }
        );
    }

    getBookById(id: number): Observable<Book> {
        return this.http.get<Book>(
            this.serverUrl+'book/'+String(id),
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.util.getJwt()
                })
            }
        );
    }
    getAuthorById(id: number): Observable<Author> {
        return this.http.get<Author>(
            this.serverUrl+'author/'+String(id),
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.util.getJwt()
                })
            }
        );
    }

    updateBook(book: object): Observable<any> {
        return this.http.put<object>(
            this.serverUrl+'book/update',
            book,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.util.getJwt()
                })
            }
        );
    }
    updateAuthor(author: Author): Observable<any> {
        return this.http.put<Author>(
            this.serverUrl+'author/update',
            author,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.util.getJwt()
                })
            }
        );
    }

    deleteBook(id: number): Observable<any> {
        return this.http.delete<number>(
            this.serverUrl+'book/'+String(id),
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.util.getJwt()
                })
            }
        );
    }
    deleteAuthor(id: number): Observable<any> {
        return this.http.delete<number>(
            this.serverUrl+'author/'+String(id),
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.util.getJwt()
                })
            }
        );
    }
}
