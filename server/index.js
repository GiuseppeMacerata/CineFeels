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

import cors from "cors";
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

import session from "express-session";
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: "segreto",
    cookie: {
      secure: false,
    },
  })
);

app.post("/sessions", async (req, res) => {
  const [exists, _] = await login(req.body.username, req.body.password);
  if (exists) {
    req.session.logged = true;
    req.session.username = req.body.username;
    res.json({ msg: "Loggato", sessionID: req.sessionID });
  } else {
    res.status(401).json({
      msg: "Il nome utente o la password inseriti non sono corretti, per favore riprova.",
    });
  }
});

app.get("/sessions", (req, res) => {
  if (req.session.logged) {
    res.status(200).json({ username: req.session.username });
  } else {
    res.status(401).json({ msg: "Utente non loggato" });
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
  } catch {
    res.status(500).json({ msg: "Errore durante il recupero dei film" });
  }
});

app.delete("/sessions", async (req, res) => {
  if (req.session.logged) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: "Errore durante il logout" });
      } else {
        res.json({ msg: "Logout effettuato" });
      }
    });
  } else {
    res.status(401).json({ msg: "Utente non loggato" });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const [success, _] = await register(username, password);
  if (success) {
    res.status(201).json({ msg: "Registrazione avvunta con successo" });
  } else {
    res.status(400).json({ msg: "Registrazione fallita" });
  }
});

app.put("/change-username", async (req, res) => {
  if (!req.session.logged) {
    return res.status(401).json({ msg: "Utente non loggato" });
  }

  const { newUsername } = req.body;

  if (!newUsername) {
    return res
      .status(400)
      .json({ msg: "È necessario specificare un nuovo nome utente" });
  }

  try {
    const updatedUser = await updateUsername(req.session.username, newUsername);

    req.session.username = newUsername;

    res.status(200).json({
      msg: "Nome utente aggiornato con successo",
      user: updatedUser,
    });
  } catch {
    res.status(500).json({
      msg: "Si è verificato un errore durante l'aggiornamento del nome utente",
    });
  }
});

app.put("/change-password", async (req, res) => {
  if (!req.session.logged) {
    return res.status(401).json({ msg: "Utente non loggato" });
  }

  const { currentPassword, newPassword } = req.body;

  if (!newPassword) {
    return res
      .status(400)
      .json({ msg: "È necessario specificare una nuova password" });
  }

  try {
    const [isValid, _] = await login(req.session.username, currentPassword);
    if (!isValid) {
      return res
        .status(401)
        .json({ msg: "La password corrente non è corretta" });
    }

    const updatedPassword = await updatePassword(
      req.session.username,
      newPassword
    );

    res.status(200).json({
      msg: "Password aggiornata con successo",
      user: updatedPassword,
    });
  } catch {
    res.status(500).json({
      msg: "Si è verificato un errore durante l'aggiornamento della password",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Il server Express è in esecuzione sulla porta ${PORT}`);
});
