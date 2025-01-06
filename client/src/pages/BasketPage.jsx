import React, { useEffect, useState } from 'react';
import { useBasket } from '../contexts/BasketContext';
import { notification, Modal, InputNumber } from 'antd'; // Import Ant Design Modal and InputNumber
import axios from 'axios';
import Buttons from '../components/Buttons'; // Import Buttons component
import '../styles/Basket.css';

const BasketPage = () => {
  const { basketItems, removeFromBasket, clearBasket, updateQuantity } = useBasket();
  const [bookData, setBookData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);

  // Calculate the total price of all items in the basket
  const calculateTotalPrice = () => {
    return basketItems.reduce((total, item) => {
      const price = bookData[item.id_carte]?.pret || 0;
      return total + price * item.cantitate;
    }, 0);
  };

  useEffect(() => {
    const fetchBookData = async () => {
      const fetchedData = {};
      const missingBooks = basketItems.filter((item) => !bookData[item.id_carte]);

      if (missingBooks.length === 0) return;

      try {
        for (const item of missingBooks) {
          const response = await axios.get(`http://localhost:5000/books/${item.id_carte}`);
          fetchedData[item.id_carte] = {
            titlu: response.data?.titlu || 'Unknown Title',
            autor: response.data?.autor || 'Unknown Author', 
            pret: parseFloat(response.data?.pret || 0),
            imagine: response.data?.image_url
              ? `http://localhost:5000${response.data.image_url}`
              : '',
          };
        }
        setBookData((prev) => ({ ...prev, ...fetchedData }));
      } catch (error) {
        console.error('Error fetching book data:', error);
      }
    };

    fetchBookData();
  }, [basketItems]);

  const handlePlaceOrder = async () => {
    try {
      console.log('Comanda:', basketItems);
      notification.success({
        message: 'Comandă plasată',
        description: 'Comanda ta a fost plasată cu succes!',
        duration: 3,
      });
      clearBasket();
    } catch (error) {
      notification.error({
        message: 'Eroare',
        description: 'A apărut o problemă la plasarea comenzii.',
        duration: 3,
      });
    }
  };

  const showEditModal = (item) => {
    setEditingItem(item);
    setNewQuantity(item.cantitate);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (editingItem) {
      // Update the basket item with the new quantity
      updateQuantity(editingItem.id_carte, newQuantity);
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (basketItems.length === 0) {
    return (
      <div className="basket-page">
        <div className="button-section">
          <Buttons />
        </div>
        <p>Coșul tău este gol.</p>
      </div>
    );
  }

  return (
    <div className="basket-page">
      <div className="button-section">
        <Buttons />
      </div>
      <div className="basket-card">
        <h1 className="basket-header">Coșul meu</h1>
        <ul className="basket-items">
          {basketItems.map((item) => {
            const book = bookData[item.id_carte];
            const title = book?.titlu || 'Unknown Title';
            const author = book?.autor || 'Unknown Author'; // Fetch the author
            const price = book?.pret?.toFixed(2) || '0.00';
            const imageUrl = book?.imagine || '';
            const totalPrice = (price * item.cantitate).toFixed(2); // Price per item x quantity

            return (
              <li key={item.id_carte} className="basket-item">
                <div className="basket-item-row">
                  {imageUrl && (
                    <img src={imageUrl} alt={title} className="basket-item-image" />
                  )}
                  <div className="details-column">
                    <h2>{title} - {author}</h2> {/* Title and author side by side */}
                    <p>
                      {item.cantitate} x {price} RON
                    </p>
                  </div>
                  <div className="price-remove">
                    <div className="price">{totalPrice} RON</div>
                    <button
                      className="edit-button"
                      onClick={() => showEditModal(item)}
                    >
                      Editează
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => removeFromBasket(item.id_carte)}
                    >
                      Șterge
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Display the total price */}
        <div className="total-price">
          <h3>Total: {calculateTotalPrice().toFixed(2)} RON</h3>
        </div>

        <button className="place-order-button" onClick={handlePlaceOrder}>
          Plasează Comanda
        </button>
      </div>

      {/* Modal to Edit Quantity */}
      <Modal
        title="Editează cantitatea"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <InputNumber
          min={1}
          value={newQuantity}
          onChange={setNewQuantity}
          style={{ width: '100%' }}
        />
      </Modal>
    </div>
  );
};

export default BasketPage;
