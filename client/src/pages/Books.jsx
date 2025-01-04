import React, { useState, useEffect } from 'react';
import '../styles/BookCard.css';
import BookCard from '../components/BookCard';

function BooksPage() {
  const [Books, setBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [appliedGenre, setAppliedGenre] = useState('all');
  const [appliedAuthor, setAppliedAuthor] = useState('all');

  // For storing suggestions
  const [genreSuggestions, setGenreSuggestions] = useState([]);
  const [authorSuggestions, setAuthorSuggestions] = useState([]);

  // Fetch books from backend
  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('http://localhost:5000/books');
        if (response.ok) {
          const books = await response.json();
          const projectList = books.map(book => ({
            id: book.id_carte,
            title: book.titlu,
            description: book.gen, 
            imageUrl: book.image_url ? `http://localhost:5000${book.image_url}` : null,
            author: book.autor,
            genre: book.gen,  
          }));
          setBooks(projectList);
        } else {
          console.error('Failed to fetch Books. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching Books:', error);
      }
    }

    fetchBooks();
  }, []);

  // Fetch genre suggestions as the user types
  const handleGenreSearchChange = async (event) => {
    const query = event.target.value;
    setSelectedGenre(query);
    
    if (query.length > 2) {
      try {
        const response = await fetch(`http://localhost:5000/books/genres?q=${query}`);
        if (response.ok) {
          const genres = await response.json();
          setGenreSuggestions(genres.filter(genre => genre.toLowerCase().includes(query.toLowerCase())));
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    } else {
      setGenreSuggestions([]);
    }
  };

  // Fetch author suggestions as the user types
  const handleAuthorSearchChange = async (event) => {
    const query = event.target.value;
    setSelectedAuthor(query);

    if (query.length > 2) {
      try {
        const response = await fetch(`http://localhost:5000/books/authors?q=${query}`);
        if (response.ok) {
          const authors = await response.json();
          setAuthorSuggestions(authors.filter(author => author.toLowerCase().includes(query.toLowerCase())));
        }
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    } else {
      setAuthorSuggestions([]);
    }
  };

  // Handle the search button click
  const handleSearchButtonClick = () => {
    setAppliedQuery(searchQuery);
    setAppliedGenre(selectedGenre);
    setAppliedAuthor(selectedAuthor);
  };

  // Filter books based on applied genre, author, and the applied search query
  const filteredBooks = Books.filter((book) => {
    const genreMatches = appliedGenre === 'all' || book.genre.toLowerCase().includes(appliedGenre.toLowerCase());
    const authorMatches = appliedAuthor === 'all' || book.author.toLowerCase().includes(appliedAuthor.toLowerCase());
    const searchMatches = book.title?.toLowerCase().includes(appliedQuery.toLowerCase()) ?? false;
    return genreMatches && authorMatches && searchMatches;
  });

  return (
    <div className="Books-page">
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
      <div className="filters">
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
        <div className="filter">
          <label htmlFor="author-select">Autor:</label>
          <input
            id="author-select"
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
      <div className="project-list">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              description={book.description}
              imageUrl={book.imageUrl}
              author={book.author}
              genre={book.genre}
            />
          ))
        ) : (
          <p>No books found for this search.</p>
        )}
      </div>
    </div>
  );
}

export default BooksPage;
