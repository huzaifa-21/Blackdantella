import User from "../models/userModel.js";
const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { id, color, size, quantity, image, price, name } = req.body;

  // Fetch the user and their cart
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send({ success: false, message: "User not found" });
  }

  const cartData = user.cartdata || [];

  // Check if the same product with the same color and size is already in the cart
  const existingItem = await cartData.find(
    (item) => item.id === id && item.color === color && item.size === size
  );

  if (existingItem) {
    // If product with the same color and size exists, update the quantity
    existingItem.quantity += quantity;
  } else {
    // Otherwise, add it as a new item
    cartData.push({ id, color, size, quantity, image, price, name });
    console.log(cartData)
  }

  // Update the user's cart in the database
  await User.findByIdAndUpdate(userId, { cartdata: cartData });

  res.send({ success: true, message: "Added to cart" });
};

const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { id, color, size } = req.body;
  // Fetch the user and their cart
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send({ success: false, message: "User not found" });
  }

  let cartData = user.cartdata || [];
  // Filter the cart to remove the specific product with the given color and size
  const updatedCart = cartData.filter(
    (item) => !(item.id === id && item.color === color && item.size === size)
  );

  if (cartData.length === updatedCart.length) {
    return res
      .status(404)
      .send({ success: false, message: "Item not found in cart" });
  }
  // Update the user's cart in the database
  await User.findByIdAndUpdate(userId, { cartdata: updatedCart });

  res.send({ success: true, message: "Removed from cart" });
};

const getCart = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.send({ success: false, message: "No user found" });
    }
    res.send({ success: true, data: user.cartdata });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

export { addToCart, removeFromCart, getCart };
