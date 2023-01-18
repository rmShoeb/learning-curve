package com.javatpoint.controller;

import java.util.List;

import com.javatpoint.model.Book;
import com.javatpoint.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class BookController
{
    @Autowired
    BookService bookService;

    @GetMapping("/book")
    private List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }
    @PostMapping("/book")
    private void saveBook(@RequestBody Book book)
    {
        bookService.saveOrUpdate(book);
    }
    @PutMapping("/book")
    private void update(@RequestBody Book book) {
        bookService.saveOrUpdate(book);
    }

    @GetMapping("/book/{id}")
    private Book getBook(@PathVariable("id") int id) {
        return bookService.getBookById(id);
    }
    @DeleteMapping("/book/{id}")
    private void deleteBook(@PathVariable("id") int id) {
        bookService.delete(id);
    }
}
