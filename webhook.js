('use strict');

const express = require('express');
const { json } = require('express');
const axios = require('axios').default;
require('dotenv').config();

const app = express().use(json);

const whatsappToken = process.env.WHATSAPP_TOKEN;
const myToken = process.env.MY_TOKEN;

app.listen(process.env.PORT || 1337, () => console.log('Webhook is listening'));

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
