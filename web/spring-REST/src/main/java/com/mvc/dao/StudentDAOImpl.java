package com.mvc.dao;

import com.mvc.model.Student;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StudentDAOImpl implements StudentDAO{

    @Autowired
    private SessionFactory sessionFactory;
    @Override
    public void addStudent(Student student) {
        sessionFactory.getCurrentSession().saveOrUpdate(student);
    }

    @Override
    public List<Student> getAllStudents() {
        return sessionFactory.getCurrentSession().createQuery("from Student ").list();
    }

    @Override
    public void deleteStudent(int id) {
        Student student = (Student) sessionFactory.getCurrentSession().load(
          Student.class, id
        );
        if(student != null){
            this.sessionFactory.getCurrentSession().delete(student);
        }
    }

    @Override
    public Student updateStudent(Student student) {
        sessionFactory.getCurrentSession().update(student);
        return student;
    }

    @Override
    public Student getStudent(int id) {
        return (Student) sessionFactory.getCurrentSession().get(Student.class, id);
    }
}
