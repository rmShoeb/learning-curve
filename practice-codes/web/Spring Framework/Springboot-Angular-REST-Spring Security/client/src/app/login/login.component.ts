import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { BookServiceService } from '../book-service.service'
import { UtilService } from '../util.service'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    constructor(
        private _router: Router,
        private bookService: BookServiceService,
        private utilService: UtilService
    ) { }

    onSubmit(formData: any): void {
        this.bookService.authenticate(formData).subscribe({
            next: (response) => {
                this.utilService.saveJwt(response['jwt']);
                this._router.navigateByUrl('home');
            },
            error: (error) => {
                console.log(error);
                this._router.navigateByUrl('login');
            }
        });
    }
}
