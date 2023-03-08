import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'; 
import { db } from './firebase';

export const noteDB = {
    create: async (note) => {
        const docRef = await addDoc((collection(db, 'notes')), {
            headline: note.headline,
            body: note.body,
            hasImage: note.hasImage,
        });

        return docRef.id;
    },
    readAll: async () => {
        notes = [];

        const querySnapshot = await getDocs(collection(db, 'notes'));
        querySnapshot.forEach((doc) => {
            let docData = doc.data();

            notes.push({
                id: doc.id,
                headline: docData.headline,
                body: docData.body,
                hasImage: docData.hasImage,
            });
        });

        return notes;
    },
    update: async (note) => {
        const ref = doc(db, 'notes', note.id);

        await updateDoc(ref, {
            headline: note.headline,
            body: note.body,
            hasImage: note.hasImage,
        });
    },
    delete: async (noteId) => {
        await deleteDoc(doc(db, 'notes', noteId));
    },
};
