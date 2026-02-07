const path = require('path');

// Require the server module (it exports queryJobs)
const server = require(path.join(__dirname, '..', '..', 'server.js'));

exports.handler = async function(event) {
  try {
    // Health check support
    const qs = event.queryStringParameters || {};
    if (qs.health) {
      return { statusCode: 200, body: JSON.stringify({ status: 'OK' }) };
    }

    let params = {};
    if (event.httpMethod === 'POST') {
      params = event.body ? JSON.parse(event.body) : {};
    } else {
      params = qs;
    }

    if (typeof server.queryJobs !== 'function') {
      return {
        statusCode: 501,
        body: JSON.stringify({ error: 'server.queryJobs not available' })
      };
    }

    const result = await server.queryJobs(params);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
