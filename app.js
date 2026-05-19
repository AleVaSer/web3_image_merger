const express = require('express');
const router = require('./routes/index');
const config = require('./config/cfg');
const app = express();

app.use('/', router);
app.listen(config.app_port, function() //порт
{
    console.log('Сервер ожидает подключения...')
});