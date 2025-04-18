import { itemType } from "../cart/cart-types";

const addItemToCart = (cartItems: any[], item: any, add_one = false) => {
  console.log("iiiiiiiiiiiii", item);
  const duplicate = cartItems.some(
    (cartItem) =>
      cartItem.option === item.option &&
      cartItem.id === item._id &&
      cartItem.size === item.size
  );

  if (duplicate) {
    return cartItems.map((cartItem) => {
      let itemQty = 0;
      !item.qty || add_one
        ? (itemQty = cartItem.qty! + 1)
        : (itemQty = item.qty);

      console.log(itemQty);
      return cartItem.option === item.option &&
        cartItem.id === item.id &&
        cartItem.size === item.size
        ? { ...cartItem, qty: itemQty }
        : cartItem;
    });
  }
  // console.log(itemQty);
  let itemQty = 0;
  !item.qty ? itemQty++ : (itemQty = item.qty);
  return [
    ...cartItems,
    {
      id: item.id,
      option: item.option,
      reference: item.reference,
      size: item?.size,
      color: item?.color,
      name: item.name,
      price: item.price,
      img1: item.img1,
      img2: item.img2,
      prixAchat: item.prixAchat,
      prixVente: item.prixVente,
      qty: itemQty,
    },
  ];
};

export default addItemToCart;
