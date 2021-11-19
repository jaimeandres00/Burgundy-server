const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes')
const serviceRoutes = require('./routes/service.routes');
//const userRoutes = require('./routes/users.routes');

// Initializations
const app = express();

// Settings
app.set('port', process.env.PORT || 5000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

require('dotenv').config({
   path: './config/index.env'
});

// Database connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/user/', authRoutes);
app.use('/api/category/', categoryRoutes);
app.use('/api/service/', serviceRoutes);
//app.use('/api/users/', userRoutes);


app.get('/', (req, res) => {
    res.send('Página de inicio')
});

// Page not founded
app.use((req, res) => {
    res.status(404).json({
        msg: 'Page not founded'
    });
});

// Server is listening
app.listen(app.get('port'), () => {
    console.log('Aplicación en el puerto', app.get('port'));
});