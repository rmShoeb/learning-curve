<%--
  Created by IntelliJ IDEA.
  User: riyad
  Date: 12/4/2022
  Time: 8:47 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
         isELIgnored="false" pageEncoding="ISO-8859-1"
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>

<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  <title>Student Portal</title>
</head>

<body style="margin: 20px;">
<div>
  <form method="post" action="updatestudent?id=${ student.getId() }" enctype="multipart/form-data">
    <fieldset>
      <legend>Update Student Information</legend>
      <p>
        <label for="name">Name: </label>
        <input type="text" name="name" value="${ student.getName() }" minlength="5" maxlength="50" required />
      </p>
      <p>
        <label for="roll">Roll No: </label>
        <input type="text" name="roll" value="${ student.getRoll() }" minlength="5" maxlength="10" required>
        Gender:
        <input type="radio" name="gender" value="M">Male
        <input type="radio" name="gender" value="F">Female
      </p>
      <p>
        <label for="year">Year: </label>
        <select name="year">
          <option value="First">First</option>
          <option value="Second">Second</option>
          <option value="Third">Third</option>
          <option value="Fourth">Fourth</option>
        </select>
        Semester:
        <input type="radio" name="semester" value="odd"> Odd
        <input type="radio" name="semester" value="even"> Even
      </p>
      <p>
        <label for="address">Address: </label>
        <input type="text" name="address" value="${ student.getAddress() }" minlength="5" maxlength="100" required>
      </p>
      <p>
        <label for="photo">Student Photo: </label>
        <input type="file" name="photo" accept="image/*" required>
      </p>
      <p>
        <input type="submit" value="UPDATE" />
        <input type="reset" value="CLEAR" />
      </p>
    </fieldset>
  </form>
</div>
</body>

</html>