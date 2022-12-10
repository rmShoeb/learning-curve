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
    <form method="post" action="addStudent" enctype="multipart/form-data">
        <fieldset>
            <legend>Add New Student</legend>
            <p>
                <label for="name">Name: </label>
                <input type="text" id="name" name="name" minlength="5" maxlength="50" required />
            </p>
            <p>
                <label for="roll">Roll No: </label>
                <input type="text" id="roll" name="roll" minlength="5" maxlength="10" required>
                Gender:
                <input type="radio" name="gender" value="M">Male
                <input type="radio" name="gender" value="F">Female
            </p>
            <p>
                <label for="year">Year: </label>
                <select id="year" name="year">
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
                <input type="text" id="address" name="address" minlength="5" maxlength="100" required>
            </p>
            <p>
                <label for="photo">Student Photo: </label>
                <input type="file" id="photo" name="photo" accept="image/*" required>
            </p>
            <p>
                <input type="submit" value="ADD" />
                <input type="reset" value="CLEAR" />
            </p>
        </fieldset>
    </form>
</div>
<div>
    <table class="table">
        <thead>
        <tr>
            <th scope="col">Name</th>
            <th scope="col">Roll</th>
            <th scope="col">Year</th>
            <th scope="col">Semester</th>
            <th scope="col"></th>
        </tr>
        </thead>
        <tbody>
        <c:forEach var="student" items="${ students }">
            <tr>
                <td><c:out value="${ student.getName() }" /></td>
                <td><c:out value="${ student.getRoll() }" /></td>
                <td><c:out value="${ student.getYear() }" /></td>
                <td><c:out value="${ student.getSemester() }" /></td>
                <td><a href="viewdetails?id=${ student.getId() }"><button>View Details</button></a></td>
            </tr>
        </c:forEach>
        </tbody>
    </table>
</div>
</body>

</html>