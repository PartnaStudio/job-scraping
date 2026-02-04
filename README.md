# Job Scraping App

A Node.js application that scrapes LinkedIn job listings.

## Features

- Scrape LinkedIn job listings
- Filter by job type, location, salary, experience etc.
- Express server with CORS enabled
- Returns job data as JSON

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`

## API Endpoints

- GET `/api/jobs` - Get jobs with default filters
- POST `/api/jobs` - Get jobs with custom filters (send filters in request body)
- GET `/api/health` - Health check endpoint

## Example Request

```json
POST /api/jobs
Content-Type: application/json

{
  "keyword": "software engineer",
  "location": "United States",
  "dateSincePosted": "past Week",
  "jobType": "full time",
  "remoteFilter": "remote",
  "salary": "100000",
  "experienceLevel": "mid level"
}
```

## Technologies

- Node.js
- Express
- linkedin-jobs-api
- CORS