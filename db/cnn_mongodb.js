import mongoose from 'mongoose';
import 'colors';

let isConnected = false;

const conectarAMongoDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        console.log('Ya esta conectado a MongoDB'.green);
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('Conectado a MongoDB'.green);
    } catch (error) {
        console.log('Error al conectar a MongoDB:'.red, error.message || error);
    }
};

const db = mongoose.connection;

db.on('error', (error) => {
    isConnected = false;
    console.log('Error en la conexión a MongoDB:'.red, error.message || error);
});

db.once('open', () => {
    isConnected = true;
});

db.on('disconnected', () => {
    isConnected = false;
    console.log('Desconectado de MongoDB'.yellow);
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB desconectado'.yellow);
    process.exit(0);
});

export { conectarAMongoDB, isConnected, isConnected as isConected };

