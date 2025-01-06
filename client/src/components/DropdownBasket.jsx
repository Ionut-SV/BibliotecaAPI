import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Button } from 'antd';
import { useBasket } from '../contexts/BasketContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BasketDropdown = () => {
  const { basketItems, removeFromBasket } = useBasket();
  const [bookData, setBookData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBookData = async () => {
      const fetchedData = {};
      const missingBooks = basketItems.filter((item) => !bookData[item.id_carte]);

      if (missingBooks.length === 0) return; // Avoid redundant API calls

      setLoading(true);
      try {
        for (const item of missingBooks) {
          const response = await axios.get(`http://localhost:5000/books/${item.id_carte}`);
          fetchedData[item.id_carte] = {
            titlu: response.data?.titlu || 'Unknown Title',
            pret: parseFloat(response.data?.pret || 0),
          };
        }
        setBookData((prev) => ({ ...prev, ...fetchedData }));
      } catch (error) {
        console.error('Error fetching book data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [basketItems]); // Remove `bookData` from dependencies

  const totalPrice = basketItems.reduce((total, item) => {
    const book = bookData[item.id_carte];
    const price = book?.pret || 0;
    return total + price * item.cantitate;
  }, 0);

  const basketMenu = (
    <Menu>
      {basketItems.length > 0 ? (
        basketItems.map((item) => {
          const book = bookData[item.id_carte];
          const title = book?.titlu || (loading ? 'Loading...' : 'Unknown Title');
          const price = book?.pret?.toFixed(2) || '0.00';

          return (
            <Menu.Item key={item.id_carte} style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ flex: 1 }}>
                {title} - {price} RON (x{item.cantitate})
              </span>
              <Button
                type="link"
                danger
                onClick={() => removeFromBasket(item.id_carte)}
                style={{ marginLeft: '10px' }}
              >
                Sterge
              </Button>
            </Menu.Item>
          );
        })
      ) : (
        <Menu.Item key="empty">Cosul este gol</Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="total">
        <strong>Total: {totalPrice.toFixed(2)} RON</strong>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={basketMenu} placement="bottomLeft" trigger={['hover']}>
      <Button type="primary" onClick={() => navigate('/basket')}>
        Cos
      </Button>
    </Dropdown>
  );
};

export default BasketDropdown;
