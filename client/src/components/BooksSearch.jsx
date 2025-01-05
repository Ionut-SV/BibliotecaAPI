import React from 'react';

const BooksSearch = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Caută o carte..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: '300px', padding: '10px' }}
      />
      <button onClick={() => console.log('Searching books')}>
        Caută
      </button>
    </div>
  );
};

export default BooksSearch;
