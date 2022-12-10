<%@page contentType="text/html" pageEncoding="UTF-8"
        isELIgnored="false"
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <title>Student Management Screen</title>
</head>
<body>
<div align="center">
    <h1>Student List</h1>
    <h3>
        <a href="newStudent" type="button" class="btn btn-light">New Student</a>
    </h3>
    <c:choose>
        <c:when test="${listStudent.size()==0}">
            <div class="alert alert-info" role="alert">
                No Items
            </div>
        </c:when>
        <c:otherwise>
            <table class="table table-striped table-hover">
                <thead>
                    <tr class="table-dark">
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Address</th>
                        <th scope="col">Telephone</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>

                <c:forEach var="student" items="${listStudent}">
                    <tr>
                        <th scope="row">${student.id}</th>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.address}</td>
                        <td>${student.telephone}</td>
                        <td><a href="editStudent?id=${student.id}" type="button" class="btn btn-warning btn-sm">Edit</a>
                            <a href="deleteStudent?id=${student.id}" type="button" class="btn btn-danger btn-sm">Delete</a>
                        </td>
                    </tr>
                </c:forEach>
            </table>
        </c:otherwise>
    </c:choose>
</div>
</body>
</html>