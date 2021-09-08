const http = require("http");
const fs = require("fs");
const fetch = require("node-fetch");
const express = require("express");
const app = express();

// const authentication = () => check for valid token, acts like a gatewar - get the user and return boolean or the actual user

// GET - https://restcountries.eu/rest/v2/all
// POST - https://restcountries.eu/rest/v2/name/{searchString}
// https://restcountries.eu/rest/v2/name/{searchString}

const COUNTRIES_URL = "https://restcountries.eu/rest/v2/all";
const COUNTRIES_SEARCH_URL = "https://restcountries.eu/rest/v2/name/";

app.use("/countries/all", async (req, res, next) => {
  const countries = await getCountries(COUNTRIES_URL);
  const formattedResult = getFormattedResult(countries);
  return res.json(formattedResult);
});

app.post("/countries/search/:searchString", async (req, res) => {
  const param = Object.assign(req.query, req.params, req.body);

  const searchedForCountry = await fetch(
    `${COUNTRIES_SEARCH_URL}${param.searchString}`
  );
  const country = await searchedForCountry.json();
  await writeToFile(getFormattedResult(country));
  return res.json(getFormattedResult(country));
});

const getFormattedResult = (countries) => {
  return countries.map((country) => ({
    name: country.name,
    capital: country.capital,
    flag: country.flag.replace(/https/g, "sftp")
  }));
};

const writeToFile = async (dataToWrite) => {
  const fileData = {
    ...dataToWrite,
    createdAt: new Date()
  };
  fs.writeFileSync("/tmp/test.json", JSON.stringify(fileData));
};
const getCountries = async (url) => {
  const response = await fetch(url);
  const jsonResult = await response.json();
  return jsonResult;
};

//create a server object:

http.createServer(app).listen(8080); //the server object listens on port 8080
