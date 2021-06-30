import Button from "../button/Button";
import "./Editor.css";

const Editor = (props) => {
  return (
    <div className="editor">
      <textarea onChange={props.onChange} rows="22" cols="80" type="text" />
      {props.process ? (
        <Button
          title={"Customize"}
          classId={"downloadButton"}
          clickFunc={props.click}
        ></Button>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Editor;
