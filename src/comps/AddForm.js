import React, { useState, useEffect, useContext } from "react";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/config";
import { voacbRef } from "./vocab/Vocab";

/*Material UI*/
import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'black',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export const AddForm = ({ importEditVocab,
  importSetEditVocab, openFormModal, setOpenFormModal }) => {
  
  // setOpen(()=>{return openModal && true})

  /* for component */
  const [editForm, setEditForm] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [meaning, setMeaning] = useState("");
  var [type, setType] = useState("");
  const [details, setDetails] = useState("");

useEffect(()=>{
  setDetails((prevState)=>{
    if (!editForm && type=="Verb"){
      return `
  Er:
  Präteritum: 
  Perfekt:
  `
    }
    else {
      return ''
    }
  })  
},[type])

  useEffect(() => {
    setEditForm((prevState) => {
      return importEditVocab.word && true;
    });
    setNewWord((prevState) => {
      return importEditVocab.word && importEditVocab.word;
    });
    setMeaning((prevState) => {
      return importEditVocab.meaning && importEditVocab.meaning;
    });
    setType((prevState) => {
      return importEditVocab.type && importEditVocab.type;
    });
    setDetails((prevState) => {
      return importEditVocab.details && importEditVocab.details;
    });
  }, [importEditVocab.word]);

  const addWord = async (e) => {
    if (!type) {
      type = "---";
    }
    if (newWord !== "" && 
    meaning !== '' &&
    meaning !== undefined &&
    newWord !== undefined &&
    type !== undefined &&
    details !== undefined 
    ) {
      await addDoc(voacbRef, {
        
        word: newWord,
        meaning: meaning,
        type: type,
        details: details,
        addedOn: new Date()
      });
      setNewWord("");
      setMeaning("");
      setType("");
      setDetails("");
    }

  };

  const updateWord = async () => {
    if (editForm) {
      const docRef = doc(db, "German", importEditVocab.id);
      const updateFields = {
        word: newWord,
        meaning: meaning,
        type: type,
        details: details,
      };
      await updateDoc(docRef, updateFields);
    }
    setNewWord("");
    setMeaning("");
    setType("");
    setDetails("");
    setEditForm(false);
  };

  const cancelUpdateWord = () => {
    setNewWord("");
    setMeaning("");
    setType("");
    setDetails("");
    setEditForm(false);
  };

  return (
    <section>
       {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={openFormModal}
        onClose={()=>{ 
          if (setOpenFormModal==undefined) {
              return false
          } else return setOpenFormModal(false); 
        }
        }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography variant="h6" color='paper' align="center" component="div"> Add a new word/phrase</Typography>

{/* <button onClick={showButton}>New Word/Phrase</button> */}
<form className={"add-form"} onSubmit={(e) => e.preventDefault()}>


      <OutlinedInput
        size="small"
        style={{
          background: "white",
          borderRadius: 15 + "px",
          marginBottom: 10 + "px",
          width: 100 + "%",
        }}
        defaultValue=""
        value={newWord}
        onChange={(e) => setNewWord(e.target.value)}
        placeholder="Word/Phrase"
      />
      <OutlinedInput
        size="small"
        style={{
          background: "white",
          marginBottom: 10 + "px",
          borderRadius: 15 + "px",
          width: 100 + "%",
        }}
        value={meaning}
        onChange={(e) => setMeaning(e.target.value)}
        placeholder="Meaning"
      />



<InputLabel style={{color: 'white'}} id="demo-simple-select-label">Type(opt)</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    label="Age"
    placeholder='Age'
    size='small'
    style={{
      background: "white",
      marginBottom: 10 + "px",
      color: 'black',
      borderRadius: 15 + "px",
      width: 100 + "%",
      
    }}
    displayEmpty
    defaultValue="Noun"
    value={type}
    onChange={(e) => setType(e.target.value)}
  >
    <MenuItem value="">
      <em>None</em>
    </MenuItem>
    <MenuItem value='Verb'>Verb</MenuItem>
    <MenuItem value="Noun">Noun</MenuItem>
    <MenuItem value="Adjective">Adjective</MenuItem>
    <MenuItem value="Others">Others</MenuItem>

  </Select>
 
  <TextField
    id="outlined-textarea"
    style={{
      background: "white",
      marginBottom: 10 + "px",
      borderRadius: 15 + "px",
      width: 100 + "%",
    }}
    value={details}
    onChange={(e) => setDetails(e.target.value)}
    placeholder="Additional Details(Opt)"
    multiline
  />

  {editForm ? (
    <div>
      <button onClick={cancelUpdateWord}>Cancel</button>
      <button type="submit" onClick={updateWord}>
        Update
      </button>
    </div>
  ) : (
    <button type="submit" onClick={addWord}>
      Add
    </button>
  )}
</form>
        </Box>
      </Modal>

    </section>
  );
};
