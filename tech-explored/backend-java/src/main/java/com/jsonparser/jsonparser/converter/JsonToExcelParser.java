package com.jsonparser.jsonparser.converter;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class JsonToExcelParser {

	HSSFWorkbook workBook = new HSSFWorkbook();
	HSSFSheet sheet = workBook.createSheet();
	HSSFRow row;
	
	public int col;

	public HSSFRow getRow() {
		return row;
	}

	public void setRow(HSSFRow row) {
		this.row = row;
	}

	public void excelproccessing(ArrayList arr, HSSFSheet sheet, String prev_key) {

		if (col < 20) {
			int j = 0;
			for (int i = 0; i < arr.size(); i++) {
				// if (col != 0) {
				// jsexcel.row = jsexcel.sheet.getRow(0);
				// jsexcel.row = jsexcel.sheet.getRow(1);
				// }
				row = sheet.getRow(j);
				if (row == null) {
					sheet.createRow(j);
					row = sheet.getRow(j);
				}

				if (i == 0) {
					if (prev_key.equalsIgnoreCase("") || prev_key.equals(null)) {
						row.createCell(col).setCellValue((String) arr.get(i));
					} else {
						row.createCell(col).setCellValue(prev_key);
					}
				} else {
					row.createCell(col).setCellValue((String) arr.get(i));
				}
				j++;
			}
			col = col + 1;
			// System.out.println("a::" + a);
		}
	}

	public void arrayexcelprocessing(org.json.simple.JSONArray jsonarr, HSSFSheet sheet, String prev_key) {
		int j = 0;

		for (int i = 0; i < jsonarr.size(); i++) {

//			row = sheet.getRow(j);
//			if (row == null) {
//				sheet.createRow(j);
//				row = sheet.getRow(j);
//			}
//			row.createCell(col).setCellValue(jsonarr.get(i).toString());
//			j++;
			org.json.simple.JSONObject jsonObject = (org.json.simple.JSONObject) jsonarr.get(i);
			for (Iterator iterator = jsonObject.keySet().iterator(); iterator.hasNext();) {
				String key = (String) iterator.next();
				System.out.println("the level2 keys: " + key);
				Object obj = jsonObject.get(key);
				if (obj instanceof JSONArray) {
					org.json.simple.JSONArray jsonarr1 = (org.json.simple.JSONArray) obj;

					arrayexcelprocessing(jsonarr1, sheet, prev_key.concat("/").concat(key));
				} else if (obj instanceof JSONObject) {
					for (iterator = ((org.json.simple.JSONObject) obj).keySet().iterator(); iterator.hasNext();) {
						String key1 = (String) iterator.next();
						Object obj1 = ((org.json.simple.JSONObject) obj).get(key1);
						ArrayList<String> arr = new ArrayList<String>();
						// String FileName = "json.csv";
						arr.add(key1);

						arr.add(String.valueOf(obj1));
						if (col < 20) {
							excelproccessing(arr, sheet, prev_key.concat("/").concat(key1));
						}
					}
					System.out.println("obj" + obj.toString());
				} else {
					ArrayList<String> arr = new ArrayList<String>();
					// String FileName = "json.csv";
					arr.add(key);
					arr.add(String.valueOf(obj));
					if (col < 20) {
						excelproccessing(arr, sheet, prev_key.concat("/").concat(key));
					}
				}
			}
		}
	}

	public static void main(String[] args) throws IOException, ParseException {
		JsonToExcelParser jsexcel = new JsonToExcelParser();

		JSONParser parser = new JSONParser();
		org.json.simple.JSONObject jsonObject = (org.json.simple.JSONObject) parser
				.parse(new FileReader("E://DBInternProject//testing//daibetes.json"));
		for (Iterator iterator = jsonObject.keySet().iterator(); iterator.hasNext();) {

			String key = (String) iterator.next();
			System.out.println("the level1 keys: " + key);
			Object obj = jsonObject.get(key);

			if (obj instanceof JSONArray) {
				org.json.simple.JSONArray jsonarr = (org.json.simple.JSONArray) obj;
				jsexcel.arrayexcelprocessing(jsonarr, jsexcel.sheet, key);
			} else if (obj instanceof JSONObject) {
				org.json.simple.JSONObject jo = (org.json.simple.JSONObject) obj;
			} else {
				ArrayList<String> arr = new ArrayList<String>();
				// String FileName = "json.csv";
				arr.add(key);
				arr.add(obj.toString());
				jsexcel.excelproccessing(arr, jsexcel.sheet, "");
			}
		}
		FileOutputStream out = new FileOutputStream(
				new File("E://DBInternProject//testing//new1.xls"));

		jsexcel.workBook.write(out);
		out.close();
	}
}