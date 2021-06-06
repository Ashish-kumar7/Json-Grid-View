import FileUrlLayout from "../components/FileUrlLayout";
import Navbar from "../components/Navbar";
import "./FileUrl.css";
import { useState } from "react";


const FileUrl = () => {
  const [inputUrl, setInputUrl] = useState();
  

  const changeHandler = (e) => {
    setInputUrl(e.target.value);
  };

  const handleSubmission = () => {
    const formData = new FormData();
    formData.append("Url", inputUrl);
    formData.set("input_type", "url");
    console.log(inputUrl);
    console.log(formData);
    fetch("http://localhost:5000/api/upload", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success", result);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };
  return (
    <div className="fileUrl">
      <Navbar></Navbar>
      <div>
        <input type="text" onChange={changeHandler} />

        <button onClick={handleSubmission}>Submit</button>
      </div>
      <FileUrlLayout></FileUrlLayout>
    </div>
  );
};

export default FileUrl;
