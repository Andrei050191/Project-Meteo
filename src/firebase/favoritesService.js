import { db, auth } from "./firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

// helper: așteaptă autentificarea
function getUserId() {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      resolve(auth.currentUser.uid);
    } else {
      auth.onAuthStateChanged((user) => {
        if (user) resolve(user.uid);
      });
    }
  });
}

export async function addFavorite(city) {
  const userId = await getUserId();

  const ref = doc(
    collection(db, "favorites", userId, "cities"),
    city.id
  );

  await setDoc(ref, {
    name: city.name,
    country: city.country,
    addedAt: serverTimestamp()
  });
}

export async function removeFavorite(cityId) {
  const userId = await getUserId();

  const ref = doc(
    collection(db, "favorites", userId, "cities"),
    cityId
  );

  await deleteDoc(ref);
}

export async function getFavorites() {
  const userId = await getUserId();

  const ref = collection(db, "favorites", userId, "cities");
  const snapshot = await getDocs(ref);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
}
