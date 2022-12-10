package com.mvc.dao;

import java.util.List;
import com.mvc.model.Student;

public interface StudentDAO {
    public void addStudent(Student student);
    public List<Student>getAllStudents();
    public void deleteStudent(int id);
    public Student updateStudent(Student student);
    public Student getStudent(int id);

}
