const express = require('express');
const os = require('os');
const csp = require('express-csp-header');

const app = express();

// setup of Content Security Policy (CSP) header
app.use(csp({
  policies: {
    'default-src': [csp.NONE],
    'script-src': [csp.SELF],
    'style-src': [csp.SELF],
    'img-src': [csp.SELF],
    'form-action': [csp.SELF],
    'block-all-mixed-content': true
  }
}));

app.use(express.static('dist'));

app.get('/api/getUsername', (req, res) => {
  res.send({ username: os.userInfo().username });
});

app.listen(8080, () => console.log('Listening on port 8080!'));