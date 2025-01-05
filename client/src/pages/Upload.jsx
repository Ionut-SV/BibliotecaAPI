import React, { useState } from 'react';
import Buttons from '../components/Buttons';
import { notification } from 'antd'; 
import '../styles/Upload.css';

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
      const response = await fetch('http://localhost:5000/books/add', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        notification.success({
          message: 'Carte Adaugata',
          description: 'Carte a fost adaugata cu succes!',
          duration: 3, // The notification will disappear after 3 seconds
        });
      } else {
        notification.error({
          message: 'Eroare',
          description: 'Adaugarea cartii a esuat.',
          duration: 3,
        });
      }
    } catch (error) {
      console.error('Error uploading the book:', error);
      notification.error({
        message: 'Eroare',
        description: 'Adaugarea cartii a esuat.',
        duration: 3,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container-up">
      <div className="header-up ">
        <Buttons />
      </div>

      <div className="form-card-up">
        <div className="form-item-up">
          <label>Titlu:</label>
          <input
            type="text"
            value={titlu}
            onChange={(e) => setTitlu(e.target.value)}
            required
          />
        </div>

        <div className="form-item-up">
          <label>Autor:</label>
          <input
            type="text"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            required
          />
        </div>

        <div className="form-item-up">
          <label>Categoorie:</label>
          <input
            type="text"
            value={gen}
            onChange={(e) => setGen(e.target.value)}
            required
          />
        </div>

        <div className="form-item-up">
          <label>An Publicare:</label>
          <input
            type="text"
            value={an_publicare}
            onChange={(e) => setAnPublicare(e.target.value)}
            required
          />
        </div>

        <div className="form-item-up">
          <label>Editura:</label>
          <input
            type="text"
            value={editura}
            onChange={(e) => setEditura(e.target.value)}
            required
          />
        </div>

        <div className="form-item-up">
          <label>Stoc:</label>
          <input
            type="text"
            value={stoc}
            onChange={(e) => setStoc(e.target.value)}
            required
          />
        </div>

        <div className="form-item-up">
          <label>Imagine:</label>
          <input
            type="file"
            onChange={handleFileChange}
            required
          />
        </div>

        <button className="button-up" type="submit">Adauga Carte</button>
      </div>
    </form>
  );
}

export default BookUploadForm;
