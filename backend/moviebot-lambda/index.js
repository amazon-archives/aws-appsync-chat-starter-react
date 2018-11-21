"use strict";
const tmdb = require("tmdbv3").init("35440259b50e646a6485055c83367ccd");

// Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled ("Thanks, your pizza will arrive in 20 minutes")
function close(sessionAttributes, fulfillmentState, message) {
  return {
    sessionAttributes,
    dialogAction: {
      type: "Close",
      fulfillmentState,
      message
    }
  };
}

// --------------- Events -----------------------

function dispatch(intentRequest, callback) {
  console.log(
    "request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.intentName}"
  );
  const sessionAttributes = intentRequest.sessionAttributes;
  const slots = intentRequest.currentIntent.slots;
  var moviename = slots.name;
  var whatInfo = slots.summary;
  console.log(`request received for Slots=${moviename}, ${whatInfo}`);

  if (moviename.includes("@moviebot")) {
    let temp = moviename.replace("@moviebot", "");
    moviename = temp;
  }
  if (whatInfo && whatInfo.includes("@moviebot")) {
    let temp = whatInfo.replace("@moviebot", "");
    whatInfo = temp;
  }
  if (moviename.includes("moviebot")) {
    let temp = moviename.replace("moviebot", "");
    moviename = temp;
  }
  if (whatInfo && whatInfo.includes("moviebot")) {
    let temp = whatInfo.replace("moviebot", "");
    whatInfo = temp;
  }
  if (moviename.includes("@Moviebot")) {
    let temp = moviename.replace("@Moviebot", "");
    moviename = temp;
  }
  if (whatInfo && whatInfo.includes("@Moviebot")) {
    let temp = whatInfo.replace("@Moviebot", "");
    whatInfo = temp;
  }
  if (moviename.includes("Moviebot")) {
    let temp = moviename.replace("Moviebot", "");
    moviename = temp;
  }
  if (whatInfo && whatInfo.includes("Moviebot")) {
    let temp = whatInfo.replace("Moviebot", "");
    whatInfo = temp;
  }

  if (!moviename) {
  }

  console.log("After moviebot checks: " + moviename, whatInfo);

  tmdb.search.movie(`${moviename}`, function(err, res) {
    if (err) console.log(err);
    else if (res.errors) {
      callback(
        close(sessionAttributes, "Fulfilled", {
          contentType: "PlainText",
          content:
            "Please try something like: [@moviebot Tell me about a movie], [@moviebot Tell me about [Movie]], [@moviebot [Movie] [Plot]], [@moviebot [Movie] [Year]] or even just [@moviebot [Movie]]"
        })
      );
    } else {
      tmdb.movie.info(res.results[0].id, function(err, res) {
        if (err) {
          callback(
            close(sessionAttributes, "Fulfilled", {
              contentType: "PlainText",
              content:
                "Please try something like: [@moviebot Tell me about a movie], [@moviebot Tell me about [Movie]], [@moviebot [Movie] [Plot]], [@moviebot [Movie] [Year]] or even just [@moviebot [Movie]]"
            })
          );
        }
        var resPlot = res.overview;
        var resDate = res.release_date;
        var resLink = "https://www.imdb.com/title/" + res.imdb_id;
        var resPoster = "https://image.tmdb.org/t/p/w185/" + res.poster_path;
        console.log(res);
        if (
          whatInfo === "Year" ||
          whatInfo === "Release Date" ||
          whatInfo === "release date" ||
          whatInfo === "date" ||
          whatInfo === "date" ||
          whatInfo === "Release Year" ||
          whatInfo === "release year" ||
          whatInfo === "year"
        ) {
          callback(
            close(sessionAttributes, "Fulfilled", {
              contentType: "PlainText",
              content: ` ${moviename} released in: ${resDate} - IMDB Link: ${resLink} - IMDB Poster: ${resPoster}`
            })
          );
        } else if (
          whatInfo === "Plot" ||
          whatInfo === "Story" ||
          whatInfo === "plot" ||
          whatInfo === "story"
        ) {
          callback(
            close(sessionAttributes, "Fulfilled", {
              contentType: "PlainText",
              content: `Plot of ${moviename} is: ${resPlot} - IMDB Link: ${resLink} - IMDB Poster: ${resPoster} - IMDB Poster: ${resPoster}`
            })
          );
        } else
          callback(
            close(sessionAttributes, "Fulfilled", {
              contentType: "PlainText",
              content: `Movie Name: ${moviename}, Year: ${resDate}, Plot: ${resPlot} - IMDB Link: ${resLink} - IMDB Poster: ${resPoster}`
            })
          );
      });
    }
  });
}

// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
  try {
    dispatch(event, response => {
      console.log(response);
      callback(null, response);
    });
  } catch (err) {
    callback(err);
  }
};
