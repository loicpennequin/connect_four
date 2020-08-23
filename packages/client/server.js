const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('dist'));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

app.listen(process.env.PORT || 8888, () => {
    console.log('Client server listening on port', process.env.PORT);
});
