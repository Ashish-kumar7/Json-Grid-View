package com.jsonparser.jsonparser.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jsonparser.jsonparser.exceltosql.JsonParser;

//RestController annotation is applied to a class to mark it as a request
//handler, and Spring will do the building and provide the RESTful web service at runtime.
@RestController
public class JsonParserController {

	//Handle the Get Request
	@GetMapping("/convert-json")
	public void convertJson() {
		try {
			JsonParser jsonParser = new JsonParser();
			//Name of the Json file which needs to be converted
			String jsonFile = "E:\\DBInternProject\\testing\\test1.json";
			
			//Pass the Json file name in the form of string as an argument into the jsonparser function.
			jsonParser.parseJson(jsonFile);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
