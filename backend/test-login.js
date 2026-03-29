const https = require('https');

const data = JSON.stringify({
  username: 'spf@12',
  password: 'Harsh@1205'
});

const options = {
  hostname: 'shivani-photo-and-films.onrender.com',
  port: 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  console.log('Status Code:', res.statusCode);
  
  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('Response Body:', body);
  });
});

req.on('error', (error) => {
  console.error('Request Error:', error);
});

req.write(data);
req.end();
