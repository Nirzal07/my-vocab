import React, { useEffect, useState, useContext, createContext } from "react";
import { db } from "../../Firebase/config";
import {
  collection,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { searchText } from "../Search";
import { AddForm } from "../AddForm";
import { EditVocab } from "../EditVocab";

/*Mateiral UI */
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Menu from "@mui/material/Menu";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";

export const voacbRef = collection(db, "German");

export const VocabList = ({ title, vocabList }) => {
  const [editForm, setEditForm] = useState(false);
  let [wordInfo, setWordInfo] = useState({});

  /*for accordion*/
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  /*end of for accordion*/

  const deleteVocab = async (id) => {
    const docRef = doc(db, "German", id);
    await deleteDoc(docRef);
  };

  /* for spaced Repition*/
  let today = new Date();
  const setSpacedRepition = (id, repitionType) => {
    /**/
    let year = today.getFullYear();
    let month = today.getMonth();
    let day = today.getDate();
    
    let repition = [];
    if (repitionType == "S") {
      repition = [
        new Date(year, month, day + 1),
        new Date(year, month, day + 4),
        new Date(year, month, day + 10),
      ];
    } else if (repitionType == "M") {
      repition = [
        new Date(year, month, day),
        new Date(year, month, day + 2),
        new Date(year, month, day + 3),
        new Date(year, month, day + 5),
        new Date(year, month, day + 8),
      ];
    } else if (repitionType == "G") {
      repition = [
        new Date(year, month, day),
        new Date(year, month, day + 1),
        new Date(year, month, day + 2),
        new Date(year, month, day + 3),
        new Date(year, month, day + 5),
        new Date(year, month, day + 8),
        new Date(year, month, day + 10),
        new Date(year, month, day + 15),
      ];
    }

    const docRef = doc(db, "German", id);
    console.log(id)

    const updateFields = {
      repition: repition,
    };
    updateDoc(docRef, updateFields);
  };
  /* end of for spaced Repition*/

  const vocabBackgroundColorizer = (id) => {
    var IDModDivision = id%4
    if (IDModDivision==1){
      return '#14FF87'
    } else if (IDModDivision==2){
      return '#FFFF15'
    } else if (IDModDivision==3){
      return '#00FFEF'
    } else if (IDModDivision==0){
      return '#FF3577'
    } 
  }

  return (
    <section>
      <Accordion defaultExpanded={title == 'Words For Today' && true} style={{width:80 + 'vw'}} >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="h5" align="right" component="div">
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="sort-by">
            <button>Latest</button>
          </div>
          <div className="vocab-list">
            <ul className="data-rw">
              <li className="data-sn">S.N</li>
              <li className="data-word">Word/Phrase</li>
              <li className="data-meaning">Meaning</li>
              <li className="data-type">Type</li>
              <li className="data-edit"></li>
            </ul>

            {vocabList.length != 0
              ? vocabList.map((vocabItem) => {
                  return (
                    <div className='vocab-item' style={{backgroundColor:vocabBackgroundColorizer(vocabList.indexOf(vocabItem) + 1)}}>
                      <ul className="data-rw">
                        <li className="data-sn">
                          {vocabList.indexOf(vocabItem) + 1}
                        </li>
                        <li className="data-word">{vocabItem.word}</li>
                        <li className="data-meaning">{vocabItem.meaning}</li>
                        <li className="data-type">{vocabItem.type}</li>
                        <li className="data-edit">
                          <IconButton
                            onClick={() => {
                              setWordInfo(vocabItem);
                            }}
                            aria-label="delete"
                          >
                            <EditIcon onClick={() => setEditForm(true)} />
                          </IconButton>

                          <IconButton
                            onClick={() => {
                              console.log(vocabItem.id)
                              deleteVocab(vocabItem.id);
                            }}
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>

                          <Button
                            id="basic-button"
                            aria-controls="basic-menu"
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                          >
                            <AlarmOnIcon />
                          </Button>
                          <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                              "aria-labelledby": "basic-button",
                            }}
                          >
                            <MenuItem>
                              <Button
                                variant="contained"
                                onClick={() => {
                                  setSpacedRepition(vocabItem.id, "S");
                                }}
                                color="secondary"
                              >
                                Simple
                              </Button>
                            </MenuItem>
                            <MenuItem>
                              <Button 
                              variant="contained" 
                              color="secondary"
                              onClick={() => {
                                setSpacedRepition(vocabItem.id, "M");
                              }}
                              >
                                Medium
                              </Button>
                            </MenuItem>
                            <MenuItem>
                              <Button 
                              variant="contained" 
                              color="secondary"
                              onClick={() => {
                                console.log(vocabItem)
                                setSpacedRepition(vocabItem.id, "G");
                              }}
                              >
                                God
                              </Button>
                            </MenuItem>
                          </Menu>
                        </li>
                      </ul>
                      <ul className="data-details">
                        <li>{vocabItem.details && "- " + vocabItem.details}</li>
                      </ul>
                    </div>
                  );
                })
              : "No results found"}
          </div>
        </AccordionDetails>
      </Accordion>
      {editForm && (
        <AddForm
          importEditVocab={wordInfo}
          openFormModal={editForm}
          setOpenFormModal={setEditForm}
        />
      )}
    </section>
  );
};
