import './App.css';
import { AddForm } from './comps/AddForm';
import { Search } from './comps/Search';
import { Vocab } from './comps/vocab/Vocab';
import React,{ useState, createContext, useContext }  from 'react';
import { searchText } from './comps/Search';

const search = useContext(searchText);
function App() {
  // const [editWord, setEditWord] = useState('');
  // const [editMeaning, setEditMeaning] = useState('');
  // var [editType, setEditType] = useState('');
  // const [editDetails, setEditDetails] = useState('');

  return (
    <div className="App">
      <searchText.Provider value={search}>
      < Search/>
      
      < Vocab/>

      </searchText.Provider>
    </div>
  );
}

export default App
