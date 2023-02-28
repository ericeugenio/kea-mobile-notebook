import firebase from './firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'; 

export const noteDB = {
    create: async (note) => {
        const docRef = await addDoc((collection(firebase.db, 'notes')), {
            headline: note.headline,
            body: note.body,
        });
    },
    readAll: async () => {
        notes = [];

        const querySnapshot = await getDocs(collection(firebase.db, 'notes'));
        querySnapshot.forEach((doc) => {
            let docData = doc.data();

            notes.push({
                id: doc.id,
                headline: docData.headline,
                body: docData.body,
            });
        });

        return notes;
    },
    update: async (note) => {
        const ref = doc(firebase.db, 'notes', note.id);

        await updateDoc(ref, {
            headline: note.headline,
            body: note.body,
        });
    },
    delete: async (noteId) => {
        await deleteDoc(doc(firebase.db, 'notes', noteId));
    },
};
