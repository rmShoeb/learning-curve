package com.javatpoint.service;

import com.javatpoint.model.Author;
import com.javatpoint.repository.AuthorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AuthorService {
    @Autowired
    AuthorRepository authorRepository;

    public List<Author> getAllAuthors() {
        List<Author> authors = new ArrayList<Author>();
        authorRepository.findAll().forEach(authors::add);
        return authors;
    }

    public Author getAuthorById(int id){return authorRepository.findById(id).get();}
    public void saveOrUpdate(Author author) {authorRepository.save(author);}
    public  void delete(int id) {authorRepository.deleteById(id);}
}
