import mongoose, { Schema, Document, Types, Model } from "mongoose";

// Cart item interface
export interface ICartItem {
  product: Types.ObjectId;
  qty: number;
  priceAtAdd: number;
  _id: Types.ObjectId;
}

// Cart interface
export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
  getTotal: () => number;
}

// Cart item schema
const CartItemSchema: Schema<ICartItem> = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  qty: { type: Number, required: true },
  priceAtAdd: { type: Number, required: true },
});

// Cart schema
const CartSchema: Schema<ICart> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [CartItemSchema], default: [] },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Type-safe getTotal
CartSchema.methods.getTotal = function (this: ICart) {
  return this.items.reduce((sum, item) => sum + item.qty * item.priceAtAdd, 0);
};

// Export Cart model
const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
export default Cart;
