package com.dao;

import com.model.StudentModel;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class StudentDaoHandler {
    public static Connection connectDB() {
        Connection connection = null;
        try {
            Class.forName("org.postgresql.Driver");
            connection = DriverManager.getConnection("jdbc:postgresql://localhost:5432/studentInfo", "postgres",
                    "1234");
        } catch (Exception exception) {
            System.out.println(exception);
        }
        return connection;
    }

    public static int addInformation(StudentModel student) throws SQLException {
        int result = 0;
        Connection connect = StudentDaoHandler.connectDB();
        PreparedStatement preparedStatement = connect.prepareStatement("INSERT INTO information(\"name\", \"roll\", \"gender\", \"year\", \"semester\", \"address\", \"picture\")VALUES (?, ?, ?, ?, ?, ?, ?)");

        preparedStatement.setString(1, student.getName());
        preparedStatement.setString(2, student.getRoll());
        preparedStatement.setString(3, student.getGender());
        preparedStatement.setString(4, student.getYear());
        preparedStatement.setString(5, student.getSemester());
        preparedStatement.setString(6, student.getAddress());
        preparedStatement.setString(7, student.getPicture());

        result = preparedStatement.executeUpdate();

        connect.close();
        return result;
    }

    public static int updateInformation(StudentModel student) throws SQLException {
        int result = 0;
        Connection connect = StudentDaoHandler.connectDB();

        PreparedStatement preparedStatement = connect.prepareStatement("update information set \"name\"=?, \"roll\"=?, \"gender\"=?, \"year\"=?, \"semester\"=?, \"address\"=?, \"picture\"=? where \"id\"=?");

        preparedStatement.setString(1, student.getName());
        preparedStatement.setString(2, student.getRoll());
        preparedStatement.setString(3, student.getGender());
        preparedStatement.setString(4, student.getYear());
        preparedStatement.setString(5, student.getSemester());
        preparedStatement.setString(6, student.getAddress());
        preparedStatement.setString(7, student.getPicture());
        preparedStatement.setInt(8, student.getId());

        result = preparedStatement.executeUpdate();
        connect.close();

        return result;
    }

    public static int deleteInformation(int id) throws SQLException {
        int result = 0;
        Connection connect = StudentDaoHandler.connectDB();

        PreparedStatement preparedStatement = connect.prepareStatement("delete from information where \"id\" =?");
        preparedStatement.setInt(1, id);

        result = preparedStatement.executeUpdate();
        connect.close();

        return result;
    }

    public static StudentModel getInformationById(int id) throws SQLException {
        StudentModel student = null;
        Connection connect = StudentDaoHandler.connectDB();
        PreparedStatement preparedStatement = connect.prepareStatement("select * from information where \"id\"=?");
        preparedStatement.setInt(1, id);
        ResultSet resultSet = preparedStatement.executeQuery();

        if (resultSet.next()) {
            student = new StudentModel();
            student.setId(resultSet.getInt("id"));
            student.setName(resultSet.getString("name"));
            student.setRoll(resultSet.getString("roll"));
            student.setGender(resultSet.getString("gender"));
            student.setYear(resultSet.getString("year"));
            student.setSemester(resultSet.getString("semester"));
            student.setAddress(resultSet.getString("address"));
            student.setPicture(resultSet.getString("picture"));
        }

        connect.close();
        return student;
    }

    public static List<StudentModel> getAllInformation() throws SQLException {
        List<StudentModel> list = new ArrayList<StudentModel>();
        Connection connect = StudentDaoHandler.connectDB();

        PreparedStatement preparedStatement = connect.prepareStatement("select * from information");
        ResultSet resultSet = preparedStatement.executeQuery();

        while (resultSet.next()) {
            StudentModel student = new StudentModel();

            student.setId(resultSet.getInt("id"));
            student.setName(resultSet.getString("name"));
            student.setRoll(resultSet.getString("roll"));
            student.setGender(resultSet.getString("gender"));
            student.setYear(resultSet.getString("year"));
            student.setSemester(resultSet.getString("semester"));
            student.setAddress(resultSet.getString("address"));
            student.setPicture(resultSet.getString("picture"));

            list.add(student);
        }

        connect.close();
        return list;
    }
}
