<%-- Created by IntelliJ IDEA. User: riyad Date: 12/5/2022 Time: 12:14 PM To change this template use File | Settings |
  File Templates. --%>
  <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false" %>
    <%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
      <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
      <html>

      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <title>New/Edit Contact</title>
      </head>

      <body>
        <div align="center">
          <h1>New/Edit Student</h1>
          <form:form action="saveStudent" method="post" modelAttribute="student">
            <table>
              <tr>
                <td>ID:</td>
                <td>
                  <form:input path="id" cssClass="form-control"/>
                </td>
              </tr>
              <tr>
                <td>Name:</td>
                <td>
                  <form:input path="name" cssClass="form-control"/>
                </td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>
                  <form:input path="email" cssClass="form-control"/>
                </td>
              </tr>
              <tr>
                <td>Address:</td>
                <td>
                  <form:input path="address" cssClass="form-control"/>
                </td>
              </tr>
              <tr>
                <td>Telephone:</td>
                <td>
                  <form:input path="telephone" cssClass="form-control"/>
                </td>
              </tr>
              <tr>
                <td colspan="2" align="center">
                  <input type="submit" value="Save" class="btn btn-info">
                </td>
              </tr>
            </table>
          </form:form>
        </div>
      </body>

      </html>