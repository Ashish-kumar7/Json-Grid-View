// import './App.css';
import React, { useState ,useEffect } from 'react';
import { AddURL } from './MyComponents/AddURL';
import { AddJSON } from './MyComponents/AddJSON';
import { Header } from './MyComponents/Header';
import { About } from './MyComponents/About';
// import AddNewFile from './MyComponents/AddNewFile';
function App() {
  return (
    <>
      {/* <Router> */}
        <Header title="Json Grid Viewer"/>
        <About />
        <AddURL/>
        <AddJSON />
        {/* <AddNewFile /> */}
    </>
  );
}

export default App;
