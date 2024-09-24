const { db } = require('../services/db');
const { QueryCommand } = require('@aws-sdk/lib-dynamodb');

module.exports.handler = async (event) => {
  const username = event.queryStringParameters.username;

  if (!username) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',  
        'Access-Control-Allow-Credentials': true
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
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',  
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',  
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: 'Could not retrieve messages' }),
    };
  }
};