const { db } = require('../services/db');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');

module.exports.handler = async (event) => {
  const params = {
    TableName: 'messages-table',
  };

  try {
    const data = await db.send(new ScanCommand(params));

    // Sortera meddelanden baserat på createdAt
    const sortedMessages = data.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',  
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(sortedMessages), // Returnera de sorterade meddelandena
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