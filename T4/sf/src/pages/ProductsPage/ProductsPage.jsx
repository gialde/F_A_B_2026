import React, { useState, useEffect } from "react";
import "./ProductsPage.scss";
import ProductsList from "../../components/ProductsList";
import ProductModal from "../../components/ProductModal";
import { api } from "../../api";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editingProduct, setEditingProduct] = useState(null);

    // Загрузка товаров при монтировании
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data);
        } catch (err) {
            console.error("Ошибка загрузки:", err);
            alert("Не удалось загрузить товары. Проверьте, запущен ли сервер (backend) на порту 3000");
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setModalMode("create");
        setEditingProduct(null);
        setModalOpen(true);
    };

    const openEditModal = (product) => {
        setModalMode("edit");
        setEditingProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Удалить товар?")) return;

        try {
            await api.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error("Ошибка удаления:", err);
            alert("Не удалось удалить товар");
        }
    };

    const handleSubmit = async (productData) => {
        try {
            if (modalMode === "create") {
                const newProduct = await api.createProduct(productData);
                setProducts(prev => [...prev, newProduct]);
            } else {
                const updatedProduct = await api.updateProduct(editingProduct.id, productData);
                setProducts(prev => prev.map(p => 
                    p.id === editingProduct.id ? updatedProduct : p
                ));
            }
            closeModal();
        } catch (err) {
            console.error("Ошибка сохранения:", err);
            alert("Не удалось сохранить товар");
        }
    };

    return (
        <div className="shop">
            <header className="shop__header">
                <h1>Магазин электроники</h1>
                <button className="btn btn--primary" onClick={openCreateModal}>
                    + Добавить товар
                </button>
            </header>
            
            <div className="shop__content">
                {loading ? (
                    <div className="loading">Загрузка товаров...</div>
                ) : (
                    <ProductsList 
                        products={products}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            <ProductModal
                isOpen={modalOpen}
                mode={modalMode}
                product={editingProduct}
                onClose={closeModal}
                onSubmit={handleSubmit}
            />
        </div>
    );
}