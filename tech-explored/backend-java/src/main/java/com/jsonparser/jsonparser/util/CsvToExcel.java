package com.jsonparser.jsonparser.util;

import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;

import org.apache.commons.lang.math.NumberUtils;
import org.apache.log4j.Logger;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

import com.opencsv.CSVReader;

public class CsvToExcel {

	public static final char FILE_DELIMITER = ',';
	public static final String FILE_EXTN = ".xlsx";
	public static final String FILE_NAME = "test1";

	public static String convertCsvToXls(String xlsFileLocation, String csvFilePath) {
//		SXSSFSheet extends java.lang.Object implements Sheet
		SXSSFSheet sheet = null;
//		CSVReader class provides the operations to read the CSV file as a list of String array.
		CSVReader reader = null;
//		Workbook is the representation of a Spreadsheet.
		Workbook workBook = null;
		
		String generatedXlsFilePath = "";
//		FileOutputStream Creates a file output stream to write to the specified 
//		file descriptor, which represents an existing connection to an actual file in the file system.
		FileOutputStream fileOutputStream = null;

		try {
			String[] nextLine;
			reader = new CSVReader(new FileReader(csvFilePath), FILE_DELIMITER);
			workBook = new SXSSFWorkbook();
			sheet = (SXSSFSheet) workBook.createSheet("Sheet");

			int rowNum = 0;
			
			while ((nextLine = reader.readNext()) != null) {
				//create a new row and put cells into it.
				Row currentRow = sheet.createRow(rowNum++);
				for (int i = 0; i < nextLine.length; i++) {
					//check if it is a digit or a number or a string and insert into cell accordingly.
					if (NumberUtils.isDigits(nextLine[i])) {
						currentRow.createCell(i).setCellValue(Integer.parseInt(nextLine[i]));
					} else if (NumberUtils.isNumber(nextLine[i])) {
						currentRow.createCell(i).setCellValue(Double.parseDouble(nextLine[i]));
					} else {
						currentRow.createCell(i).setCellValue(nextLine[i]);
					}
				}
			}

			generatedXlsFilePath = xlsFileLocation + FILE_NAME + FILE_EXTN;
			System.out.println("The File Is Generated At The Following Location= " + generatedXlsFilePath);

			fileOutputStream = new FileOutputStream(generatedXlsFilePath.trim());
			workBook.write(fileOutputStream);
		} catch (Exception exObj) {
			System.out.println("Exception In convertCsvToXls() Method=  " + exObj);
		} finally {
			try {
				workBook.close();
				fileOutputStream.close();
				reader.close();
			} catch (IOException ioExObj) {
				System.out.println("Exception While Closing I/O Objects In convertCsvToXls() Method=  " + ioExObj);
			}
		}

		return generatedXlsFilePath;
	}
}