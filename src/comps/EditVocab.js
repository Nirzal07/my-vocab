import React from "react";
import { useState, useEffect } from "react";

export const EditVocab = ({ word, meaning, type, details }) => {
  const [editWord, setEditWord] = useState(word);
  const [editMeaning, setEditMeaning] = useState(meaning);
  var [editType, setEditType] = useState(type);
  const [editDetails, setEditDetails] = useState(details);

  return (
    <>
      <div>
        <input
          type="text"
          className="edit-word"
          value={editWord}
          onChange={(e) => setEditWord(e.target.value)}
          placeholder="Word/Phrase"
        />

        <input
          type="text"
          className="edit-meaning"
          value={editMeaning}
          onChange={(e) => setEditMeaning(e.target.value)}
          placeholder="Meaning"
        />

        <select
          className="edit-type"
          value={editType}
          onChange={(e) => setEditType(e.target.value)}
        >
          <option>Type(Opt)</option>
          <option>Verb</option>
          <option>Noun</option>
          <option>Adjective</option>
          <option>Others</option>
        </select>
        <textarea
          rows="3"
          cols="50"
          className="edit-details"
          value={editDetails}
          onChange={(e) => setEditDetails(e.target.value)}
          placeholder="Additional Details(Opt)"
        ></textarea>

        <button type="submit">Update</button>
      </div>
    </>
  );
};
