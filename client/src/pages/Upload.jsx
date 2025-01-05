import React, { useState } from 'react';

function BookUploadForm() {
  const [titlu, setTitlu] = useState('');
  const [autor, setAutor] = useState('');
  const [gen, setGen] = useState('');
  const [an_publicare, setAnPublicare] = useState('');
  const [editura, setEditura] = useState('');
  const [stoc, setStoc] = useState('');
  const [image, setImage] = useState(null);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', image); // Add the image
    formData.append('titlu', titlu);
    formData.append('autor', autor);
    formData.append('gen', gen);
    formData.append('an_publicare', an_publicare);
    formData.append('editura', editura);
    formData.append('stoc', stoc);

    try {
      const response = await fetch('http://localhost:5000/books/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Carte Adaugata cu succes!');
      } else {
        alert('Adaugarea cartii a esuat.');
      }
    } catch (error) {
      console.error('Error uploading the book:', error);
      alert('Adaugarea cartii a esuat.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Titlu:</label>
        <input
          type="text"
          value={titlu}
          onChange={(e) => setTitlu(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Autor:</label>
        <input
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Categoorie:</label>
        <input
          type="text"
          value={gen}
          onChange={(e) => setGen(e.target.value)}
          required
        />
      </div>
      <div>
        <label>An Publicare:</label>
        <input
          type="text"
          value={an_publicare}
          onChange={(e) => setAnPublicare(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Editura:</label>
        <input
          type="text"
          value={editura}
          onChange={(e) => setEditura(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Stoc:</label>
        <input
          type="number"
          value={stoc}
          onChange={(e) => setStoc(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Imagine:</label>
        <input
          type="file"
          onChange={handleFileChange}
          required
        />
      </div>
      <button type="submit">Adauga Carte</button>
    </form>
  );
}

export default BookUploadForm;
