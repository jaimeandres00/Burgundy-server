const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes')
const serviceRoutes = require('./routes/service.routes');

// Initializations
const app = express();

// Settings
app.set('port', process.env.PORT || 5000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

require('dotenv').config({
   path: './config/index.env'
});

// Database connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/auth/', authRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/category/', categoryRoutes);
app.use('/api/service/', serviceRoutes);

// Server is listening
app.listen(app.get('port'), () => {
    console.log('Aplicación en el puerto', app.get('port'));
});