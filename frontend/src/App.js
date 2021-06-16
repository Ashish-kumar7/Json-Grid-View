
import { Route } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage';
import OptionsPage from './pages/optionpage/OptionsPage';
import FileUpload from './pages/fileupload/FileUpload';
import Footer from './components/footer/Footer'
import Footer2 from './components/footer2/Footer2'
import FileUrl from './pages/fileurl/FileUrl'
import JsonInput from './pages/jsoninput/JsonInput'
import SelectedValues from './components/selectedvaluespreview/SelectedValues'
import PreviewPage from './pages/previewpage/PreviewPage';
<<<<<<< HEAD
import JsonChecker from './pages/jsonchecker/JsonChecker';
=======
import QueryPage from './pages/querypage/QueryPage';
>>>>>>> 9daf4e61bebcec0d09d8134f78fc17a6fe1e408c

function App() {
  return (
    <div>
        <Route path='/preview'><PreviewPage /></Route>
        <Route path="/jsonchecker"><JsonChecker/></Route>
        <Route path='/footer'><Footer /></Route>
        <Route path='/selected'><SelectedValues /></Route>
        <Route  exact path="/" ><HomePage /></Route>
        <Route path="/options"><OptionsPage/></Route>
        <Route path="/file-upload"><FileUpload /></Route>
        <Route path="/file-url"><FileUrl /></Route>
        <Route path="/json-input"><JsonInput /></Route>
        <Route path="/query-page"><QueryPage /></Route>
    </div>

  );
}

export default App;
