import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BookCard.css'; // Ensure you have styles for your cards

function BookCard({ id, title, imageUrl, author, genre }) {
  return (
    <Link to={`/book/${id}`} className="book-card-link">
      <div className="book-card">
        <div className="card-image">
          {imageUrl && <img src={imageUrl} alt={title} />}
        </div>
        <div className="card-content">
          <h3>{title}</h3>
        </div>
        <div className="card-details">
          <p>by {author}</p>
          <p>Genre: {genre}</p>
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
