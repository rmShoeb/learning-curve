package com.javatpoint.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    @Column
    private String title;
    @Column
    private Date published;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {return title;}
    public void setTitle(String title) {this.title = title;}

    public Date getPublished() {return published;}
    public void setPublished(Date published) {this.published = published;}

    public Author getAuthor() {return author;}
    public void setAuthor(Author author) {this.author = author;}
}
