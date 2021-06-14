package com.jsonparser.jsonparser.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jsonparser.jsonparser.exceltosql.JsonParser;

@RestController
public class JsonParserController {

	@GetMapping("/convert-json")
	public void convertJson() {
		try {
			JsonParser jsonParser = new JsonParser();
			String jsonFile = "E:\\DBInternProject\\testing\\test1.json";
			jsonParser.parseJson(jsonFile);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
