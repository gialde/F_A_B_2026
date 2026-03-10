import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
    return (
        <div className="product-card">
            <div className="product-card__header">
                <h3 className="product-card__title">{product.name}</h3>
                <span className="product-card__category">{product.category}</span>
            </div>
            
            <p className="product-card__description">{product.description}</p>
            
            <div className="product-card__details">
                <div className="product-card__price">{product.price.toLocaleString()} ₽</div>
                <div className="product-card__stock">В наличии: {product.stock} шт.</div>
            </div>
            
            <div className="product-card__actions">
                <button className="btn btn--edit" onClick={() => onEdit(product)}>
                    Редактировать
                </button>
                <button className="btn btn--delete" onClick={() => onDelete(product.id)}>
                    Удалить
                </button>
            </div>
        </div>
    );
}