const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(process.env.MONGOGB_CONNECT_KEY, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connect successfully!!!!');
  } catch (error) {
    console.log('Connect fail!!!!');
  }
}
module.exports = { connect };
