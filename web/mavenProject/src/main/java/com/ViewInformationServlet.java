package com;

import java.io.IOException;
import javax.servlet.ServletException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ViewInformationServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processRequest(request, response);
		PrintWriter out = response.getWriter();
		List<Information> list = null;
		
		out.println("<a href='home'>Add user</a>");
		out.print("<h1> User Table: </h1>");
		out.print("<table border='1' cellpadding='4' width='80%'>");
		out.print("<tr><th>Id</th><th>Name</th></tr>");
		try {
			list = InformationDaoHandler.getAllInformation();
		} catch (SQLException e) {
			e.printStackTrace();
		}

		if (list != null) {
			for (Information info : list) {
				out.print("<tr><td>" + info.getId() +
						"</td><td>" + info.getName() +
						"</td><td>" + info.getRating() +
						"</td></tr>");
			}
			out.print("</table>");
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}
}
