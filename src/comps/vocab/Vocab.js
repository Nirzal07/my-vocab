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
import {VocabList} from './VocabList'
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


export const Vocab = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [editForm, setEditForm] = useState(false)
  const [vocab, setVocab] = useState([]);
  let [wordInfo, setWordInfo] = useState({});
  const search = useContext(searchText);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };





  useEffect(() => {
    /*grabs all the vocab from database and adds them to vocab object*/
    /*also handels search*/
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
  
  }, [search]);

  const deleteVocab = async (id) => {
    const docRef = doc(db, "German", id);
    await deleteDoc(docRef);
  };

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


  return (
    <section className="vocab">
        <VocabList title={"Words For Today"} vocabList={spacedRepitionVocab} />
        <VocabList title={"All Words"} vocabList={vocab} />
    </section>
  );
};
