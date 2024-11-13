import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sendingId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  receivingId: {
    type: String,
    required: true
  },
  sendingUserName: {
    type: String,
    required: true
  },

  receivingUserName: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
},
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
