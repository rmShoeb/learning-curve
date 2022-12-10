<%@ page
	language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"
%>
<html>
<head>
  <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>
  <title>User Input Form</title>
</head>
 
<body>

<h2>User Input Form</h2>
<form method="post" action="addinfo">
  <fieldset>
    <legend>Personal Particular</legend>
    <p>
    	ID: <input type="number" name="id" />
    </p>
    <p>
    	Name: <input type="text" name="name" />
    </p>
    <p>
    	Rating: <input type="text" name="rating" />
    </p>
  </fieldset>
  <p>
  	<input type="submit" value="SEND" />
  	<input type="reset" value="CLEAR" />
  </p>
</form>
</body>
</html>