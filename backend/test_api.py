import unittest
import requests

class ApiTest(unittest.TestCase):
    API_URL = "http://127.0.0.1:5000/api/upload"

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

    def test_string_URL(self):
        r = requests.post(ApiTest.API_URL, data = dict(input_type=ApiTest.STR_URL_INPTYPE, Url=ApiTest.STR_URL))
        self.assertEqual(r.status_code, 200)
        

    def test_string_JSON(self):
        r = requests.post(ApiTest.API_URL, data = dict(input_type=ApiTest.STR_STRING_INPTYPE, Json=ApiTest.STR_JSON))
        self.assertEqual(r.status_code, 200)