package com.javatpoint.controller;

import java.util.List;

import com.javatpoint.model.Student;
import com.javatpoint.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StudentController
{
    @Autowired
    StudentService studentService;

    @GetMapping("/student")
    private List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/student/{id}")
    private Student getStudent(@PathVariable("id") int id) {
        return studentService.getStudentsById(id);
    }

    @PostMapping("/student")
    private String saveBook(@RequestBody Student student)
    {
        studentService.saveOrUpdate(student);
        return "Student with ID "+student.getId()+" saved!";
    }

    @DeleteMapping("/student/{id}")
    private String deleteStudent(@PathVariable("id") int id) {
        studentService.delete(id);
        return "Student with ID "+id+" deleted!";
    }

    @PutMapping("/student")
    private Student update(@RequestBody Student student) {
        studentService.saveOrUpdate(student);
        return student;
    }
}
