const mongoose = require('mongoose');

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
})

mongoose.connection.on('error', (err) => {
  console.error(err);
})

async function connectMongoDB (url) {
  await mongoose.connect(url);
}

async function disconnectMongoDB () {
  await mongoose.disconnect();
}

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
}
