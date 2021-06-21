import unittest
import requests
import sys
import os
import json
from requests.api import head

class ApiTest(unittest.TestCase):
    API_URL = "http://127.0.0.1:5000/api/upload"

    STR_CONTENT_TYPE_EXCEL = "excel"
    STR_CONTENT_TYPE_CSV = "csv"
    STR_CONTENT_TYPE_HIVE = "hive"

    STR_URL_INPTYPE = "url"
    STR_URL = "https://api.github.com/users/hadley/orgs"

    STR_STRING_INPTYPE = "text"
    
    STR_JSON_1 = \
        """
        [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: {
        lat: '-37.3159',
        lng: '81.1496'
      }
    },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets'
    }
  }
]
        """
        
    STR_JSON_2 = \
        """
        {
	"_id_logsession" : "123",
	"create" : 
	{
		"records" : 
		[
			{
				”base_table_name" : "CONTACT",
				"id_field_name" : "___ID_t",
				"record_id" : "456"
			}
		]
	},
	"delete" : 
	{
		"records" : 
		[
			{
				"base_table_name" : "CONTACT",
				"record_id" : "789"
			}
		]
	},
	"update" : 
	{
		"records" : 
		[
			{
				"fields" : 
				[
					{
						"field_name_full" : "CONTACT_TEMP::x_field_5_g",
						"field_value" : "Test"
					}
				],
				"record_id" : "987"
			}
		]
	}
}
        """
        
    STR_INCORRECT_JSON_1 = \
        """
        
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: {
        lat: '-37.3159',
        lng: '81.1496'
      }
    },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets'
    }
  
]
        """
    STR_INCORRECT_JSON_2 = \
        """
        
            "name" : "Ash",
            "id" : "123"
        }
        """
        
    STR_INCORRECT_JSON_3 = \
        """
        [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: {
        lat: '-37.3159',
        lng: '81.1496'
      }
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets'
    }
  }
]
        """
    
    STR_INCORRECT_JSON_4 = \
        """
        {
            "name" : "Ash"
            "id" : "123",
        }
        """
    STR_INCORRECT_JSON_5 = \
        """
        [
  {
    id 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: {
        lat: '-37.3159',
        lng: '81.1496'
      }
    },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets'
    }
  }
]
        """
    
    STR_INCORRECT_JSON_6 = \
        """
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: {
        lat: '-37.3159',
        lng: '81.1496'
      }
    },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets'
    }
  }
]
        """
    
    STR_INCORRECT_JSON_7 = \
        """
        {
            "name" : "Ash",
            "id" : "123"
        }
        """
    
    STR_FILE_INPTYPE = "file"

    def test_valid_json_1(self):
        try:
            json_object = json.loads(ApiTest.STR_JSON_1)
        except ValueError as e:
            return False
        return True

    def test_valid_json_2(self):
        try:
            json_object = json.loads(ApiTest.STR_JSON_2)
        except ValueError as e:
            return False
        return True
    
    def test_invalid_json_1(self):
        try:
            json_object = json.loads(ApiTest.STR_INCORRECT_JSON_1)
        except ValueError as e:
            print(e)
            return False
        return True
    
    def test_invalid_json_2(self):
        try:
            json_object = json.loads(ApiTest.STR_INCORRECT_JSON_2)
        except ValueError as e:
            print(e)
            return False
        return True
    
    def test_invalid_json_3(self):
        try:
            json_object = json.loads(ApiTest.STR_INCORRECT_JSON_3)
        except ValueError as e:
            print(e)
            return False
        return True
    
    def test_invalid_json_4(self):
        try:
            json_object = json.loads(ApiTest.STR_INCORRECT_JSON_4)
        except ValueError as e:
            print(e)
            return False
        return True
    
    def test_invalid_json_5(self):
        try:
            json_object = json.loads(ApiTest.STR_INCORRECT_JSON_5)
        except ValueError as e:
            print(e)
            return False
        return True
    
    def test_invalid_json_6(self):
        try:
            json_object = json.loads(ApiTest.STR_INCORRECT_JSON_6)
        except ValueError as e:
            print(e)
            return False
        return True
    
    def test_invalid_json_7(self):
        try:
            json_object = json.loads(ApiTest.STR_INCORRECT_JSON_7)
        except ValueError as e:
            print(e)
            return False
        return True
    
    def test_string_URL_Excel(self):
        r = requests.post(ApiTest.API_URL, data=dict(
            content_type=ApiTest.STR_CONTENT_TYPE_EXCEL, input_type=ApiTest.STR_URL_INPTYPE, Url=ApiTest.STR_URL))
        self.assertEqual(r.status_code, 200)

    def test_string_URL_CSV(self):
        r = requests.post(ApiTest.API_URL, data=dict(
            content_type=ApiTest.STR_CONTENT_TYPE_CSV, input_type=ApiTest.STR_URL_INPTYPE, Url=ApiTest.STR_URL))
        self.assertEqual(r.status_code, 200)

    def test_string_URL_HIVE(self):
        r = requests.post(ApiTest.API_URL, data=dict(
            content_type=ApiTest.STR_CONTENT_TYPE_HIVE, input_type=ApiTest.STR_URL_INPTYPE, Url=ApiTest.STR_URL))
        self.assertEqual(r.status_code, 200)

    def test_string_JSON_CSV(self):
        r = requests.post(ApiTest.API_URL, data=dict(content_type=ApiTest.STR_CONTENT_TYPE_CSV, input_type=ApiTest.STR_STRING_INPTYPE, Json=ApiTest.STR_JSON_1))
        self.assertEqual(r.status_code, 200)

    def test_string_JSON_HIVE(self):
       r = requests.post(ApiTest.API_URL, data=dict(content_type=ApiTest.STR_CONTENT_TYPE_HIVE,input_type=ApiTest.STR_STRING_INPTYPE, Json=ApiTest.STR_JSON_1))
       self.assertEqual(r.status_code, 200)
