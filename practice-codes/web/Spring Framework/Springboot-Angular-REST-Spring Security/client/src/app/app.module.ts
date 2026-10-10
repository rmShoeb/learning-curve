import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BookFormComponent } from './book-form/book-form.component';
import { LogoutComponent } from './logout/logout.component';
import { DeleteBookComponent } from './delete-book/delete-book.component';
import { UpdateBookComponent } from './update-book/update-book.component';
import { AuthorAddComponent } from './author-add/author-add.component';
import { AuthorUpdateComponent } from './author-update/author-update.component';
import { AuthorDeleteComponent } from './author-delete/author-delete.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        BookFormComponent,
        LogoutComponent,
        DeleteBookComponent,
        UpdateBookComponent,
        AuthorAddComponent,
        AuthorUpdateComponent,
        AuthorDeleteComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
