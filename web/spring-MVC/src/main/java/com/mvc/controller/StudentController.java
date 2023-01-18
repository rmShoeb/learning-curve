package com.mvc.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import com.mvc.model.Student;
import com.mvc.service.StudentService;

@Controller
public class StudentController {
    @Autowired
    private StudentService studentService;

    @RequestMapping(value = "/")
    public ModelAndView listStudent(ModelAndView model) throws IOException {
        List<Student> listStudent = studentService.getAllStudents();
        model.addObject("listStudent", listStudent);
        model.setViewName("home");
        return model;
    }

    @RequestMapping(value = "/newStudent", method = RequestMethod.GET)
    public ModelAndView newContact(ModelAndView model) {
        Student student = new Student();
        model.addObject("student", student);
        model.setViewName("StudentForm");
        return model;
    }

    @RequestMapping(value = "/saveStudent", method = RequestMethod.POST)
    public ModelAndView saveStudent(@ModelAttribute Student student) {
        if(studentService.getStudent(student.getId()) != null)
            studentService.updateStudent(student);
        else studentService.addStudent(student);

        return new ModelAndView("redirect:/");
    }

    @RequestMapping(value = "/deleteStudent", method = RequestMethod.GET)
    public ModelAndView deleteStudent(HttpServletRequest request) {
        int studentId = Integer.parseInt(request.getParameter("id"));
        studentService.deleteStudent(studentId);
        return new ModelAndView("redirect:/");
    }

    @RequestMapping(value = "/editStudent", method = RequestMethod.GET)
    public ModelAndView editContact(HttpServletRequest request) {
        int studentId = Integer.parseInt(request.getParameter("id"));
        Student student = studentService.getStudent(studentId);
        ModelAndView model = new ModelAndView("StudentForm");
        model.addObject("student", student);

        return model;
    }

}
//https://github.com/WebJournal/journaldev/tree/master/Spring/Spring-RestController