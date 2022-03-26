import React, { useState, useEffect, createContext, useContext } from "react";
import { Vocab } from "./vocab/Vocab";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
/*Material UI*/
import OutlinedInput from "@mui/material/OutlinedInput";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { AddForm } from "./AddForm";

let searchValue = null;
export const searchText = createContext(searchValue);

export const Search = () => {
  const [search, setSearch] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const responseGoogle = (response) => {
    console.log(response);
  };

  const responseFacebook = (response) => {
    console.log(response);
  };

  return (
    <>
      <section>
        <div className="title">Search</div>
        <form className="search-form">
          <OutlinedInput
            size="small"
            style={{
              background: "white",
              borderRadius: 15 + "px",
              width: 50 + "vw",
            }}
            placeholder="Search words/phrases in your Vocab"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => setShowForm(true)}>
            <AddIcon size="big" />
          </Button>
          ,
        </form>
        {showForm && (
          <AddForm openFormModal={showForm} setOpenFormModal={setShowForm} />
        )}
      </section>
    </>
  );
};
