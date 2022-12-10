package com.mvc.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mvc.dao.StudentDAO;
import com.mvc.model.Student;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentDAO studentDAO;

    @Override
    @Transactional
    public void addStudent(Student student) {
        studentDAO.addStudent(student);
    }

    @Override
    @Transactional
    public List<Student> getAllStudents() {
        return studentDAO.getAllStudents();
    }

    @Override
    @Transactional
    public void deleteStudent(Integer studentId) {
        studentDAO.deleteStudent(studentId);
    }

    public Student getStudent(int studentId) {
        return studentDAO.getStudent(studentId);
    }

    public Student updateStudent(Student student) {
        return studentDAO.updateStudent(student);
    }

    public void setStudentAO(StudentDAO studentDAO) {
        this.studentDAO = studentDAO;
    }

}
