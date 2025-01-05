import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { notification } from 'antd'; // For notifications
import Buttons from '../components/Buttons'; // Your button component
import '../styles/Upload.css';

function BookUpdateForm() {
  const [titlu, setTitlu] = useState('');
  const [autor, setAutor] = useState('');
  const [gen, setGen] = useState('');
  const [an_publicare, setAnPublicare] = useState('');
  const [editura, setEditura] = useState('');
  const [stoc, setStoc] = useState('');
  const [descriere, setDescriere] = useState('');
  const [pret, setPret] = useState('');
  const [image, setImage] = useState(null);
  const { id } = useParams(); // Get the book ID from the URL
  const history = useHistory(); // For navigation after update

  // Fetch the current book data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:5000/books/${id}`);
        const data = await response.json();
        
        setTitlu(data.titlu);
        setAutor(data.autor);
        setGen(data.gen);
        setAnPublicare(data.an_publicare);
        setEditura(data.editura);
        setStoc(data.stoc);
        setDescriere(data.descriere);
        setPret(data.pret);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();
  }, [id]);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', image); 
    formData.append('titlu', titlu);
    formData.append('autor', autor);
    formData.append('gen', gen);
    formData.append('an_publicare', an_publicare);
    formData.append('editura', editura);
    formData.append('stoc', stoc);
    formData.append('descriere', descriere);
    formData.append('pret', pret);

    try {
      const response = await fetch(`http://localhost:5000/books/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        notification.success({
          message: 'Carte Actualizata',
          description: 'Carte a fost actualizata cu succes!',
          duration: 3,
        });
        history.push('/books'); // Navigate back to the book list page after successful update
      } else {
        notification.error({
          message: 'Eroare',
          description: 'Actualizarea cartii a esuat.',
          duration: 3,
        });
      }
    } catch (error) {
      console.error('Error updating book:', error);
      notification.error({
        message: 'Eroare',
        description: 'Actualizarea cartii a esuat.',
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
          <label>Categorie:</label>
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
          <label>Descriere:</label>
            <textarea
              value={descriere}
              onChange={(e) => setDescriere(e.target.value)}
              required
              className="description-textarea"
            />
        </div>

        <div className="form-item-up">
          <label>Pret:</label>
          <input
            type="text"
            value={pret}
            onChange={(e) => setPret(e.target.value)}
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

export default BookUpdateForm;
