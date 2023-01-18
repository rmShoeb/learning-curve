package com.mvc.service;

import com.mvc.model.Student;

import java.util.List;

public interface StudentService {
    public void addStudent(Student student);
    public List<Student> getAllStudents();
    public void deleteStudent(int id);
    public Student getStudent(int id);
    public Student updateStudent(Student student);
}
