import { useState } from "react";

export default function HomePage() {
  const [film, setFilm] = useState(null);
  const [filmsShown, setFilmsShown] = useState({});

  async function getFilmsByMood(mood) {
    try {
      const res = await fetch(`http://localhost:3001/films?mood=${mood}`);
      if (!res.status === 200) {
      }
      const films = await res.json();
      return films;
    } catch {
      return null;
    }
  }

  const handleMoodButtonClick = async (mood) => {
    const randomFilm = await getFilmsByMood(mood);

    if (film && film._id === randomFilm._id) {
      return handleMoodButtonClick(mood);
    }

    setFilm(randomFilm);

    const updatedFilmsShown = { ...filmsShown };

    if (!updatedFilmsShown[mood]) {
      updatedFilmsShown[mood] = [randomFilm._id];
    } else if (!updatedFilmsShown[mood].includes(randomFilm._id)) {
      updatedFilmsShown[mood].push(randomFilm._id);
    }

    setFilmsShown(updatedFilmsShown);
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
