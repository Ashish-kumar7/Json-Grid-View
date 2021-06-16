import "./JsonChecker.css";
import Navbar from "../../components/navbar/Navbar";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import global_var from "../../global_variable";

const JsonChecker = () => {
  const sampleObject = eval(global_var.json);

  const valuehandler = (e) => {
    console.log(e.plainText);
    console.log(e.markupText);
    console.log(e.json);
  };
  return (
    <div className="jsonchecker">
      <Navbar></Navbar>
      <JSONInput
        id="a_unique_id"
        placeholder={sampleObject}
        onChange={(event) => valuehandler(event)}
        locale={locale}
        height="550px"
      />
    </div>
  );
};

export default JsonChecker;
