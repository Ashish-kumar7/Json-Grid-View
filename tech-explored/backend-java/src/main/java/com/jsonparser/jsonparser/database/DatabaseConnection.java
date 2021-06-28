package com.jsonparser.jsonparser.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
	public static Connection getConnection() throws SQLException {
		Connection conn = null;
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
//			database URL for connection
			String url = "jdbc:mysql://localhost:3306/ashishdb";
//			UserName of the database
			String name = "root";
//			Password of the database
			String pass = "root";
			conn = DriverManager.getConnection(url, name, pass);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		return conn;
	}
}
