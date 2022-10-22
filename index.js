const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info('Hello logs!', { structuredData: true });
//   response.send('Hello from Firebase!');
// });

// exports.questionsCreate = functions.https.onRequest(
//   async (request, response) => {
//     try {
//       let db = admin.firestore();

//       const qn = {
//         category: 'Current Affairs',
//         question: 'Who is the president of Nigeria?',
//         options: [
//           'Muhammadu Buhari',
//           "Muhammadu Buhari's son",
//           'Son of Muhammadu Buhari',
//         ],
//         rightAns: 'Muhammadu Buhari',
//       };

//       let doc = await db.collection('questions').add(qn);
//       response.send('Data Added');
//     } catch (error) {
//       response.send('Fatal: ', error);
//       console.log(error);
//     }
//   }
// );

// exports.questionRead = functions.https.onRequest(async (request, response) => {
//   var db = admin.firestore();

//   let docu = await db.collection('questions').doc('GXy4OMtPLQR3thqJ0cYM').get();
//   let option = docu.get('options');
//   console.log('Document Data: ', option[1]);
//   response.send(`One of the options entered is: ${option[2]}`);
// });

// exports.questionEdit = functions.https.onRequest(async (request, response) => {
//   var db = admin.firestore();

//   let qnEdit = await db
//     .collection('questions')
//     .doc('YV4nn28j2kSO71Ud53eO')
//     .update({ options: ['John Smith', 'Jane Smith', 'John Doe'] });

//   let newOptions = await db
//     .collection('questions')
//     .doc('YV4nn28j2kSO71Ud53eO')
//     .get('options');

//   console.log('Updated Data: ', qnEdit);
//   response.send('Successfully Updated Document.');
// });

// Webhooks Setup
('use strict');

const express = require('express');
const { json } = require('express');
const axios = require('axios').default;
require('dotenv').config();

const app = express().use(json);

const whatsappToken = process.env.WHATSAPP_TOKEN;
const myToken = process.env.MY_TOKEN;

// app.listen(process.env.PORT || 1337, () => console.log('Webhook is listening'));

app.get('/', (request, response) => {
  let mode = request.query['hub.mode'];
  let challenge = request.query['hub.challenge'];
  let token = request.query['hub.verify_token'];

  if (mode && token) {
    if (mode === 'subscribe' && token === myToken) {
      response.status(200).send(challenge);
    } else {
      response.send(403);
    }
  }
});

app.post('/', (request, response) => {
  let body_param = request.body;

  console.log(JSON.stringify(body_param, null, 2));

  if (body_param.object) {
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

      axios({
        // Required, HTTP method, a string, e.g. POST, GET
        method: 'POST',
        url:
          'https://graph.facebook.com/v14.0/' +
          phone_number_id +
          '/messages?access_token=' +
          whatsappToken,
        data: {
          messaging_product: 'whatsapp',
          to: from,
          text: { body: 'Hi, the webhook is up...' },
        },
        headers: { 'Content-Type': 'application/json' },
      });
    }
    response.sendStatus(200);
  } else {
    response.sendStatus(404);
  }
});

exports.setWebhook = functions.https.onRequest(app)

// exports.getWebhook = functions.https.onRequest((request, response) => {
//   let mode = request.query['hub.mode'];
//   let challenge = request.query['hub.challenge'];
//   let token = request.query['hub.verify_token'];

//   if (mode && token) {
//     if (mode === 'subscribe' && token === myToken) {
//       response.status(200).send(challenge);
//     } else {
//       response.send(403);
//     }
//   }
// });

// exports.postWebhook = functions.https.onRequest((request, response) => {
//   let body_param = request.body;

//   console.log(JSON.stringify(body_param, null, 2));

//   if (body_param.object) {
//     if (
//       body_param.entry &&
//       body_param.entry[0].changes &&
//       body_param.entry[0].changes[0].value.messages &&
//       body_param.entry[0].changes[0].value.messages[0]
//     ) {
//       let phone_number_id =
//         body_param.entry[0].changes[0].value.metadata.phone_number_id;
//       let from = body_param.entry[0].changes[0].value.messages[0].from;
//       let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

//       axios({
//         // Required, HTTP method, a string, e.g. POST, GET
//         method: 'POST',
//         url:
//           'https://graph.facebook.com/v14.0/' +
//           phone_number_id +
//           '/messages?access_token=' +
//           whatsappToken,
//         data: {
//           messaging_product: 'whatsapp',
//           to: from,
//           text: { body: 'Hi, the webhook is up...' },
//         },
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }
//     response.sendStatus(200);
//   } else {
//     response.sendStatus(404);
//   }
// });
