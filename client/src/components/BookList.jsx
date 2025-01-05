import React, { useState, useEffect } from 'react';
import BookCard from './BookCard'; // Import the BookCard component
import { Button } from 'antd'; // Import the Button component from Ant Design
import { useAuth } from '../contexts/AuthContext'; // Import useAuth to check the user role

const BookListPage = () => {
  const [books, setBooks] = useState([]);
  const { user } = useAuth(); // Get the current user from context

  useEffect(() => {
    // Fetch books from your API
    async function fetchBooks() {
      try {
        const response = await fetch('http://localhost:5000/books');
        if (response.ok) {
          const booksData = await response.json();
          setBooks(booksData);
        } else {
          console.error('Failed to fetch books');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }

    fetchBooks();
  }, []);

  const handleUploadClick = () => {
    // Redirect to the upload page or show the upload form
    console.log('Upload button clicked');
  };

  return (
    <div className="book-list">
      {user && user.role === 'bibliotecar' && (
        <Button 
          type="primary" 
          onClick={handleUploadClick} 
          style={{ marginBottom: '20px' }}
        >
          Adauga o carte noua.
        </Button>
      )}

      {books.length > 0 ? (
        books.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            titlu={book.titlu}
            autor={book.autor}
            categorie={book.gen}
            an_publicare={book.an_publicare}
            editura={book.editura}
            stoc={book.stoc}
          />
        ))
      ) : (
        <p>No books available</p>
      )}
    </div>
  );
};

export default BookListPage;
