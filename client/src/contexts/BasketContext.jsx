import React, { createContext, useContext, useState } from 'react';

const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
  const [basketItems, setBasketItems] = useState([]);

  const addToBasket = (book) => {
    setBasketItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id_carte === book.id_carte);
      if (existingItem) {
        // Update quantity if book is already in the basket
        return prevItems.map((item) =>
          item.id_carte === book.id_carte ? { ...item, cantitate: item.cantitate + 1 } : item
        );
      } else {
        // Add new book to the basket
        return [...prevItems, { ...book, cantitate: 1 }];
      }
    });
  };

  const removeFromBasket = (id_carte) => {
    setBasketItems((prevItems) => prevItems.filter((item) => item.id_carte !== id_carte));
  };

  const clearBasket = () => {
    setBasketItems([]);
  };

  const updateQuantity = (id_carte, newQuantity) => {
    setBasketItems((prevItems) => {
      return prevItems.map((item) =>
        item.id_carte === id_carte ? { ...item, cantitate: newQuantity } : item
      );
    });
  };

  return (
    <BasketContext.Provider value={{ basketItems, addToBasket, removeFromBasket, clearBasket, updateQuantity }}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => useContext(BasketContext);
