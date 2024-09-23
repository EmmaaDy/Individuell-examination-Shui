const { db } = require('./services/db');
const { PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

module.exports.createMessage = async (event) => {
  const { body } = event;
  const message = JSON.parse(body);

  const params = {
    TableName: 'messages-table',
    Item: {
      id: message.id,
      content: message.content,
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

// Lägg till andra funktioner för getAllMessages och updateMessage här...
