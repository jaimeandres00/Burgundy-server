const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(express.json());

require('dotenv').config({
   path: './config/index.env'
});

// MongoDB
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/user/', require('./routes/auth.route'));

app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Página de inicio')
});

// Page not founded
app.use((req, res) => {
    res.status(404).json({
        msg: 'Page not founded'
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Aplicación en el puerto ${PORT}`);
});