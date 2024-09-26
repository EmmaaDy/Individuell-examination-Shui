const { db } = require('../services/db');
const { GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

module.exports.handler = async (event) => {
  const { id } = event.pathParameters; // Hämta id från path parameters
  const { content } = JSON.parse(event.body); // Hämta nytt innehåll från request body

  // Först hämta meddelandet för att se om det finns
  const getParams = {
    TableName: 'messages-table',
    Key: { id: id },
  };

  try {
    const getResult = await db.send(new GetCommand(getParams));

    // Kontrollera om meddelandet finns
    if (!getResult.Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': 'http://min-anlagstavla-shui.s3-website.eu-north-1.amazonaws.com', 
          'Access-Control-Allow-Credentials': true,
          'Content-Type': 'application/json', // Lägg till Content-Type
        },
        body: JSON.stringify({ error: 'Message not found' }),
      };
    }

    // Om meddelandet finns, uppdatera det
    const updateParams = {
      TableName: 'messages-table',
      Key: { id: id },
      UpdateExpression: 'SET content = :content, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':content': content,
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'UPDATED_NEW',
    };

    const updateResult = await db.send(new UpdateCommand(updateParams));
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://min-anlagstavla-shui.s3-website.eu-north-1.amazonaws.com', 
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json', // Lägg till Content-Type
      },
      body: JSON.stringify({ message: 'Message updated', updatedValues: updateResult.Attributes }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'http://min-anlagstavla-shui.s3-website.eu-north-1.amazonaws.com', 
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json', // Lägg till Content-Type
      },
      body: JSON.stringify({ error: 'Could not update message' }),
    };
  }
};
