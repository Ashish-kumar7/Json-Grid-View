import unittest
import requests
import sys


class ApiTest(unittest.TestCase):
    API_URL = "http://127.0.0.1:5000/api/upload"

    STR_CONTENT_TYPE_EXCEL = "excel"
    STR_CONTENT_TYPE_CSV = "csv"
    STR_CONTENT_TYPE_HIVE = "hive"

    STR_URL_INPTYPE = "url"
    STR_URL = "https://api.github.com/users/hadley/orgs"

    STR_STRING_INPTYPE = "text"
    STR_JSON = \
        """
        {
            "name" : "Ash",
            "id" : "123"
        }
        """

    STR_FILE_INPTYPE = "file"

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

    def test_string_JSON_EXCEL(self):
        r = requests.post(ApiTest.API_URL, data=dict(content_type=ApiTest.STR_CONTENT_TYPE_EXCEL,
                                                     input_type=ApiTest.STR_STRING_INPTYPE, Json=ApiTest.STR_JSON))
        self.assertEqual(r.status_code, 200)

    def test_string_JSON_CSV(self):
        r = requests.post(ApiTest.API_URL, data=dict(content_type=ApiTest.STR_CONTENT_TYPE_CSV,
                                                     input_type=ApiTest.STR_STRING_INPTYPE, Json=ApiTest.STR_JSON))
        self.assertEqual(r.status_code, 200)

    def test_string_JSON_HIVE(self):
        r = requests.post(ApiTest.API_URL, data=dict(content_type=ApiTest.STR_CONTENT_TYPE_HIVE,
                                                     input_type=ApiTest.STR_STRING_INPTYPE, Json=ApiTest.STR_JSON))
        self.assertEqual(r.status_code, 200)
