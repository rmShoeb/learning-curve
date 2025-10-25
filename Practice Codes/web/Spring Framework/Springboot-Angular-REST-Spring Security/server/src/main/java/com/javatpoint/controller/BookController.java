package com.javatpoint.controller;

import java.util.List;

import com.javatpoint.model.*;
import com.javatpoint.service.AuthorService;
import com.javatpoint.service.BookService;
import com.javatpoint.service.MyUserDetailsService;
import com.javatpoint.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
public class BookController
{
    @Autowired
    private BookService bookService;
    @Autowired
    private AuthorService authorService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private MyUserDetailsService userDetailsService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception{
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword()));
        } catch (BadCredentialsException badCredentialsException){
            throw new Exception("Incorrect username or password");
        }
        final MyUserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthenticationResponse(jwt));
    }

    // book apis
    @GetMapping("/books")
    private List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }
    @PostMapping("/book/new")
    private void saveBook(@RequestBody Book book) {bookService.saveOrUpdate(book);}
    @PutMapping("/book/update")
    private void update(@RequestBody Book book) {bookService.saveOrUpdate(book);}
    @GetMapping("/book/{id}")
    private Book getBook(@PathVariable("id") int id) {
        return bookService.getBookById(id);
    }
    @DeleteMapping("/book/{id}")
    private void deleteBook(@PathVariable("id") int id) {bookService.delete(id);}

    // author apis
    @GetMapping("/authors")
    private List<Author> getAllAuthors(){return authorService.getAllAuthors();}
    @GetMapping("/author/{id}")
    private Author getAuthorById(@PathVariable("id") int id) {return authorService.getAuthorById(id);}
    @PostMapping("/author/new")
    private void addNewAuthor(@RequestBody Author author) {authorService.saveOrUpdate(author);}
    @PutMapping("/author/update")
    private void updateAuthor(@RequestBody Author author) {authorService.saveOrUpdate(author);}
    @DeleteMapping("/author/{id}")
    private void deleteAuthor(@PathVariable("id") int id) {authorService.delete(id);}
}
