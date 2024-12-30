#!/bin/bash

// USAGE
//  ./twelvefactor-app.sh manage cache|sw

import fs from "fs";
import { SW_API_STOPLIGHT_RESOURCES } from "../project/tsc/resources/api.stoplight.js";

console.log(
  "Compiling Updated File for Caching: ",
  SW_API_STOPLIGHT_RESOURCES._updated,
);
SW_API_STOPLIGHT_RESOURCES._updated = Date.now();
console.dir(JSON.stringify(SW_API_STOPLIGHT_RESOURCES));

try {
  fs.truncate(process.argv[2], 0, function () {
    console.log("File Content Deleted");
    fs.appendFileSync(
      process.argv[2],
      JSON.stringify(SW_API_STOPLIGHT_RESOURCES),
      function (err) {
        if (err) throw err;
      },
    );
    console.log("JSON configuration file successfully updated");
  });
} catch (err) {
  console.error(err);
}
