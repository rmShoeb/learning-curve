package com;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class Hello extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn = null;
	private Statement stmt = null;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.getRequestDispatcher("index.jsp").forward(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		ResultSet rs = null;
		List<Information> list = new ArrayList<>();
		try {
			Class.forName("org.postgresql.Driver");
			conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/mavenServlet", "postgres", "1234");
			stmt = conn.createStatement();
			rs = this.stmt.executeQuery("SELECT * FROM infromation");
			while (rs.next()) {
				Information inf = new Information(rs.getInt("ID"), rs.getString("NAME"), rs.getString("RATING"));
				list.add(inf);
			}
			rs.close();
			stmt.close();
		} catch (Exception e) {}
		
		request.setAttribute("informations", list);
		request.getRequestDispatcher("result.jsp").forward(request, response);
	}

}
