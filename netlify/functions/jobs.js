let linkedIn;
try {
  linkedIn = require('linkedin-jobs-api');
} catch (e) {
  // Will surface in runtime if package not installed
}

const defaultQueryOptions = {
  keyword: 'software engineer',
  location: 'India',
  dateSincePosted: 'past Week',
  jobType: 'full time',
  remoteFilter: 'remote',
  salary: '100000',
  experienceLevel: 'entry level',
  limit: '10',
  page: '0',
  has_verification: false,
  under_10_applicants: false,
};

async function queryJobs(params) {
  if (!linkedIn) throw new Error('linkedin-jobs-api package not available');
  const client = new linkedIn();
  const queryOptions = params && Object.keys(params).length > 0 ? params : defaultQueryOptions;
  const response = await client.query(queryOptions);
  return {
    success: true,
    data: response,
    count: Array.isArray(response) ? response.length : 0,
    queryOptions,
  };
}

exports.handler = async function(event) {
  try {
    const qs = event.queryStringParameters || {};
    if (qs.health) return { statusCode: 200, body: JSON.stringify({ status: 'OK' }) };

    let params = {};
    if (event.httpMethod === 'POST') {
      params = event.body ? JSON.parse(event.body) : {};
    } else {
      params = qs;
    }

    const result = await queryJobs(params);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
