import Button from '../button/Button'
import './Editor.css'


const Editor = (props) => {
  return (
    <div className ="editor">
    <textarea  onChange={props.onChange} rows="25" cols="80" type="text"  />
    <Button title={"Process"} class={"processButton"}></Button>
    
  </div> 
    
  );
};

export default Editor;
