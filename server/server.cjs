const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// temporary "db":

const db = [];

app.post('/api/stats', (req, res) => {
    const data = req.body;
    db.push({...data, id: db.length + 1, timestamp: new Date()});
    console.log('===Game Stats===');
    console.table(db);

    res.json({status: 'ok', message: 'Data recieved!'});
});

app.listen(300, () => {
    console.log('🚀 Сервер статистики запущено на http://localhost:3000');
});