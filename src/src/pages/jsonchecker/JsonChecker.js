import { useState } from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import Button from "../../components/button/Button";
import Navbar from "../../components/navbar/Navbar";
import "./JsonChecker.css";
import Footer from "../../components/footer/Footer"
var FileDownload = require("js-file-download");

const JsonChecker = () => {

  const sampleObject = [
    {
      "id": 1,
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "Sincere@april.biz",
      "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874",
        "geo": {
          "lat": "-37.3159",
          "lng": "81.1496"
        }
      },
      "phone": "1-770-736-8031 x56442",
      "website": "hildegard.org",
      "company": {
        "name": "Romaguera-Crona",
        "catchPhrase": "Multi-layered client-server neural-net",
        "bs": "harness real-time e-markets"
      }
    }

  ];

  const [downloadContent, setDownloadContent] = useState("Edit the file than download");

  const valuehandler = (e) => {
    // console.log(e.plainText);
    // console.log(e.markupText);
    console.log(e.json);
    setDownloadContent(e.json);
  };

  // download content
  const downloadFile = () => {
    try {
      JSON.parse(downloadContent);
      FileDownload(downloadContent, "UploadedFile.json");
    } catch (e) {
      alert("Invalid JSON!!");
    }
  };

  return (
    <div className="jsonchecker">

      <Navbar></Navbar>
      <h2>Correct Your JSON & Save and Download it into a new file</h2>
      <div className="checker">
        <JSONInput

          id="a_unique_id"
          placeholder={sampleObject}
          onChange={(event) => valuehandler(event)}
          locale={locale}
          height="418px"
          width="120vh"


        />

      </div>
      <Button title={"Download"}
        classId={"downloadButton"}
        clickFunc={downloadFile}></Button>
      <Footer />
    </div>
  );
};

export default JsonChecker;
