<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	isELIgnored="false" pageEncoding="ISO-8859-1" import="java.sql.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>

<head>
<meta charset="ISO-8859-1">
<title>Result</title>
</head>

<body>
	<h1>Success!</h1>
	<table>
		<thead>
			<tr>
				<td>ID</td>
				<td>Name</td>
				<td>Rating</td>
				<td>Actions</td>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="user" items="${ informations }">
				<tr>
					<td><c:out value="${ user.getRating() }" /></td>
					<td><c:out value="${ user.getRating() }" /></td>
					<td><c:out value="${ user.getRating() }" /></td>
					<td>
						
					</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</body>

</html>