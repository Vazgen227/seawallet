import { useEffect, useRef, useState } from 'react';
import { savePhoto, getPhoto, deletePhoto, getPhotoCount } from '../../lib/photoStorage';

const FREE_PHOTO_LIMIT = 5; // бесплатный лимит

interface Props {
    documentId: string;
    photoId?: string;
    onPhotoSaved: (photoId: string) => void;
    onPhotoDeleted: () => void;
}

export default function DocPhoto({ documentId, photoId, onPhotoSaved, onPhotoDeleted }: Props) {
    const [preview, setPreview] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [limitReached, setLimitReached] = useState(false);
    const cameraRef = useRef<HTMLInputElement>(null);
    const galleryRef = useRef<HTMLInputElement>(null);

    // Загружаем превью при монтировании
    useEffect(() => {
        if (photoId) {
            getPhoto(photoId).then(setPreview);
        }
    }, [photoId]);

    const handleFile = async (file: File) => {
        if (!file) return;

        // Проверка лимита если фото ещё нет
        if (!photoId) {
            const count = await getPhotoCount();
            if (count >= FREE_PHOTO_LIMIT) {
                setLimitReached(true);
                return;
            }
        }

        setLoading(true);
        try {
            const id = await savePhoto(documentId, file);
            const base64 = await getPhoto(id);
            setPreview(base64);
            onPhotoSaved(id);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (photoId) {
            await deletePhoto(photoId);
            setPreview(null);
            onPhotoDeleted();
        }
    };

    return (
        <>
            {/* Скрытые инпуты */}
            <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    e.target.value = '';
                }}
            />
            <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    e.target.value = '';
                }}
            />

            {limitReached && (
                <p style={{ color: 'red', fontSize: 13 }}>
                    Бесплатный лимит {FREE_PHOTO_LIMIT} фото исчерпан 🔒
                </p>
            )}

            {preview ? (
                <>
                    {/* Превью — клик открывает модалку */}
                    <img
                        src={preview}
                        alt="Документ"
                        onClick={() => setModalOpen(true)}
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12, cursor: 'pointer' }}
                    />
                    <button onClick={handleDelete}>🗑️ Удалить фото</button>
                </>
            ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => cameraRef.current?.click()}
                        disabled={loading || limitReached}
                    >
                        {loading ? '⏳' : '📷'} Камера
                    </button>
                    <button
                        onClick={() => galleryRef.current?.click()}
                        disabled={loading || limitReached}
                    >
                        🖼️ Галерея
                    </button>
                </div>
            )}

            {/* Модалка полный экран */}
            {modalOpen && preview && (
                <div
                    onClick={() => setModalOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.95)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20
                    }}
                >
                    <img
                        src={preview}
                        alt="Документ"
                        style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 16, objectFit: 'contain' }}
                    />
                    <button
                        onClick={() => setModalOpen(false)}
                        style={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            background: 'rgba(255,255,255,0.15)',
                            border: 'none',
                            borderRadius: 12,
                            color: '#fff',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: 700
                        }}
                    >
                        ✕ Закрыть
                    </button>
                </div>
            )}
        </>
    );
}