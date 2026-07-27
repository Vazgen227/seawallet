import localForage from 'localforage';

const photoStore = localForage.createInstance({
    name: 'seawall',
    storeName: 'photos'
});

// Сжатие перед сохранением
function compressImage(file: File, maxWidth = 1200, quality = 0.75): Promise<string>{
    return new Promise ((resolve) =>{
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = Math.min(1, maxWidth / img.width);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = e.target?.result as string;
        }
        reader.readAsDataURL(file);
    })
}

// Сохранить фото — возвращает photoId
export async function savePhoto(documentId: string, file: File): Promise<string> {
    const base64 = await compressImage(file);
    const photoId = `photo_${documentId}`;
    await photoStore.setItem(photoId, base64);
    return photoId;
}

// Получить фото по photoId
export async function getPhoto(photoId: string): Promise<string | null> {
    return await photoStore.getItem<string>(photoId);
}

// Удалить фото
export async function deletePhoto(photoId: string): Promise<void> {
    await photoStore.removeItem(photoId);
}

// Сколько фото сохранено (для лимита)
export async function getPhotoCount(): Promise<number> {
    const keys = await photoStore.keys();
    return keys.length;
}