// src/components/BookList.jsx
import React, { useState, useEffect } from 'react';
import BookCard from './BookCard'; // Assuming you have a BookCard component to display each book

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('http://localhost:5000/books'); // Update with your actual API route
        if (response.ok) {
          const booksData = await response.json();
          setBooks(booksData);
        } else {
          console.error('Error fetching books');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }

    fetchBooks();
  }, []);

  return (
    <div className="book-list">
      {books.length > 0 ? (
        books.map((book) => (
          <BookCard
            key={book.id_carte}
            id={book.id_carte}
            title={book.titlu}
            author={book.autor}
            genre={book.gen}
            imageUrl={book.image_url} 
          />
        ))
      ) : (
        <p>No books available.</p>
      )}
    </div>
  );
};

export default BookList;
