package com.mvc.service;

import com.mvc.dao.StudentDAO;
import com.mvc.model.Student;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StudentServiceImpl implements StudentService{

    @Autowired
    private StudentDAO studentDAO;

    @Override
    public void addStudent(Student student) {
        studentDAO.addStudent(student);
    }

    @Override
    public List<Student> getAllStudents() {
        return studentDAO.getAllStudents();
    }

    @Override
    public void deleteStudent(int id) {
        studentDAO.deleteStudent(id);
    }

    @Override
    public Student getStudent(int id) {
        return studentDAO.getStudent(id);
    }

    @Override
    public Student updateStudent(Student student) {
        return studentDAO.updateStudent(student);
    }
}
