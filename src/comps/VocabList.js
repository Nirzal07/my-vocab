import React, { useEffect, useState, useContext, createContext } from "react";
import { db } from "../Firebase/config";
import {
  collection,
  getDocs,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { searchText2 } from "../App";
import { AddForm } from "./AddForm";
import { EditVocab } from "./EditVocab";

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


export const VocabList = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [editForm, setEditForm] = useState(false)

  console.log(editForm)

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [vocab, setVocab] = useState([]);
  let [wordInfo, setWordInfo] = useState({});
  const search = useContext(searchText2);
  let today = new Date();
  let spacedRepitionVocab =
    vocab.length != 0
      ? vocab.filter((vocabItem) => {
          if (vocabItem.repition !== undefined) {
            for (let date of vocabItem.repition) {
              if (
                date.toDate().getDate() == today.getDate() &&
                date.toDate().getMonth() == today.getMonth() &&
                date.toDate().getFullYear() == today.getFullYear()
              ) {
                return vocabItem;
              }
            }
          }
        })
      : [];


  /*info of the word to edit are sent through this*/
  const setSpacedRepition = (id, repitionType) => {
    let year = today.getFullYear();
    let month = today.getMonth();
    let day = today.getDate();
    let repition = [];
    if (repitionType == "S") {
      repition = [
        new Date(year, month, day),
        new Date(year, month, day + 1),
        new Date(year, month, day + 3),
        new Date(year, month, day + 5),
      ];
    } else if (repitionType == "M") {
      repition = [
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      ];
    } else if (repitionType == "G") {
      repition = [
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      ];
    }

    const docRef = doc(db, "German", id);
    const updateFields = {
      repition: repition,
    };
    updateDoc(docRef, updateFields);
  };

  useEffect(() => {
    const vocabList = () => {
      /* line below captures all the docs inside the collection German */
      // const data = await getDocs(voacbRef);
      onSnapshot(voacbRef, (data) =>
        setVocab(() => {
          let vocabArray = data.docs
            .map((word) => ({
              ...word.data(),
              id: word.id,
            }))
            .reverse();
          if (search) {
            vocabArray = vocabArray.filter((w) => w.word.includes(search));
          }
          return vocabArray;
        })
      );
    };
    vocabList();
  }, [search]);

  const deleteVocab = async (id) => {
    const docRef = doc(db, "German", id);
    await deleteDoc(docRef);
  };

  return (
    <section className="vocab">
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="h5" align="right" component="div">
            Words For Today
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

            {spacedRepitionVocab.length != 0
              ? spacedRepitionVocab.map((word) => {
                  return (
                    <div>
                      <ul className="data-rw">
                        <li className="data-sn">
                          {spacedRepitionVocab.indexOf(word) + 1}
                        </li>
                        <li className="data-word">{word.word}</li>
                        <li className="data-meaning">{word.meaning}</li>
                        <li className="data-type">{word.type}</li>
                        <li className="data-edit">
                          <IconButton
                            onClick={() => {
                              setWordInfo(word);
                            }}
                            aria-label="delete"
                          >
                            <EditIcon onClick={()=> setEditForm(true)}/>
                          </IconButton>
                            {editForm && 
                            < AddForm importEditVocab = {wordInfo} openFormModal={editForm} setOpenFormModal={setEditForm} />
                            }
                          <IconButton
                            onClick={() => {
                              deleteVocab(word.id);
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
                                  setSpacedRepition(word.id, "S");
                                }}
                                color="secondary"
                              >
                                Simple
                              </Button>
                            </MenuItem>
                            <MenuItem>
                              <Button variant="contained" color="secondary">
                                Medium
                              </Button>
                            </MenuItem>
                            <MenuItem>
                              <Button variant="contained" color="secondary">
                                God
                              </Button>
                            </MenuItem>
                          </Menu>
                        </li>
                      </ul>
                      <ul className="data-details">
                        <li>{word.details && "- " + word.details}</li>
                      </ul>
                    </div>
                  );
                })
              : "No results found"}
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h5" align="right" component="div">
            All Words
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

            {vocab
              ? vocab.map((word) => {
                  return (
                    <div>
                      <ul className="data-rw">
                        <li className="data-sn">{vocab.indexOf(word) + 1}</li>
                        <li className="data-word">{word.word}</li>
                        <li className="data-meaning">{word.meaning}</li>
                        <li className="data-type">{word.type}</li>
                        <li className="data-edit">
                          <IconButton
                            onClick={() => {
                              setWordInfo(word);
                            }}
                            aria-label="delete"
                          >
                            <EditIcon />
                            {
                              wordInfo.word &&
                              < AddForm importEditVocab = {wordInfo} importSetEditVocab={setWordInfo} />
                            }
                          </IconButton>

                          <IconButton
                            onClick={() => {
                              deleteVocab(word.id);
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
                                  setSpacedRepition(word.id, "S");
                                }}
                                color="secondary"
                              >
                                Simple
                              </Button>
                            </MenuItem>
                            <MenuItem>
                              <Button variant="contained" color="secondary">
                                Medium
                              </Button>
                            </MenuItem>
                            <MenuItem>
                              <Button variant="contained" color="secondary">
                                God
                              </Button>
                            </MenuItem>
                          </Menu>
                        </li>
                      </ul>
                      <ul className="data-details">
                        <li>{word.details && "- " + word.details}</li>
                      </ul>
                    </div>
                  );
                })
              : "No results found"}
          </div>
        </AccordionDetails>
      </Accordion>
    </section>
  );
};
