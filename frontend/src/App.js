
import {Route} from 'react-router-dom';
import HomePage from './pages/homepage/HomePage';
import OptionsPage from './pages/optionpage/OptionsPage';
import FileUpload from './pages/fileupload/FileUpload';
import Footer from './components/footer/Footer'
import FileUrl from './pages/fileurl/FileUrl'
import JsonInput from './pages/jsoninput/JsonInput'
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
