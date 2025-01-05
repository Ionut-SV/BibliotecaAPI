import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard'; // Import the BookCard component
import Buttons from '../components/Buttons'; // Import Buttons component for Login/Register/Logout functionality
import '../styles/BooksPage.css';

const BookListPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]); // State to hold the filtered books

  // States for search input
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');

  // States for dropdown visibility
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isAuthorDropdownOpen, setIsAuthorDropdownOpen] = useState(false);

  // Suggestions for dropdown menus
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
          setFilteredBooks(booksData); // Initialize with all books
        } else {
          console.error('Failed to fetch books');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }

    fetchBooks();
  }, []);

  // Fetch genres from the backend
  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetch('http://localhost:5000/books/genres');
        if (response.ok) {
          const genresData = await response.json();
          setGenreSuggestions(genresData); // Assuming backend returns an array of genres
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    }

    fetchGenres();
  }, []);

  // Fetch authors from the backend
  useEffect(() => {
    async function fetchAuthors() {
      try {
        const response = await fetch('http://localhost:5000/books/authors');
        if (response.ok) {
          const authorsData = await response.json();
          setAuthorSuggestions(authorsData); // Assuming backend returns an array of authors
        }
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    }

    fetchAuthors();
  }, []);

  // Event handlers for toggling dropdown visibility
  const handleGenreButtonClick = () => {
    setIsGenreDropdownOpen((prev) => !prev);
    setIsAuthorDropdownOpen(false); // Close author dropdown if open
  };

  const handleAuthorButtonClick = () => {
    setIsAuthorDropdownOpen((prev) => !prev);
    setIsGenreDropdownOpen(false); // Close genre dropdown if open
  };

  // Event handlers for selecting genre and author
  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setIsGenreDropdownOpen(false); // Close the dropdown
  };

  const handleAuthorSelect = (author) => {
    setSelectedAuthor(author);
    setIsAuthorDropdownOpen(false); // Close the dropdown
  };

  // Function to handle search
  const handleSearchClick = () => {
    // Filter books based on searchQuery, selectedGenre, and selectedAuthor
    const filtered = books.filter((book) => {
      const titleMatch = book.titlu.toLowerCase().includes(searchQuery.toLowerCase());
      const authorMatch = selectedAuthor ? book.autor.toLowerCase().includes(selectedAuthor.toLowerCase()) : true;
      const genreMatch = selectedGenre ? book.gen.toLowerCase().includes(selectedGenre.toLowerCase()) : true;

      return titleMatch && authorMatch && genreMatch;
    });

    setFilteredBooks(filtered); // Update the filteredBooks state with the filtered books
  };

  return (
    <div className="Books-page">
      {/* Authentication buttons at the top left */}
      <div className="header">
        <Buttons />
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Cauta o carte..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearchClick}>Cauta</button> {/* Trigger search on click */}
      </div>

      {/* Filters */}
      <div className="filters">
        {/* Genre filter */}
        <div className="filter">
          <button className="filter-button" onClick={handleGenreButtonClick}>
            Selecteaza Categorie: {selectedGenre || 'Toate'}
          </button>
          {isGenreDropdownOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => handleGenreSelect('')}>Toate</li> {/* Reset filter */}
              {genreSuggestions.map((genre, index) => (
                <li key={index} onClick={() => handleGenreSelect(genre)}>
                  {genre}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Author filter */}
        <div className="filter">
          <button className="filter-button" onClick={handleAuthorButtonClick}>
            Selecteaza Autor: {selectedAuthor || 'Toti'}
          </button>
          {isAuthorDropdownOpen && (
            <ul className="dropdown-menu">
              {/* Add "All" option to the dropdown */}
              <li onClick={() => handleAuthorSelect('')}>Toti</li>
              {authorSuggestions.map((author, index) => (
                <li key={index} onClick={() => handleAuthorSelect(author)}>
                  {author}
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
              editura={book.editura}
              stoc={book.stoc}
              descriere={book.descriere}
              pret={book.pret}
              image_url={book.image_url}
            />
          ))
        ) : (
          <p className="no-results-message">Nu am gasit nicio carte cu datele introduse.</p>
        )}
      </div>
    </div>
  );
};

export default BookListPage;
