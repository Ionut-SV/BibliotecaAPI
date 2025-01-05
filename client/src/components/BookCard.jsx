import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/BookCard.css"; // Ensure you have styles for your cards

function BookCard({ id, titlu, autor, categorie, pret, image_url }) {
  return (
    <Link to={`/book/${id}`} className="book-card-link">
      <div className="book-card">
        <div className="card-image">
          {image_url ? (
            <img src={`http://localhost:5000${image_url}`} alt={titlu} />
          ) : (
            <p>No image available</p> // Placeholder text if there's no image
          )}
        </div>
        <div className="card-content">
          <h3>{titlu}</h3>
          <p>de {autor}</p>
          <p>Categorie: {categorie}</p>
          {pret !== undefined && <p>Pret: {pret}</p>}
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
