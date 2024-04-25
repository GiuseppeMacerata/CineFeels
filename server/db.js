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
  return [res != null, res];
}

export async function register(username, password) {
  const existingUser = await client
    .db("CineFeels")
    .collection("users")
    .findOne({ username });

  if (existingUser) {
    return [false, { message: "Username già in uso" }];
  }

  const res = await client
    .db("CineFeels")
    .collection("users")
    .insertOne({ username, password });

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
  const db = client.db("CineFeels");
  const usersCollection = db.collection("users");

  await usersCollection.updateOne(
    { username: currentUsername },
    { $set: { username: newUsername } }
  );

  return { username: newUsername };
}

export async function updatePassword(username, newPassword) {
  const db = client.db("CineFeels");
  const usersCollection = db.collection("users");

  const updatedUser = await usersCollection.updateOne(
    { username: username },
    { $set: { password: newPassword } }
  );

  return updatedUser;
}
