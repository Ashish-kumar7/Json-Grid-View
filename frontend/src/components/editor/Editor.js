import Button from '../button/Button'
import './Editor.css'


const Editor = (props) => {
  return (
    <div className="editor">
      <h2>Insert the Custom Json here</h2>
      <textarea onChange={props.onChange} rows="16" cols="80" type="text" />
      {props.process ?
        (<Button title={"Customize"} classId={"processButton"} clickFunc={props.click}></Button>
        ) : <p></p>
      }
    </div>

  );
};

export default Editor;
