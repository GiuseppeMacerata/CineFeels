import { MongoClient, ServerApiVersion } from "mongodb";
const uri = process.env.MONGODB_CONNECTION_STRING;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export async function login(username, password) {
  const res = await client
    .db("CineFeels")
    .collection("users")
    .findOne({ username, password });
  console.log("Risultato del login:", res);
  return [res != null, res];
}

export async function register(username, password) {
  // Verifica se esiste già un utente con lo stesso username nel database
  const existingUser = await client
    .db("CineFeels")
    .collection("users")
    .findOne({ username });

  if (existingUser) {
    // Se esiste già un utente con lo stesso username, ritorna errore:
    return [false, { message: "Username già in uso" }];
  }

  // Se non esiste un utente con lo stesso username, continua la registrazione
  const res = await client
    .db("CineFeels")
    .collection("users")
    .insertOne({ username, password });

  console.log("Risultato della registrazione:", res);
  return [true, res];
}

export async function getFilmsByMood(mood) {
  const films = await client
    .db("CineFeels")
    .collection("films")
    .find({ mood })
    .toArray();
  const randomFilm = films[Math.floor(Math.random() * films.length)];
  return randomFilm;
}

export async function updateUsername(currentUsername, newUsername) {
  try {
    const db = client.db("CineFeels");
    const usersCollection = db.collection("users");

    // Effettuiamo l'aggiornamento del documento corrispondente all'username attuale
    const updatedUser = await usersCollection.updateOne(
      { username: currentUsername }, // Selezioniamo il documento con l'username corrente
      { $set: { username: newUsername } } // Aggiorniamo username con il nuovo valore
    );

    return { username: newUsername };
  } catch (error) {
    console.error("Errore durante l'aggiornamento del nome utente:", error);
    throw error;
  }
}

export async function updatePassword(username, newPassword) {
  try {
    const db = client.db("CineFeels");
    const usersCollection = db.collection("users");

    const updatedUser = await usersCollection.updateOne(
      { username: username },
      { $set: { password: newPassword } }
    );

    // Restituisce il risultato dell'aggiornamento
    return updatedUser;
  } catch (error) {
    console.error("Errore durante l'aggiornamento della password:", error);
    throw error;
  }
}
