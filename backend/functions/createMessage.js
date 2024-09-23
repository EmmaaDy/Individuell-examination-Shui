const { db } = require('../services/db');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid'); // Importera uuid

module.exports.handler = async (event) => {
  const { body } = event;
  const message = JSON.parse(body);

  // Validera användarnamn och meddelandetext
  if (!message.username || !message.text) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Username and text are required' }),
    };
  }

  const params = {
    TableName: 'messages-table',
    Item: {
      id: uuidv4(), // Generera unikt ID
      username: message.username, // Sätt användarnamnet
      text: message.text, // Sätt meddelandetexten
      createdAt: new Date().toISOString(), // Skapa tidsstämpel
    },
  };

  try {
    await db.send(new PutCommand(params));
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Message created' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create message' }),
    };
  }
};
