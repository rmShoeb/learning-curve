package com.javatpoint.controller;

import java.util.List;

import com.javatpoint.model.AuthenticationRequest;
import com.javatpoint.model.AuthenticationResponse;
import com.javatpoint.model.Book;
import com.javatpoint.model.MyUserDetails;
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

    @GetMapping("/book")
    private List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }
    @PostMapping("/book/new")
    private void saveBook(@RequestBody Book book)
    {
        bookService.saveOrUpdate(book);
//        return "book with ID "+book.getId()+" saved!";
    }
    @PutMapping("/book/update")
    private void update(@RequestBody Book book) {
        bookService.saveOrUpdate(book);
//        return book;
    }
    @GetMapping("/book/{id}")
    private Book getBook(@PathVariable("id") int id) {
        return bookService.getBookById(id);
    }
    @DeleteMapping("/book/{id}")
    private void deleteBook(@PathVariable("id") int id) {
        bookService.delete(id);
//        return "Student with ID "+id+" deleted!";
    }
}
