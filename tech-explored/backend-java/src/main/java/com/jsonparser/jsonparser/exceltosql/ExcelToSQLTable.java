package com.jsonparser.jsonparser.exceltosql;

import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Row.MissingCellPolicy;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.jsonparser.jsonparser.database.DatabaseConnection;

public class ExcelToSQLTable {
	
	//set the name of table where you need to save the data in the database
	private static final String JS_TABLE_NAME = "JSON_TABLE5";
	public static void saveIntoDatabase(String fileName) {
		try {
			InputStream ExcelFileToRead = new FileInputStream(fileName);
			XSSFWorkbook wb = new XSSFWorkbook(ExcelFileToRead);

			XSSFSheet sheet = wb.getSheetAt(0);
			XSSFRow row;
			XSSFCell cell;

			Iterator rows = sheet.rowIterator();
			int rowCount = 0;
			List<String> rowheader = new ArrayList<>();
			List<String> rowdata = new ArrayList<>();
			List<List<String>> rowList = new ArrayList<>();

			while (rows.hasNext()) {
				row = (XSSFRow) rows.next();
				rowdata = new ArrayList<>();
				if (rowCount == 0) {
					for (int i = 0; i < row.getLastCellNum(); i++) {
						cell = row.getCell(i, MissingCellPolicy.CREATE_NULL_AS_BLANK);
						rowheader.add(cell.toString());
						System.out.print(cell.toString() + " ");
					}
				} else {
					for (int i = 0; i < row.getLastCellNum(); i++) {
						cell = row.getCell(i, MissingCellPolicy.CREATE_NULL_AS_BLANK);
						rowdata.add(cell.toString());
						System.out.print(cell.toString() + " ");
					}
					if (!rowdata.isEmpty())
						rowList.add(rowdata);
				}
				System.out.println();
				rowCount++;
			}
			System.out.println(rowheader);
			System.out.println(rowList);

			 createTable(rowheader);
			insertDataIntoTable(rowheader, rowList);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private static void insertDataIntoTable(List<String> rowheader, List<List<String>> rowList) throws SQLException {
		Connection conn = null;
		try {
			StringBuffer insertTableQuery = new StringBuffer();

			StringBuffer columnList = new StringBuffer();
			for (int i = 0; i < rowheader.size(); i++) {
				columnList.append(rowheader.get(i));
				if (i < rowheader.size() - 1)
					columnList.append(",");
			}

			conn = DatabaseConnection.getConnection();
			Statement stat = conn.createStatement();
			String insertQuery = "";
			for (int i = 0; i < rowList.size(); i++) {
				insertTableQuery = new StringBuffer();
				insertTableQuery.append("INSERT INTO " + JS_TABLE_NAME + "(").append(columnList).append(") VALUES(");
				for (int j = 0; j < rowList.get(i).size(); j++) {
					if (rowList.get(i).get(j) == null || rowList.get(i).get(j).isEmpty())
						insertTableQuery.append("");
					else
						insertTableQuery.append("'" + rowList.get(i).get(j) + "'");
					if (j < rowList.get(i).size() - 1)
						insertTableQuery.append(",");
				}
				insertQuery = insertTableQuery.toString();
				// insertQuery.substring(0, insertQuery.length()-1);
				insertQuery += ");";
				System.out.println(insertQuery);
				stat.execute(insertQuery);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			conn.close();
			System.out.println("Data Inserted!");
		}
	}

	private static void createTable(List<String> rowheader) throws SQLException {
		// create table USER
		StringBuffer createTableQuery = new StringBuffer();
		Connection conn = null;
		createTableQuery.append("CREATE TABLE " + JS_TABLE_NAME + " (");
		int i = 0;
		for (i = 0; i < rowheader.size() - 1; i++) {
			createTableQuery.append(rowheader.get(i)).append(" varchar(255), ");
		}
		if (i < rowheader.size())
			createTableQuery.append(rowheader.get(i)).append(" varchar(255)");
		createTableQuery.append(");");
		System.out.println(createTableQuery.toString());
		try {
			conn = DatabaseConnection.getConnection();
			Statement stat = conn.createStatement();
			stat.execute(createTableQuery.toString());
			System.out.println("Table Created!");
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			conn.close();
		}
	}
}
