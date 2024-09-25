const { db } = require('../services/db');
const { QueryCommand } = require('@aws-sdk/lib-dynamodb');

module.exports.handler = async (event) => {
  const username = event.queryStringParameters && event.queryStringParameters.username;

  // Kontrollera om användarnamnet skickades med
  if (!username) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: 'Username is required' }),
    };
  }

  const params = {
    TableName: 'messages-table',
    IndexName: 'username-index',
    KeyConditionExpression: 'username = :username',
    ExpressionAttributeValues: {
      ':username': username,
    },
  };

  try {
    const data = await db.send(new QueryCommand(params));

    // Kontrollera om några meddelanden hittades
    if (data.Items.length === 0) {
      return {
        statusCode: 404, // Ändra statuskoden till 404 om inga meddelanden hittades
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: `No messages found for user: ${username}` }),
      };
    }

    // Returnera meddelandena om de hittades
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error('Error querying messages:', error);

    // Hantera eventuella fel
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: 'Could not retrieve messages' }),
    };
  }
};
