const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/debug/headers',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('HEADERS:', JSON.stringify(res.headers));
    try {
        const fs = require('fs');
        const parsed = JSON.parse(data);
        fs.writeFileSync('debug_headers_result.json', JSON.stringify(parsed, null, 2));
        console.log('Results saved to debug_headers_result.json');
    } catch (e) {
        console.log('RAW DATA:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
