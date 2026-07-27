import { useChecklistStore } from "./useChecklistStore";
import { useState } from "react";
import type { DocumentCategory } from "../../types/types";
import { useContractStore } from "../../app/store/useContractStore";
import styles from "./CheckList.module.css";
import DocPhoto from './DocPhoto';


export default function ChecklistPage() {
    const store = useChecklistStore();
    const contracts = useContractStore().contracts;
    const documents = store.documents;
    const items = store.items;
    
    const removeDocument = store.removeDocument;
    const addDocument = store.addDocument;
    const removeChecklistItem = store.removeChecklistItem;
    const setItemStatus = store.setItemStatus;
    const addChecklistItem = store.addChecklistItem;
    const updateDocument = store.updateDocument;
    const updateDocumentPhoto = store.updateDocumentPhoto;

    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskContractId, setNewTaskContractId] = useState<string | null>(null);
    const [newDocumentTitle, setNewDocumentTitle] = useState("");
    const [newDocumentExpiryDate, setNewDocumentExpiryDate] = useState("");
    const [newCategory, setNewCategory] = useState<DocumentCategory>("passport");
    const [newDescription, setNewDescription] = useState("");

    const handleAddDocument = () => {
        if (!newDocumentTitle || !newDocumentExpiryDate) return;
        addDocument({
            title: newDocumentTitle,
            category: newCategory,
            dateExpired: newDocumentExpiryDate,
            description: newDescription || undefined,
        });
        setNewDocumentTitle("");
        setNewDocumentExpiryDate("");
        setNewCategory("passport");
        setNewDescription("");
    }

    const handleAddItem = () => {
        if (!newTaskTitle) return;
        addChecklistItem({
            title: newTaskTitle,
            status: "pending",
            contractId: newTaskContractId || undefined,
        });
        setNewTaskTitle("");
        setNewTaskContractId(null);
    }

    function getDaysUntilExpiry(dateExpired: string): number {
        const today = new Date();
        const expiry = new Date(dateExpired);
        const diff = expiry.getTime() - today.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    // Функция для получения цвета и фона бейджа (не меняет основную логику, только UI)
    const getExpiryStyle = (days: number) => {
        if (days < 30) return { color: "var(--accent-danger)", bg: "var(--accent-danger-bg)" };
        if (days < 60) return { color: "var(--accent-warning)", bg: "var(--accent-warning-bg)" };
        return { color: "var(--accent-success)", bg: "var(--accent-success-bg)" };
    };

    return (
        <section className={styles.page}>
            <div className={styles.wrapper}>
                
                {/* ===== СЕКЦИЯ ДОКУМЕНТОВ ===== */}
                <div className={styles.header}>
                    <div className={styles.headerLabel}>Раздел</div>
                    <h2 className={styles.headerTitle}>Мои документы</h2>
                </div>

                <div className={styles.formCard}>
                    <div className={styles.fieldGroup}>
                        <input 
                            className={styles.input}
                            value={newDocumentTitle} 
                            onChange={e => setNewDocumentTitle(e.target.value)} 
                            placeholder="Название документа" 
                        />
                        <div className={styles.row}>
                            <select 
                                className={styles.select}
                                value={newCategory} 
                                onChange={e => setNewCategory(e.target.value as DocumentCategory)}
                            >
                                <option value="passport">Паспорт</option>
                                <option value="visa">Виза</option>
                                <option value="seamanBook">Морская книжка</option>
                                <option value="insurance">Страховка</option>
                                <option value="workPermit">Разрешение на работу</option>
                                <option value="certificates">Сертификаты</option>
                                <option value="other">Другое</option>
                            </select>
                            <input 
                                className={styles.input}
                                type="date" 
                                value={newDocumentExpiryDate} 
                                onChange={e => setNewDocumentExpiryDate(e.target.value)} 
                            />
                        </div>
                        <input 
                            className={styles.input}
                            value={newDescription} 
                            onChange={e => setNewDescription(e.target.value)} 
                            placeholder="Описание (необязательно)" 
                        />
                    </div>
                    <button className={styles.btnPrimary} onClick={handleAddDocument}>Добавить документ</button>
                </div>

                <div className={styles.listCard}>
                    <h3 className={styles.listTitle}>Актуальные документы</h3>
                    {documents.length === 0 
                        ? <div className={styles.emptyState}>Документов пока нет</div>
                        : (
                            <div className={styles.itemList}>
                                {documents.map(doc => {

                                    const days = getDaysUntilExpiry(doc.dateExpired);
                                    const style = getExpiryStyle(days);
                                    return (
                                        <div key={doc.id} className={styles.docItem}>
                                            <DocPhoto
                                                documentId={doc.id}
                                                photoId={doc.photoId}
                                                onPhotoSaved={(photoId) => updateDocumentPhoto(doc.id, photoId)}
                                                onPhotoDeleted={() => updateDocument(doc.id, { photoId: undefined })}
                                            />
                                            <div className={styles.docInfo}>
                                                <span className={styles.docTitle}>{doc.title}</span>
                                                <span className={styles.docCategory}>{doc.category}</span>
                                            </div>
                                            <div className={styles.docRight}>
                                                <span className={styles.expiryBadge} style={{ color: style.color, background: style.bg }}>
                                                    {days} дн.
                                                </span>
                                                <button className={styles.btnDelete} onClick={() => removeDocument(doc.id)}>✕</button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    }
                </div>

                {/* ===== СЕКЦИЯ ЗАДАЧ ===== */}
                <div className={styles.header} style={{ marginTop: '16px' }}>
                    <div className={styles.headerLabel}>Планирование</div>
                    <h2 className={styles.headerTitle}>Список задач</h2>
                </div>

                <div className={styles.formCard}>
                    <div className={styles.fieldGroup}>
                        <input 
                            className={styles.input}
                            value={newTaskTitle} 
                            onChange={e => setNewTaskTitle(e.target.value)} 
                            placeholder="Название задачи" 
                        />
                        <select 
                            className={styles.selectFull}
                            value={newTaskContractId || ""} 
                            onChange={e => setNewTaskContractId(e.target.value || null)}
                        >
                            <option value="">Без контракта</option>
                            {contracts.map(c => (
                                <option key={c.id} value={c.id}>{c.company} - {c.rank}</option>
                            ))}
                        </select>
                    </div>
                    <button className={styles.btnPrimary} onClick={handleAddItem}>Добавить задачу</button>
                </div>

                <div className={styles.listCard}>
                    <h3 className={styles.listTitle}>Мои задачи</h3>
                    {items.length === 0 
                        ? <div className={styles.emptyState}>Задач пока нет</div>
                        : (
                            <div className={styles.itemList}>
                                {items.map(item => (
                                    <div key={item.id} className={styles.taskItem}>
                                        <div className={styles.taskInfo}>
                                            <span className={styles.taskTitle}>{item.title}</span>
                                            <span className={styles.taskStatus}>{item.status}</span>
                                        </div>
                                        <div className={styles.taskActions}>
                                            <button className={styles.statusBtn} onClick={() => setItemStatus(item.id, "pending")} title="В ожидании">⏳</button>
                                            <button className={styles.statusBtn} onClick={() => setItemStatus(item.id, "accepted")} title="Принято">✅</button>
                                            <button className={styles.statusBtn} onClick={() => setItemStatus(item.id, "rejected")} title="Отклонено">❌</button>
                                            <button className={styles.btnDelete} onClick={() => removeChecklistItem(item.id)}>✕</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    }    
                </div>

            </div>
        </section>
    )
}