import { Button, LinearProgress, TextField } from "@material-ui/core";
import React, { useState } from "react";
import shortcode from "../api/shortcode";

const HTTP_URL_VALIDATOR_REGEX =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

const Search = () => {
  const [link, setLink] = useState("");
  const [short, setShort] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateURL = (string) => {
    return string.match(HTTP_URL_VALIDATOR_REGEX);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateURL(link)) {
      getLink();
      setLink("");
      setIsLoading(!isLoading);
    } else {
      setShort("Please input a valid URL.");
    }
  };

  const getLink = async () => {
    await shortcode
      .get(`shorten?url=${link}`)
      .then((response) => {
        setShort(response.data.result.short_link);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setErr(error);
      });
  };

  return (
    <>
      <form
        onSubmit={(e) => handleSubmit(e)}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <TextField
          style={{ marginBottom: "20px" }}
          label="Input Your Link"
          variant="outlined"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        {!isLoading && (
          <Button
            style={{ marginBottom: "20px" }}
            variant="contained"
            color="primary"
            onClick={(e) => handleSubmit(e)}
          >
            Get Short Link
          </Button>
        )}

        {!err && isLoading && <LinearProgress />}
      </form>

      {!err && short && (
        <div>
          Short Link:{" "}
          <a href={`http://${short}`} target="_blank" rel="noreferrer">
            {short}
          </a>
        </div>
      )}
      {err && !short && (
        <>
          <div style={{ textAlign: "center" }}>
            {err.message}
            <p>Please refresh the page to enter a new URL</p>
          </div>
        </>
      )}
    </>
  );
};

export default Search;
