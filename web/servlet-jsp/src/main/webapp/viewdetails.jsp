<%--
  Created by IntelliJ IDEA.
  User: riyad
  Date: 12/4/2022
  Time: 8:48 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" isELIgnored="false" pageEncoding="ISO-8859-1" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>

<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
        crossorigin="anonymous">
  <title>Student Portal</title>
  <style>
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>

<body style="margin: 20px;">
<div class="card" style="width: 500px">
  <img src="fetchimage?filename=${ student.getPicture() }" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${ student.getName() }, ${ student.getGender() }</h5>
    <p class="card-text">
    <p>Roll: ${ student.getRoll() }</p>
    <p>${ student.getYear() } Year ${ student.getSemester() } Semester</p>
    <address>Address: ${ student.getAddress() }</address>
    </p>
    <a href="updatestudent?id=${ student.getId() }"><button>Update</button></a>
    <a href="deletestudent?id=${ student.getId() }"><button>Delete</button></a>
  </div>
</div>
<a href="home"><button>Home</button></a>
</body>

</html>
