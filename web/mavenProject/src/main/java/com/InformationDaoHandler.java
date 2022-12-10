package com;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class InformationDaoHandler {
	public static Connection connectDB() {
		Connection connection = null;
		try {
			Class.forName("org.postgresql.Driver");
			connection = DriverManager.getConnection("jdbc:postgresql://localhost:5432/mavenServlet", "postgres", "1234");
		}
		catch (Exception message) {
			System.out.println(message);
		}
		return connection;
	}

	public static int addInformation(Information info) throws SQLException {
		int result = 0;
		Connection connect = InformationDaoHandler.connectDB();
		PreparedStatement preparedStatement = connect.
				prepareStatement("insert into information(\"ID\",\"NAME\",\"RATING\") values (?,?,?)");

		preparedStatement.setInt(1, info.getId());
		preparedStatement.setString(2, info.getName());
		preparedStatement.setString(3, info.getRating());

		result = preparedStatement.executeUpdate();

		connect.close();
		return result;
	}

	public static int updateInformation(Information info) throws SQLException {
		int result = 0;
		Connection connect = InformationDaoHandler.connectDB();

		PreparedStatement preparedStatement = connect
				.prepareStatement("update information set \"NAME\"=?,\"RATING\"=? where \"ID\"=?");

		preparedStatement.setString(1, info.getName());
		preparedStatement.setString(2, info.getRating());

		result = preparedStatement.executeUpdate();
		connect.close();
		
		return result;
	}

	public static int deleteInformation(int id) throws SQLException {
		int result = 0;
		Connection connect = InformationDaoHandler.connectDB();

		PreparedStatement preparedStatement = connect.prepareStatement("delete from information where \"ID\" =?");
		preparedStatement.setInt(1, id);

		result = preparedStatement.executeUpdate();
		connect.close();

		return result;
	}

	public static Information getInformationById(int id) throws SQLException {
		Information info = null;
		Connection connect = InformationDaoHandler.connectDB();
		PreparedStatement preparedStatement = connect.prepareStatement("select * from information where \"ID\"=?");
		preparedStatement.setInt(1, id);
		ResultSet resultSet = preparedStatement.executeQuery();

		if (resultSet.next()) {
			info = new Information(
					resultSet.getInt("ID"),
					resultSet.getString("NAME"),
					resultSet.getString("RATING"));
		}

		connect.close();
		return info;
	}

	public static List<Information> getAllInformation() throws SQLException {
		List<Information> list = new ArrayList<Information>();
		Connection connect = InformationDaoHandler.connectDB();
		
		PreparedStatement preparedStatement = connect.prepareStatement("select * from information");
		ResultSet resultSet = preparedStatement.executeQuery();

		while (resultSet.next()) {
			Information info = new Information(
					resultSet.getInt("ID"),
					resultSet.getString("NAME"),
					resultSet.getString("RATING"));
			list.add(info);
		}
		
		connect.close();
		return list;
	}
}
