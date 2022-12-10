package com.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dao.StudentDaoHandler;
import com.model.StudentModel;
import com.util.Util;


@MultipartConfig
public class UpdateStudentServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        StudentModel student = null;
        try {
            student = StudentDaoHandler.getInformationById(Integer.parseInt(request.getParameter("id")));
        } catch (Exception e) {
            System.out.println(e);
        }

        request.setAttribute("student", student);
        request.getRequestDispatcher("updatestudent.jsp").forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int status = 0;
        PrintWriter out = response.getWriter();
        StudentModel student = new StudentModel();

        student.setId(Integer.parseInt(request.getParameter("id")));
        student.setName(request.getParameter("name"));
        student.setRoll(request.getParameter("roll"));
        student.setGender(request.getParameter("gender"));
        student.setYear(request.getParameter("year"));
        student.setSemester(request.getParameter("semester"));
        student.setAddress(request.getParameter("address"));
        student.setPicture(Util.SaveImage(request.getPart("photo")));

        try {
            status = StudentDaoHandler.updateInformation(student);
        } catch (Exception e) {
            System.out.println(e);
        }
        if (status > 0) {
            response.sendRedirect("viewdetails?id="+student.getId());
        } else {
            out.println("Sorry! unable to update record");
        }
    }

}
