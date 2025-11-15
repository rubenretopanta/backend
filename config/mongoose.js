import _mongoose from 'mongoose';


_mongoose.connect('mongodb://localhost:27017/bdprueba')
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión:', err));

_mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado');
});

_mongoose.connection.on('error', (err) => {
  console.error('Error en Mongoose:', err);
});

_mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado');
});


process.on('SIGINT', async () => {
  await _mongoose.connection.close();
  process.exit(0);
});

export default _mongoose;