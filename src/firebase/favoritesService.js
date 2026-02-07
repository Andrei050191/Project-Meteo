import { db, auth, authReady } from "./firebaseConfig";
import { collection, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";

const favCol = (uid) => collection(db, "favorites", uid, "cities");

export async function getFavorites() {
  await authReady;
  const uid = auth.currentUser.uid;
  const snap = await getDocs(favCol(uid));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addFavorite(city) {
  await authReady;
  const uid = auth.currentUser.uid;
  await setDoc(doc(favCol(uid), city.id), city);
}

export async function removeFavorite(id) {
  await authReady;
  const uid = auth.currentUser.uid;
  await deleteDoc(doc(favCol(uid), id));
}
