import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component'
import { LogoutComponent } from './logout/logout.component'
import { HomeComponent } from './home/home.component'
import { BookFormComponent } from './book-form/book-form.component'
import { DeleteBookComponent } from './delete-book/delete-book.component'
import { UpdateBookComponent } from './update-book/update-book.component';
import { AuthorAddComponent } from './author-add/author-add.component';
import { AuthorUpdateComponent } from './author-update/author-update.component';
import { AuthorDeleteComponent } from './author-delete/author-delete.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'home', component: HomeComponent },
    { path: 'add-new-book', component: BookFormComponent },
    { path: 'update-book/:id', component: UpdateBookComponent },
    { path: 'delete-book/:id', component: DeleteBookComponent },
    { path: 'add-new-author', component: AuthorAddComponent },
    { path: 'update-author/:id', component: AuthorUpdateComponent },
    { path: 'delete-author/:id', component: AuthorDeleteComponent },
    { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
