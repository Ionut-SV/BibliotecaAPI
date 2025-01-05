import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard'; // Import the BookCard component
import Buttons from '../components/Buttons'; // Import Buttons component for Login/Register/Logout functionality
import  '../styles/BooksPage.css';

const BookListPage = () => {
  const [books, setBooks] = useState([]);

  // States for search input
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  
  // States for autocomplete suggestions
  const [genreSuggestions, setGenreSuggestions] = useState([]);
  const [authorSuggestions, setAuthorSuggestions] = useState([]);

  // Fetch books from the API on component load
  useEffect(() => {
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

  // Function to fetch genre suggestions from the backend
  const fetchGenreSuggestions = async (query) => {
    try {
      const response = await fetch(`http://localhost:5000/genres?query=${query}`);
      if (response.ok) {
        const genresData = await response.json();
        setGenreSuggestions(genresData); // Assuming backend returns an array of genres
      }
    } catch (error) {
      console.error('Error fetching genre suggestions:', error);
    }
  };

  // Function to fetch author suggestions from the backend
  const fetchAuthorSuggestions = async (query) => {
    try {
      const response = await fetch(`http://localhost:5000/authors?query=${query}`);
      if (response.ok) {
        const authorsData = await response.json();
        setAuthorSuggestions(authorsData); // Assuming backend returns an array of authors
      }
    } catch (error) {
      console.error('Error fetching author suggestions:', error);
    }
  };

  // Event handlers for search
  const handleSearchButtonClick = () => {
    // Add your logic for searching books based on searchQuery, selectedGenre, and selectedAuthor
  };

  const handleGenreSearchChange = (e) => {
    const query = e.target.value;
    setSelectedGenre(query);
    if (query.length > 1) {
      fetchGenreSuggestions(query);
    }
  };

  const handleAuthorSearchChange = (e) => {
    const query = e.target.value;
    setSelectedAuthor(query);
    if (query.length > 1) {
      fetchAuthorSuggestions(query);
    }
  };

  // Filter books based on search input
  const filteredBooks = books.filter((book) => {
    return (
      book.titlu.toLowerCase().includes(searchQuery.toLowerCase()) &&
      book.autor.toLowerCase().includes(selectedAuthor.toLowerCase()) &&
      book.gen.toLowerCase().includes(selectedGenre.toLowerCase())
    );
  });

  return (
    <div className="Books-page">
      {/* Authentication buttons at the top left */}
      <div className="header">
        <Buttons /> {/* Renders the Login/Register or Logout button based on authentication */}
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Cauta o carte..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearchButtonClick}>
          Cauta
        </button>
      </div>

      {/* Filters: Genre and Author */}
      <div className="filters">
        {/* Genre filter with autocomplete */}
        <div className="filter">
          <label htmlFor="genre-select">Categorie:</label>
          <input
            id="genre-select"
            type="text"
            value={selectedGenre}
            onChange={handleGenreSearchChange}
            placeholder="Cauta o categorie..."
          />
          {genreSuggestions.length > 0 && (
            <ul className="suggestions">
              {genreSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => setSelectedGenre(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Author filter with autocomplete */}
        <div className="filter">
          <label htmlFor="autor-select">Autor:</label>
          <input
            id="autor-select"
            type="text"
            value={selectedAuthor}
            onChange={handleAuthorSearchChange}
            placeholder="Cauta un autor..."
          />
          {authorSuggestions.length > 0 && (
            <ul className="suggestions">
              {authorSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => setSelectedAuthor(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Book list */}
      <div className="book-list">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              titlu={book.titlu}
              autor={book.autor}
              categorie={book.gen}
              an_publicare={book.an_publicare}
              editura= {book.editura}
              stoc= {book.stoc}
              image_url={book.image_url}
            />
          ))
        ) : (
          <p>No books found for this search.</p>
        )}
      </div>
    </div>
  );
};

export default BookListPage;
