"use strict";

const express = require("express");
const app = express();

app.get("/hello", (req, res) => res.send("Hello World"));
app.get("/time", (req, res) => res.send(new Date().toString()));

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
