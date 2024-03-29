package com.mvc.dao;

import java.util.List;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.mvc.model.Student;

@Repository
public class StudentDaoImpl implements StudentDAO {

    @Autowired
    private SessionFactory sessionFactory;

    public void addStudent(Student student) {
        sessionFactory.getCurrentSession().saveOrUpdate(student);

    }

    @SuppressWarnings("unchecked")
    public List<Student> getAllStudents() {
        return sessionFactory.getCurrentSession().createQuery("from Student")
                .list();
    }

    @Override
    public void deleteStudent(Integer studentId) {
        Student student = (Student) sessionFactory.getCurrentSession().load(
                Student.class, studentId);
        if (null != student) {
            this.sessionFactory.getCurrentSession().delete(student);
        }

    }

    public Student getStudent(int studentId) {
        return (Student) sessionFactory.getCurrentSession().get(
                Student.class, studentId);
    }

    @Override
    public Student updateStudent(Student student) {
        sessionFactory.getCurrentSession().update(student);
        return student;
    }

}
