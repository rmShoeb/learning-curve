package com.javatpoint.service;


import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.javatpoint.model.Student;
import com.javatpoint.repository.StudentRepository;

@Service
public class StudentService
{
    @Autowired
    StudentRepository studentRepository;
    public List<Student> getAllStudents()
    {
        List<Student> students = new ArrayList<Student>();
        studentRepository.findAll().forEach(students::add);
        return students;
    }

    public Student getStudentsById(int id)
    {
        return studentRepository.findById(id).get();
    }

    public void saveOrUpdate(Student student)
    {
        studentRepository.save(student);
    }

    public void delete(int id)
    {
        studentRepository.deleteById(id);
    }

    public void update(Student student, int id)
    {
        studentRepository.save(student);
    }
}