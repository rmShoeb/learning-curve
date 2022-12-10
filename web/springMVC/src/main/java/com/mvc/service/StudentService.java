package com.mvc.service;

import java.util.List;

import com.mvc.model.Student;

public interface StudentService {

    public void addStudent(Student student);

    public List<Student> getAllStudents();

    public void deleteStudent(Integer studentId);

    public Student getStudent(int studentId);

    public Student updateStudent(Student student);
}

