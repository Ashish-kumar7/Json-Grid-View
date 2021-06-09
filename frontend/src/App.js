
import {Route} from 'react-router-dom';
import HomePage from './components/homepage/HomePage';
import OptionsPage from './components/optionpage/OptionsPage';
import FileUpload from './components/fileupload/FileUpload';
import Footer from './components/footer/Footer'
import FileUrl from './components/fileurl/FileUrl'
import JsonInput from './components/jsoninput/JsonInput'
import Editor from './components/editor/Editor'

function App() {
  return (
    <div>
        <Route path='/editor'><Editor></Editor></Route>
        <Route path='/footer'><Footer></Footer></Route>
        <Route  path="/home" ><HomePage /></Route>
        <Route path="/options"><OptionsPage/></Route>
        <Route path="/file-upload"><FileUpload /></Route>
        <Route path="/file-url"><FileUrl /></Route>
        <Route path="/json-input"><JsonInput /></Route>
    </div>
    
  );
}

export default App;
