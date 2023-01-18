package com.mvc.controller;

import com.mvc.model.Student;
import com.mvc.service.StudentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class StudentController {
    public final String STUDENT_ADDED_SUCCESSFULLY = "Student added Successfully!";
    public final String STUDENT_DELETED_SUCCESSFULLY = "Student deleted Successfully!";

    @Autowired
    private StudentService studentService;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public List<Student> listStudents(){
        return studentService.getAllStudents();
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public String newStudent(@RequestBody Student student){
        studentService.addStudent(student);
        return STUDENT_ADDED_SUCCESSFULLY;
    }



    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    public String deleteStudent(@PathVariable int id){
        studentService.deleteStudent(id);
        return STUDENT_DELETED_SUCCESSFULLY;
    }

    @RequestMapping(value = "/update", method = RequestMethod.PUT)
    public Student editStudent(@RequestBody Student student){
        return studentService.updateStudent(student);
    }


}
