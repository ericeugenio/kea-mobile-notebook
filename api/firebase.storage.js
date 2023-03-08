import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export const imageStorage = {
    upload: async (imageUri, imageName) => {
        const response = await fetch(imageUri);
        const file = await response.blob();

        await uploadBytes(ref(storage, 'images/' + imageName + '.jpg'), file)
    },
    download: async (imageName) => {
        return await getDownloadURL(ref(storage, 'images/' + imageName + '.jpg'));
    },
    delete: async (imageName) => {
        return await deleteObject(ref(storage, 'images/' + imageName + '.jpg'));
    },
}