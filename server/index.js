import "dotenv/config";

import express from "express";
const app = express();
const PORT = 3001;

import {
  login,
  getFilmsByMood,
  register,
  updateUsername,
  updatePassword,
} from "./db.js";

import bodyParser from "body-parser";
app.use(bodyParser.json());

import cookieParser from "cookie-parser";
app.use(cookieParser());

import cors from "cors"; // serve per dire al browser che il dominio da cui si sta facendo la chiamata è accettato dal server
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // guarda che arriverrano dei cookie come parte del processo di autenticazione
};
app.use(cors(corsOptions));

import session from "express-session";
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: "segreto", //stringa per criptare il cookie
    cookie: {
      secure: false,
    },
  })
);

//endpoint per creare una sessione
app.post("/sessions", async (req, res) => {
  const [exists, _] = await login(req.body.username, req.body.password);
  if (exists) {
    // se l'utente esiste
    req.session.logged = true; //allora lo mette in sessione
    req.session.username = req.body.username; //mette in sessione l'username che prende dal body
    res.json({ msg: "logged in", sessionID: req.sessionID }); //risponde
  } else {
    res.status(401).json({
      msg: "Il nome utente o la password inseriti non sono corretti, per favore riprova.",
    });
  }
});

//endpoint per leggere una sessione
app.get("/sessions", (req, res) => {
  if (req.session.logged) {
    //chiede se c'è l'utenete loggato in sessione
    res.status(200).json({ username: req.session.username }); //se c'è risponde con l'username
  } else {
    res.status(401).json({ msg: "User did not log in" }); //se no risponde errore
  }
});

app.get("/films", async (req, res) => {
  const { mood } = req.query;
  try {
    const films = await getFilmsByMood(mood);
    if (!films) {
      res.status(500).json({ msg: "Errore durante il recupero dei film" });
      return;
    }
    res.json(films);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Errore durante il recupero dei film" });
  }
});

app.delete("/sessions", async (req, res) => {
  // Controlla se l'utente è loggato
  if (req.session.logged) {
    // Elimina i dati della sessione
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: "Errore durante il logout" });
      } else {
        // Invia una risposta quando è un successo
        res.json({ msg: "Logout effettuato" });
      }
    });
  } else {
    // L'utente non è loggato
    res.status(401).json({ msg: "Utente non loggato" });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const [success, _] = await register(username, password);
  if (success) {
    res.status(201).json({ msg: "Registration successful" });
  } else {
    res.status(400).json({ msg: "Registration failed" });
  }
});

app.put("/change-username", async (req, res) => {
  //  se l'utente è autenticato
  if (!req.session.logged) {
    return res.status(401).json({ msg: "Utente non autenticato" });
  }

  const { newUsername } = req.body;

  // Verifichiamo se il nuovo nome utente è stato fornito
  if (!newUsername) {
    return res.status(400).json({ msg: "Il nuovo nome utente è richiesto" });
  }

  try {
    // Aggiorniamo il nome utente nel database
    const updatedUser = await updateUsername(req.session.username, newUsername);

    // Aggiorniamo anche il nome utente nella sessione
    req.session.username = newUsername;

    res.status(200).json({
      msg: "Nome utente aggiornato con successo",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Errore durante l'aggiornamento del nome utente:", error);
    res.status(500).json({
      msg: "Si è verificato un errore durante l'aggiornamento del nome utente",
    });
  }
});

app.put("/change-password", async (req, res) => {
  // Verifichiamo se l'utente è autenticato
  if (!req.session.logged) {
    return res.status(401).json({ msg: "Utente non autenticato" });
  }

  const { currentPassword, newPassword } = req.body; // Estrai entrambe le password dal corpo della richiesta

  // Verifichiamo se il nuovo nome utente è stato fornito
  if (!newPassword) {
    return res.status(400).json({ msg: "La nuova password è richiesta" });
  }

  try {
    // Verifica che la password corrente sia corretta
    const [isValid, _] = await login(req.session.username, currentPassword);
    if (!isValid) {
      return res
        .status(401)
        .json({ msg: "La password corrente non è corretta" });
    }

    // Aggiorniamo la password nel database
    const updatedPassword = await updatePassword(
      req.session.username,
      newPassword
    );

    res.status(200).json({
      msg: "Password aggiornata con successo",
      user: updatedPassword,
    });
  } catch (error) {
    console.error("Errore durante l'aggiornamento della password:", error);
    res.status(500).json({
      msg: "Si è verificato un errore durante l'aggiornamento della password",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Il server Express è in esecuzione sulla porta ${PORT}`);
});
