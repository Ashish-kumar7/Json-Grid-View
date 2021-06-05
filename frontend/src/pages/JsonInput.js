import FileUrlLayout from "../components/FileUrlLayout";
import Navbar from "../components/Navbar";
import "./JsonInput.css";
import { useState } from "react";

const JsonInput = () => {
    const [inputJson, setInputJson] = useState();

  const changeHandler = (e) => {
    setInputJson(e.target.value);
  };

  const handleSubmission = () => {
    const formData = new FormData();
    formData.append("Json", inputJson);
    formData.set("input_type", "text");
    console.log(inputJson);
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
    <div className="jsonInput">
      <Navbar></Navbar>
      <div>
        <textarea rows="10" cols="10" type="text" onChange={changeHandler} />

        <button onClick={handleSubmission}>Submit</button>
      </div>
      <FileUrlLayout></FileUrlLayout>
    </div>
  );
};

export default JsonInput;
