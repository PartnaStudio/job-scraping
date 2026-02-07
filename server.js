const express = require('express');
const cors = require('cors');
const linkedIn = require('linkedin-jobs-api');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Default query options
const defaultQueryOptions = {
  keyword: 'software engineer',
  location: 'India',
  dateSincePosted: 'past Week',
  jobType: 'full time',
  remoteFilter: 'remote',
  salary: '100000',
  experienceLevel: 'entry level',
  limit: '10',
  page: "0",
  has_verification: false,
  under_10_applicants: false,
};

// Core query function (exported for serverless wrappers)
async function queryJobs(params) {
  const queryOptions = params && Object.keys(params).length > 0
    ? params
    : defaultQueryOptions;

  console.log('queryJobs called with:', queryOptions);

  const response = await linkedIn.query(queryOptions);
  return {
    success: true,
    data: response,
    count: Array.isArray(response) ? response.length : 0,
    queryOptions
  };
}

module.exports.queryJobs = queryJobs;

// API endpoint to fetch LinkedIn jobs
app.post('/api/jobs', async (req, res) => {
  try {
    const params = req.body && Object.keys(req.body).length > 0 ? req.body : {};
    const result = await queryJobs(params);
    res.json(result);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET endpoint with default options (for backward compatibility)
app.get('/api/jobs', async (req, res) => {
  try {
    const params = req.query && Object.keys(req.query).length > 0 ? req.query : {};
    const result = await queryJobs(params);
    res.json(result);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📋 Jobs API available at http://localhost:${PORT}/api/jobs`);
    console.log(`✅ CORS enabled - you can fetch from frontend applications`);
  });
}
