# ChatQLv2: An AWS AppSync Chat Starter App written in React

### Quicklinks

- [ChatQLv2: An AWS AppSync Chat Starter App written in React]
  - [Introduction](#introduction)
  - [Getting Started](#getting-started) - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend-setup)
    - [Interacting with Chatbots](#interacting-with-chatbots)
    - [Interacting with other AWS AI Services](#interacting-with-other-aws-ai-services)
  - [Building, Deploying and Publishing](#building-deploying-and-publishing)
  - [Clean Up](#clean-up)

## Introduction

This is a Starter React Progressive Web Application (PWA) that uses AWS AppSync to implement offline and real-time capabilities in a chat application with AI/ML features such as image recognition, text-to-speech, language translation, sentiment analysis as well as conversational chatbots. In the chat app, users can search for users and messages, have conversations with other users, upload images and exchange messages. The application demonstrates GraphQL Mutations, Queries and Subscriptions using AWS AppSync and other AWS Services such as AWS Lambda, Amazon DynamoDB, Amazon Comprehend, Amazon Lex and others. You can use this for learning purposes or adapt either the application or the GraphQL Schema to meet your needs.

![ChatQL Overview](/media/ChatQLv2.png)

## Getting Started

#### Prerequisites

- [AWS Account](https://aws.amazon.com/mobile/details) with appropriate permissions to create the related resources
- [NodeJS](https://nodejs.org/en/download/) with [NPM](https://docs.npmjs.com/getting-started/installing-node)
- [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) `(pip install awscli --upgrade --user)`
- [AWS Amplify CLI](https://github.com/aws-amplify/amplify-cli) (configured for a region where [AWS AppSync](https://docs.aws.amazon.com/general/latest/gr/rande.html) and all other services in use are available) `(npm install -g @aws-amplify/cli)`
- [AWS SAM CLI](https://github.com/awslabs/aws-sam-cli) `(pip install --user aws-sam-cli)`
- [Create React App](https://github.com/facebook/create-react-app) `(npm install -g create-react-app)`

### Backend Setup

1. First, clone this repository and navigate to the created folder:

   ```bash
   $ git clone https://github.com/aws-samples/aws-appsync-chat-starter-react.git
   $ cd aws-appsync-chat-starter-react
   ```

2. Set up your AWS resources the Amplify CLI:

   ```bash
   $ amplify init
   ```

3. Install the required modules:

   ```bash
   $ npm install
   ```

4. Add an AppSync GraphQL API with Amazon Cognito for the API Authentication. Follow the default options and, when prompted to edit the GraphQL schema in your editor of choice, paste the contents of the file `backend\schema.graphql` to it :

   ```bash
   $ amplify add api
   ```

5. Add S3 Private Storage to the project with the default options (make sure to select private read/write S3 access for authenticate users):

   ```bash
   $ amplify add storage
   ```

6. Create the cloud resources by pushing the changes:

   ```bash
   $ amplify push
   ```

7. In `./src/aws-exports.js`, look up the S3 bucket name created for user storage:

   ```bash
   $ grep aws_user_files_s3_bucket src/aws-exports.js
   ```

8. Navigate to the AWS AppSync console (http://console.aws.amazon.com/appsync/home), open the newly created API, click SETTINGS and retrieve the API ID

9. Create an S3 bucket in the same region as all the other resources. It'll be used for the SAM packaging and deployment

   ```bash
   $ aws s3 mb s3://bucket-name --region <region-name>
   ```

10. Now we need to deploy 3 Lambda functions (one for AppSync and two for Lex) and configure the AppSync Resolvers that use Lambda accordingly. Use the following command to package the deployment files and upload them to the S3 bucket created on the last step:

    ```bash
    $ sam package --template-file file://backend/deploy.yaml --s3-bucket bucket-name --output-template-file packaged.yaml
    ```

11. Using the S3 bucket details retrieved on step 7 and the API ID retrieved on step 8, deploy the template. It'll generate the Lambda functions used to connect to the AI Application Services and Lex Chatbots as well as setup permissions:

    ```bash
    $ sam deploy --template-file ./packaged.yaml --stack-name ChatQLReact --capabilities CAPABILITY_IAM --parameter-overrides appSyncAPI=<API_ID_FROM_APPSYNC_CONSOLE> s3Bucket=<S3_BUCKET_FROM_AWS_EXPORTS> --region <region-name>
    ```

    When the stack is done deploying, you can view its output. Make note of the Lambda ARNs.

    ```bash
    $ aws cloudformation describe-stacks --stack-name ChatQLReact --query Stacks[0].Outputs --region <region-name>
    ```

12. Edit the files `backend/MovieBot.json` and `backend/ChuckBot.json` on line 17 ("uri") to add the Lambda ARNs accordingly (MovieBotFunction and ChuckBotFunction from the last command)

13. Create 2 different zip files containing the JSON files above on each
14. Execute the following commands to add permissions so Lex can invoke the functions:

    ```bash
    $ aws lambda add-permission --statement-id Lex --function-name <MovieBot Lambda ARN> --action lambda:\* --principal lex.amazonaws.com --region <region-name>
    $ aws lambda add-permission --statement-id Lex --function-name <ChuckBot Lambda ARN> --action lambda:\* --principal lex.amazonaws.com --region <region-name>
    ```

15. Go to the Lex Console ((http://console.aws.amazon.com/lex/home), under "Bots" select ACTIONS -> IMPORT and upload both zip files you generated on step 13. After that you'll have 2 chatbots: ChuckBot and MovieBot
16. Access each bot separately and click the BUILD button
17. Finally, execute the following command to install your project package dependencies and run the application locally:

    ```bash
    $ amplify serve
    ```

    or

    ```bash
    $ npm start
    ```

18. Access your ChatQLv2 app at http://localhost:3000. Sign up different users and test real-time/offline messaging using different browsers.

### Interacting with Chatbots

(_The chatbots retrieve information online via API calls from Lambda to https://www.themoviedb.org/ (MovieBot, which is based on https://github.com/aws-samples/aws-lex-convo-bot-example) and https://api.chucknorris.io/ (ChuckBot)_)

1. In order to start or respond to a chatbot conversation, you need to start the message with either `@chuckbot` or `@moviebot` to trigger or respond to the specific bot, for example:

   - @chuckbot Give me a Chuck Norris fact
   - @moviebot Tell me about a movie

2. Each subsequent response needs to start with the bot handle (@chuckbot or @moviebot) so the app can detect the message is directed to Lex and not to the other user in the conversation. Both users will be able to view Lex chatbot responses in real-time thanks to GraphQL subscriptions.
3. Alternatively you can start a chatbot conversation from the message drop-down menu:

   - Just selecting `ChuckBot` will display options for further interaction
   - Send a message with a movie name and selecting `MovieBot` subsequently will retrieve te details about the movie

### Interacting with other AWS AI Services

1. Click or select uploaded images to trigger Amazon Rekognition object, scene and celebrity detection
2. From the drop-down menu, select LISTEN -> TEXT TO SPEECH to trigger Amazon Polly and listen to messages in different voices depending on the message source language (supported languages: English, Mandarin, Portuguese, French and Spanish)
3. To perform message entity and sentiment analysis via Amazon Comprehend, select ANALYSE -> SENTIMENT
4. To translate the message select the desired message under TRANSLATE. In the translation pane, click on the microphone icon to listen to the translated message.

## Building, Deploying and Publishing

1. Execute `amplify add hosting` from the project's root folder and follow the prompts to create a S3 bucket (DEV) and/or a CloudFront distribution (PROD).

2. Build and publish the application:

   ```bash
       $ amplify publish
   ```

3. If you are deploying a CloudFront distribuiton, be mindful it needs to be replicated across all points of presence globally and it might take up to 15 minutes to do so.

4. Access your public ChatQL application using the S3 Website Endpoint URL or the CloudFront URL returned by the `amplify publish` command. Share the link with friends, sign up some users, and start creating conversations, uploading images, translating, executing text-to-speech in different languages, performing sentiment analysis and exchanging messages. Be mindful PWAs require SSL, in order to test PWA functionality access the CloudFront URL (HTTPS) from a mobile device and add the site to the mobile home screen.

## Clean Up

To clean up the project, you can simply delete the stack you created or use the Amplify CLI, depending on how you deployed the application.

```bash
$ aws cloudformation delete-stack --stack-name ChatQLReact --region <region-name>
```

and use:

```
$ amplify delete
```
