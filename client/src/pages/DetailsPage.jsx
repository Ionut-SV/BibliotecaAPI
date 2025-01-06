import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/Details.css';
import basketIcon from '../assets/Basket1.jpg';
import Buttons from '../components/Buttons';
import { useAuth } from '../contexts/AuthContext';
import { useBasket } from '../contexts/BasketContext'; // Import Basket Context
import { notification } from 'antd';

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { role, isAuthenticated } = useAuth();
  const { addToBasket } = useBasket(); // Access addToBasket function from Basket Context
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookDetails() {
      try {
        const response = await fetch(`http://localhost:5000/books/${id}`);
        if (response.ok) {
          const bookData = await response.json();
          setBook(bookData);
        } else {
          console.error('Failed to fetch book details');
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    }

    fetchBookDetails();
  }, [id]);

  const handleAddToBasket = () => {
    if (!isAuthenticated || role !== 'membru') {
      notification.warning({
        message: 'Acces restricționat',
        description: 'Doar membrii pot adăuga cărți în coș.',
        duration: 3,
      });
      return;
    }

    addToBasket({ id_carte: id, titlu: book.titlu, pret: book.pret });
    notification.success({
      message: 'Adăugat în coș',
      description: `${book.titlu} a fost adăugată în coș.`,
      duration: 3,
    });
  };

  if (!book) {
    return <p>Cartea nu a fost găsită...</p>;
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/books/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        notification.success({
          message: 'Carte Ștearsă',
          description: 'Carte a fost ștearsă cu succes!',
          duration: 3,
        });
        console.log('Redirecting to /books...');
        navigate('/home'); // Redirect to the books list or home page
      } else {
        notification.error({
          message: 'Eroare',
          description: 'Ștergerea cărții a eșuat.',
          duration: 3,
        });
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      notification.error({
        message: 'Eroare',
        description: 'Ștergerea cărții a eșuat.',
        duration: 3,
      });
    }
  };

  return (
    <div className="book-details">
      <div className="header-button">
        <Buttons />
      </div>
      <h1>{book.titlu}</h1>
      <div className="book-details-row">
        <img src={`http://localhost:5000${book.image_url}`} alt={book.titlu} />
        <div className="details-column">
          <p><strong>Autor:</strong> {book.autor}</p>
          <p><strong>Categorie:</strong> {book.gen}</p>
          <p><strong>Editura:</strong> {book.editura}</p>
          <p><strong>An Publicare:</strong> {book.an_publicare}</p>
          <p className="price"><strong>Pret:</strong> {book.pret} RON</p>
          {role === 'bibliotecar' ? (
            <div className="admin-buttons">
              <Link to={`/update/${id}`}>
                <button className="update-book">Modifică Carte</button>
              </Link>
              <button
                type="button"
                className="delete-book"
                onClick={handleDelete}>
                Șterge Carte
              </button>
            </div>
          ) : (
            <button className="add-to-basket" onClick={handleAddToBasket}>
              <img src={basketIcon} alt="Add to basket" />
            </button>
          )}
        </div>
      </div>
      <p className="description"><strong>Descriere:</strong> {book.descriere}</p>
    </div>
  );
};

export default BookDetailsPage;
