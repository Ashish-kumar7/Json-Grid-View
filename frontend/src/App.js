
// import './App.css';
import {Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import OptionsPage from './pages/OptionsPage';
import FileUpload from './pages/FileUpload';
import Footer from './components/Footer'
import FileUrl from './pages/FileUrl'
import JsonInput from './pages/JsonInput'

function App() {
  return (
    <div>
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
