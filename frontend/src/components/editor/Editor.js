import Button from '../button/Button'
import './Editor.css'


const Editor = (props) => {
  return (
    <div className="editor">
      <textarea onChange={props.onChange} rows="25" cols="80" type="text" />
      {props.process ?
        (<Button title={"Process"} classId={"processButton"} clickFunc={props.click}></Button>
        ) : <p></p>
      }
    </div>

  );
};

export default Editor;
