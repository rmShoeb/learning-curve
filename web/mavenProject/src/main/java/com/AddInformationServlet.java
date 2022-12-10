package com;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AddInformationServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		processRequest(request, response);

		PrintWriter out = response.getWriter();

		Information info = new Information(
				Integer.parseInt(request.getParameter("id")),
				request.getParameter("name"),
				request.getParameter("rating"));
		int status = 0;

		try {
			status = InformationDaoHandler.addInformation(info);
		}
		catch (SQLException e) {
			e.printStackTrace();
		}

		if (status > 0) {
//			out.println("<p>Record saved successfully!</p>");
			response.sendRedirect("viewinfo");
//			request.getRequestDispatcher("index.html").include(request, response);
		}else {
			out.println("Sorry! unable to save record");
		}

		out.close();
	}
}
