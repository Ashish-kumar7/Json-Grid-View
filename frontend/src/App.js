  
import { Route } from "react-router-dom";
import HomePage from "./pages/homepage/HomePage";
import OptionsPage from "./pages/optionpage/OptionsPage";
import FileUpload from "./pages/fileupload/FileUpload";
import FileUrl from "./pages/fileurl/FileUrl";
import JsonInput from "./pages/jsoninput/JsonInput";
import JsonChecker from "./pages/jsonchecker/JsonChecker";
import NewPreview from "./pages/newpreview/NewPreviewPage";

function App() {
  return (
    <div>
      <Route path="/jsonchecker">
        <JsonChecker />
      </Route>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/options">
        <OptionsPage />
      </Route>
      <Route path="/file-upload">
        <FileUpload />
      </Route>
      <Route path="/file-url">
        <FileUrl />
      </Route>
      <Route path="/json-input">
        <JsonInput />
      </Route>
      <Route path="/newpreview">
        <NewPreview></NewPreview>
      </Route>
    </div>
  );
}

export default App;