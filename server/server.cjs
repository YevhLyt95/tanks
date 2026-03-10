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

app.get('/stats', (req, res) => {
    res.json(db);
});

app.get('/', (req, res) =>{
    res.send('<h1>Server works!</h1><p>Whatch statistics: <a href="/stats">/stats</a></p>')
})
app.listen(3000, () => {
    console.log('🚀 Сервер статистики запущено на http://localhost:3000');
});