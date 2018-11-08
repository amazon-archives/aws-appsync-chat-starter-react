let AWS = require("aws-sdk");
let rekognition = new AWS.Rekognition();
let lex = new AWS.LexRuntime();
let polly = new AWS.Polly();
let translate = new AWS.Translate();
let comprehend = new AWS.Comprehend();
let s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
  console.log(event);
  switch (event.field) {
    case "lex":
      const lexparams = {
        botAlias: "$LATEST",
        botName: event.arguments.bot,
        inputText: event.arguments.text,
        userId: event.arguments.sender
      };
      lex.postText(lexparams, function(err, data) {
        if (err) {
          console.error("Error JSON: ", JSON.stringify(err, null, 2));
          callback(err);
        } else {
          let result = {
            bot: event.arguments.bot,
            text: event.arguments.text,
            response: data.message
          };
          callback(null, result);
        }
      });
      break;
    case "rekognition-labels":
      const labelRekogparams = {
        Image: {
          S3Object: {
            Bucket: event.arguments.bucket,
            Name: event.arguments.key
          }
        },
        MaxLabels: 5,
        MinConfidence: 70
      };
      rekognition.detectLabels(labelRekogparams, function(err, data) {
        if (err) {
          console.error("Error JSON: ", JSON.stringify(err, null, 2));
          callback(err);
        } else {
          // successful response
          let result = {
            bucket: event.arguments.bucket,
            key: event.arguments.key,
            response: data.Labels
          };
          callback(null, result);
        }
      });
      break;
    case "rekognition-celebs":
      const celebRekogparams = {
        Image: {
          S3Object: {
            Bucket: event.arguments.bucket,
            Name: event.arguments.key
          }
        }
      };
      rekognition.recognizeCelebrities(celebRekogparams, function(err, data) {
        if (err) {
          console.error("Error JSON: ", JSON.stringify(err, null, 2));
          callback(err);
        } else {
          // successful response
          let result = {
            bucket: event.arguments.bucket,
            key: event.arguments.key,
            response: data.CelebrityFaces
          };
          callback(null, result);
        }
      });
      break;
    case "polly":
      const pollyparams = {
        OutputFormat: "mp3",
        Text: event.arguments.text,
        VoiceId: event.arguments.voice
      };
      polly
        .synthesizeSpeech(pollyparams)
        .on("success", function(response) {
          console.log("Polly Synthesize Speech Success!");
          let data = response.data;
          let audioStream = data.AudioStream;
          send2S3(audioStream, event.arguments.key, event.arguments.bucket);
        })
        .on("error", function(err) {
          console.error("Error JSON: ", JSON.stringify(err, null, 2));
          callback(err);
        })
        .send();
      let url = getUrl(event.arguments.key, event.arguments.bucket);
      console.log("Signed URL: " + url);
      let result = {
        bucket: event.arguments.bucket,
        key: event.arguments.key + ".mp3",
        response: url
      };
      callback(null, result);
      break;
    case "translate":
      const translateParams = {
        SourceLanguageCode: "auto",
        TargetLanguageCode: event.arguments.language,
        Text: event.arguments.text
      };
      translate.translateText(translateParams, function(err, data) {
        if (err) {
          console.error("Error JSON: ", JSON.stringify(err, null, 2));
          callback(err);
        } else {
          // successful response
          let result = {
            response: data
          };
          callback(null, result);
        }
      });
      break;
    case "comprehend-language":
      const compLangParams = {
        Text: event.arguments.text
      };
      comprehend.detectDominantLanguage(compLangParams, function(err, data) {
        if (err) {
          console.error("Error JSON: ", JSON.stringify(err, null, 2));
          callback(err);
        } else {
          // successful response
          let result = {
            response: data.Languages
          };
          callback(null, result);
        }
      });
      break;
    case "comprehend-sentiment":
      const compSentParams = {
        LanguageCode: event.arguments.language,
        Text: event.arguments.text
      };
      comprehend.detectSentiment(compSentParams, function(err, data) {
        if (err) {
          console.error("Error JSON: ", JSON.stringify(err, null, 2));
          callback(err);
        } else {
          // successful response
          let result = {
            response: data
          };
          callback(null, result);
        }
      });
      break;
    case "comprehend-entities":
      const compEntParams = {
        LanguageCode: event.arguments.language,
        Text: event.arguments.text
      };
      comprehend.detectEntities(compEntParams, function(err, data) {
        if (err) {
          console.error("Error JSON: ", JSON.stringify(err, null, 2));
          callback(err);
        } else {
          // successful response
          let result = {
            response: data.Entities
          };
          callback(null, result);
        }
      });
      break;
    default:
      callback("Unknown field, unable to resolve" + event.field, null);
      break;
  }
};

function send2S3(data, key, bucket) {
  console.log("Valid Buffer");
  let params = {
    Bucket: bucket,
    Key: key + ".mp3",
    Body: data
  };
  s3.putObject(params)
    .on("success", function(response) {
      console.log("S3 Put Success!");
    })
    .on("complete", function() {
      //let url = getUrl(id);
      console.log("S3 Put Complete!");
    })
    .on("error", function(response) {
      console.log(response);
    })
    .send();
  //return url;
}

function getUrl(key, bucket) {
  let params = {
    Bucket: bucket,
    Key: key + ".mp3"
  };
  let url = s3.getSignedUrl("getObject", params);
  console.log("File " + params.Key + " saved to S3");
  return url;
}
