export function calculateTotalPrice(cartItems) {
  const totalPrice = cartItems.reduce((acc, item) => {
    return (
      acc + (item?.unit?.price || item?.productId?.price || 0) * item.quantity
    );
  }, 0);

  const deliveryFee = 7.99;
  const grandTotal = totalPrice + deliveryFee;

  return { totalPrice, grandTotal };
}
