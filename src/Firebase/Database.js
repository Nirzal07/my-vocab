import React, { useEffect, useState } from "react";
import { db } from "./config";

export const Database = (docs) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    db.collection('German').onSnapshot((snap) => {
      let documents = [];
      snap.forEach((doc) => documents.push({ ...doc.data, id: doc.id }));
      setDocs(documents);
    });
  }, [collection]);

  return docs
};
