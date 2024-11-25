const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { DB_NAME } = require('../constants.js');

dotenv.config({
  path: './.env',
});

/** Function to connect to antisosh dB */
const handleConnectdB = async () => {
  try {
    const conectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\n MongodB connected !! DB HOST: ${conectionInstance.connection.host}`
    );
  } catch (error) {
    console.error('MongodB connecting faild', error);
    process.exit(1);
  }
};

module.exports = handleConnectdB;
