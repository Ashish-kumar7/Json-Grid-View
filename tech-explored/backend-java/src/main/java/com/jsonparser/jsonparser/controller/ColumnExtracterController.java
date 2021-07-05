package com.jsonparser.jsonparser.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.jsonparser.jsonparser.model.Pair;

@RestController
public class ColumnExtracterController {

	List<Pair> jsonForTable = new ArrayList<>();
	List<List<Pair>> completeList = new ArrayList<>();

	@PostMapping(value = "/test")
	public void saveData(@RequestBody String jsonStr) {
		jsonForTable.clear();
		System.out.println("Input:" + jsonStr);
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(jsonStr);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		System.out.println("JSON: " + jsonObject);

		// Iterator<?> keys = jsonObject.keys();
		// System.out.println("JSON Keys: " + keys);
		// Set<String> keySet = new HashSet<>();

		handleJSONObject(jsonObject, "");

		// while (keys.hasNext())
		// System.out.println((String) keys.next());

		System.out.println("jsonForTable: ");
		for (int i = 0; i < jsonForTable.size(); i++) {
			System.out.println(jsonForTable.get(i).getX() + " " + jsonForTable.get(i).getY());
		}
		// List<Map<String, String> > mp = new ArrayList<>();
		// getAllKeysForTable(jsonObject, mp);
	}

	private void handleJSONArray(JSONArray jsonArray, String lastStr) {
		try {
			for (int i = 0; i < jsonArray.length(); i++) {
				String jsonString;
				jsonString = jsonArray.get(i).toString();

				JSONObject jsonObj = new JSONObject(jsonString);
				handleValue(jsonObj, lastStr);
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}

	private void handleValue(Object value, String lastStr) {
		if (value instanceof JSONObject) {
			handleJSONObject((JSONObject) value, lastStr);
		} else if (value instanceof JSONArray) {
			handleJSONArray((JSONArray) value, lastStr);
		} else {
			System.out.println("Value: " + value);
			jsonForTable.add(new Pair(lastStr, value.toString()));
		}
	}

	@SuppressWarnings("unchecked")
	private void handleJSONObject(JSONObject jsonObject, String lastStr) {
		jsonObject.keys().forEachRemaining(key -> {
			Object value;
			try {
				value = jsonObject.get((String) key);
				if (lastStr == null || lastStr.isEmpty()) {
					System.out.println("Key: " + key);
					handleValue(value, key.toString());
				} else {
					System.out.println("Key: " + lastStr + "_" + key);
					handleValue(value, lastStr + "_" + key.toString());
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		});
	}

	private void getAllKeysForTable(JSONObject jsonObject, Set<String> keySet) {
		// handleJSONObject(jsonObject);
	}

}