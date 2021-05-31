// import './App.css';
import { AddURL } from './MyComponents/AddURL';
import { AddJSON } from './MyComponents/AddJSON';
import { Header } from './MyComponents/Header';
import { About } from './MyComponents/About';
import AddFile from './MyComponents/AddFile';

function App() {
  return (
    <>
        <Header title="Json Grid Viewer"/>
        <About />
        <AddURL/>
        <AddJSON />
        <AddFile />
    </>
  );
}

export default App;
