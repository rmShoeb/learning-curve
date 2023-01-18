package com.javatpoint.model;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    @Column
    private String name;
    @Column
    private String email;

//    @OneToMany(mappedBy = "author")
//    private Set<Book> book;

    public int getId() {return id;}
    public void setId(int id) {this.id = id;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

//    public Set<Book> getBook() {return book;}
//    public void setBook(Set<Book> book) {this.book = book;}
}
