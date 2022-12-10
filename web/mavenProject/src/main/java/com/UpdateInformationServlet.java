package com;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.PrintWriter;
import java.sql.SQLException;


public class UpdateInformationServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter out = response.getWriter();
		int id = Integer.parseInt(request.getParameter("id"));
		
		try {
			Information info = InformationDaoHandler.getInformationById(id);

			out.println("<h2>Edit User Account</h2>");
			out.print("<form action='updateinfo' method='post'>");
			out.print("<table>");
			out.print("<tr><td></td><td><input type='hidden' name='id' value='" + info.getId() + "'/></td></tr>");
			out.print("<tr><td>Name:</td><td><input type='text' name='name' value='" + info.getName() + "'/></td></tr>");
			out.print("<tr><td>Rating:</td><td><input type='text' name='rating' value='" + info.getRating() + "'/></td></tr>");
			out.print("<tr><td colspan='2'><input type='submit' value='Update'/></td></tr>");
			out.print("</table>");
			out.print("</form>");

			out.close();
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter out = response.getWriter();

        Information info = new Information(
        		Integer.parseInt(request.getParameter("id")),
        		request.getParameter("name"),
        		request.getParameter("rating"));

        try {
            int result = InformationDaoHandler.updateInformation(info);
            if (result > 0) {
                response.sendRedirect("viewinfo");
            }
            else {
                out.print("unable to connect");
            }
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        out.close();
	}

}
