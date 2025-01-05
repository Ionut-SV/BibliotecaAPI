import React, { useState, useEffect } from 'react';
import '../styles/BookCard.css';
import BookCard from './BookCard';
import Buttons from './Buttons'; 

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
  const [autorSuggestions, setAuthorSuggestions] = useState([]);

  // Fetch books from backend
  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('http://localhost:5000/books');
        if (response.ok) {
          const books = await response.json();
          const projectList = books.map(book => ({
            id: book.id_carte,
            titlu: book.titlu,
            autor: book.autor,
            categorie: book.gen,
            an_publicare: book.an_publicare,
            editura: book.editura,
            stoc: book.stoc,
            image_url: book.image_url ? `http://localhost:5000${book.image_url}` : null 
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
        const response = await fetch(`http://localhost:5000/books/categorie?q=${query}`);
        if (response.ok) {
          const categorie = await response.json();
          setGenreSuggestions(categorie.filter(genre => genre.toLowerCase().includes(query.toLowerCase())));
        }
      } catch (error) {
        console.error('Error fetching categorie:', error);
      }
    } else {
      setGenreSuggestions([]);
    }
  };

  // Fetch autor suggestions as the user types
  const handleAuthorSearchChange = async (event) => {
    const query = event.target.value;
    setSelectedAuthor(query);

    if (query.length > 2) {
      try {
        const response = await fetch(`http://localhost:5000/books/autor?q=${query}`);
        if (response.ok) {
          const autor = await response.json();
          setAuthorSuggestions(autor.filter(autor => autor.toLowerCase().includes(query.toLowerCase())));
        }
      } catch (error) {
        console.error('Error fetching autor:', error);
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

  // Filter books based on applied genre, autor, and the applied search query
  const filteredBooks = Books.filter((book) => {
    const genreMatches = appliedGenre === 'all' || book.categorie.toLowerCase().includes(appliedGenre.toLowerCase());
    const autorMatches = appliedAuthor === 'all' || book.autor.toLowerCase().includes(appliedAuthor.toLowerCase());
    const searchMatches = book.titlu?.toLowerCase().includes(appliedQuery.toLowerCase()) ?? false;
    return genreMatches && autorMatches && searchMatches;
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
          <label htmlFor="autor-select">Autor:</label>
          <input
            id="autor-select"
            type="text"
            value={selectedAuthor}
            onChange={handleAuthorSearchChange}
            placeholder="Cauta un autor..."
          />
          {autorSuggestions.length > 0 && (
            <ul className="suggestions">
              {autorSuggestions.map((suggestion, index) => (
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
}

export default BooksPage;
