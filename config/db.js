const mongoose = require('mongoose');

const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log(`Base de datos conectada: ${connection.connection.host}`)
};

module.exports = connectDB;