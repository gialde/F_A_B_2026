import React, { useEffect, useState } from "react";

export default function ProductModal({ isOpen, mode, product, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: ""
    });

    useEffect(() => {
        if (product && mode === "edit") {
            setFormData({
                name: product.name || "",
                category: product.category || "",
                description: product.description || "",
                price: product.price || "",
                stock: product.stock || ""
            });
        } else {
            setFormData({
                name: "",
                category: "",
                description: "",
                price: "",
                stock: ""
            });
        }
    }, [product, mode, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.category || !formData.description || 
            !formData.price || !formData.stock) {
            alert("Заполните все поля");
            return;
        }

        const price = Number(formData.price);
        const stock = Number(formData.stock);

        if (isNaN(price) || price <= 0) {
            alert("Цена должна быть положительным числом");
            return;
        }

        if (isNaN(stock) || stock < 0) {
            alert("Количество должно быть неотрицательным числом");
            return;
        }

        onSubmit({
            ...formData,
            price,
            stock
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h2 className="modal__title">
                    {mode === "edit" ? "Редактировать товар" : "Добавить товар"}
                </h2>
                
                <form onSubmit={handleSubmit} className="modal__form">
                    <div className="form-group">
                        <label>Название товара</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Например: Смартфон XYZ Pro"
                        />
                    </div>

                    <div className="form-group">
                        <label>Категория</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Например: Смартфоны"
                        />
                    </div>

                    <div className="form-group">
                        <label>Описание</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Подробное описание товара"
                            rows="3"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Цена (₽)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="49990"
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>Количество</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="10"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="modal__actions">
                        <button type="button" className="btn btn--secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {mode === "edit" ? "Сохранить" : "Создать"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}