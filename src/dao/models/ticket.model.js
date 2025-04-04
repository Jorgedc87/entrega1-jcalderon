import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    default: function () {
      return 'TICKET-' + Date.now();
    },
    unique: true
  },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: false },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      title: String,
      price: Number,
      quantity: Number
    }
  ]
});

export const ticketModel = mongoose.model("Ticket", ticketSchema);
