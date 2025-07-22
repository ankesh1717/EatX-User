export const calculateCartTotal =(cartItems, quantities) =>{
     const subtotal = cartItems.reduce(
    (acc, food) => acc + food.price * quantities[food.id],
    0
  );
  const shipping = subtotal === 0 ? 0.0 : 10;
  const tax = subtotal * 0.12; //12%
  const total = subtotal + shipping + tax;
  return{subtotal, shipping, tax, total};
}
