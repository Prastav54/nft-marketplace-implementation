import React from "react";
import { ERROR, SOMETHING_WENT_WRONG } from "../constants/AppConstants";

export const getImage = async (url, id) => {
  const requestURL = url.replace("ipfs://", "https://ipfs.io/ipfs/");
  const tokenURIResponse = await (await fetch(requestURL)).json();
  const imageURI = tokenURIResponse.image;
  const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
  document.getElementById(id).src = imageURIURL;
};

export const lazyImport = (factory, name) => {
  return Object.create({
    [name]: React.lazy(() =>
      factory().then((module) => ({ default: module[name] }))
    ),
  });
};

export const handleError = (error, dispatch) => {
  console.log(error);
  dispatch({
    type: ERROR,
    message: SOMETHING_WENT_WRONG,
    position: "topR",
    title: "Error Occured",
  });
};
