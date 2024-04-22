import React, { useState } from "react";

function HomePage() {
  const [film, setFilm] = useState(null);
  const [filmsShown, setFilmsShown] = useState({});

  async function getFilmsByMood(mood) {
    try {
      const res = await fetch(`http://localhost:3001/films?mood=${mood}`);
      if (!res.status === 200) {
        throw new Error("Errore durante il recupero dei film");
      }
      const films = await res.json();
      return films;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const handleMoodButtonClick = async (mood) => {
    if (filmsShown[mood]) {
      const randomFilm = await getFilmsByMood(mood);
      if (!filmsShown[mood].includes(randomFilm._id)) {
        const updatedFilmsShown = {
          ...filmsShown,
          [mood]: [...filmsShown[mood], randomFilm._id],
        };
        setFilmsShown(updatedFilmsShown);
        setFilm(randomFilm);
      } else {
        handleMoodButtonClick(mood);
      }
    } else {
      const randomFilm = await getFilmsByMood(mood);
      setFilm(randomFilm);
      setFilmsShown({ ...filmsShown, [mood]: [randomFilm._id] });
    }
  };
  return (
    <div className="home-container">
      <h1 className="question">COME TI SENTI OGGI?</h1>
      <div className="mood-buttons">
        <button
          className="mood-button"
          onClick={() => handleMoodButtonClick("Felicità")}
        >
          😊 Felice
        </button>
        <button
          className="mood-button"
          onClick={() => handleMoodButtonClick("Tristezza")}
        >
          😢 Triste
        </button>
        <button
          className="mood-button"
          onClick={() => handleMoodButtonClick("Rabbia")}
        >
          😠 Arrabbiato
        </button>
      </div>
      {film && (
        <div className="film">
          <img src={film.image_url} alt={film.title} />
          <h2>{film.title}</h2>
          <p>
            <span>Regista:</span> {film.director}
          </p>
          <p>
            <span>Anno:</span> {film.year}
          </p>
          <p>
            <span>Genere:</span> {film.genre}
          </p>
        </div>
      )}
    </div>
  );
}

export default HomePage;
