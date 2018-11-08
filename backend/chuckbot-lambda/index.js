const axios = require("axios");
let ret;

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

async function dispatch(intentRequest, callback) {
  console.log(
    "request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.intentName}"
  );
  const sessionAttributes = intentRequest.sessionAttributes;
  const slots = intentRequest.currentIntent.slots;
  let response = "",
    url = "",
    category = "";
  const baseUrl = "https://api.chucknorris.io/jokes/random?category=";
  let factType = slots.FactType;
  console.log(`request received for Slots=${factType}`);

  if (factType.includes("chuckbot")) {
    let temp = factType.replace("chuckbot", "");
    factType = temp;
  }

  try {
    switch (factType) {
      case "Software Development":
      case "software development":
      case "development":
      case "developer":
      case " Software Development":
      case " software development":
      case " development":
      case " developer":
        category = "dev";
        url = baseUrl.concat(category);
        ret = await axios(url);
        response = ret.data.value.trim();
        callback(
          close(sessionAttributes, "Fulfilled", {
            contentType: "PlainText",
            content: ` ${response}`
          })
        );
        break;
      case "Music":
      case "music":
      case " Music":
      case " music":
        category = "music";
        url = baseUrl.concat(category);
        ret = await axios(url);
        response = ret.data.value.trim();
        callback(
          close(sessionAttributes, "Fulfilled", {
            contentType: "PlainText",
            content: ` ${response}`
          })
        );
        break;
      case "Science":
      case "science":
      case " Science":
      case " science":
        category = "science";
        url = baseUrl.concat(category);
        ret = await axios(url);
        response = ret.data.value.trim();
        callback(
          close(sessionAttributes, "Fulfilled", {
            contentType: "PlainText",
            content: ` ${response}`
          })
        );
        break;
      case "Movies":
      case "movies":
      case " Movies":
      case " movies":
        category = "movie";
        url = baseUrl.concat(category);
        ret = await axios(url);
        response = ret.data.value.trim();
        callback(
          close(sessionAttributes, "Fulfilled", {
            contentType: "PlainText",
            content: ` ${response}`
          })
        );
        break;
      case "Food":
      case "food":
      case " Food":
      case " food":
        category = "food";
        url = baseUrl.concat(category);
        ret = await axios(url);
        response = ret.data.value.trim();
        callback(
          close(sessionAttributes, "Fulfilled", {
            contentType: "PlainText",
            content: ` ${response}`
          })
        );
        break;
      default:
        response = "Unsupported fact, try again: " + factType;
        callback(
          close(sessionAttributes, "Fulfilled", {
            contentType: "PlainText",
            content: ` ${response}`
          })
        );
        break;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
}

// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.lambda_handler = (event, context, callback) => {
  try {
    dispatch(event, response => {
      callback(null, response);
    });
  } catch (err) {
    callback(err);
  }
};
