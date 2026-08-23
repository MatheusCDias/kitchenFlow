import React, { useState, useEffect, useMemo } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { getMenuItems, addMenuItem, deleteMenuItem, updateMenuItem, MenuItemData } from '../../services/MenuService';
import { styles } from './ManagerModal.styles';
import Icon from '../Icon';

interface MenuManagerModalProps {
    visible: boolean;
    onClose: () => void;
}

export const MenuManagerModal: React.FC<MenuManagerModalProps> = ({ visible, onClose }) => {
    const [items, setItems] = useState<MenuItemData[]>([]);
    const [search, setSearch] = useState('');

    // Controle de Navegação Interna
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Estados do Formulário (Criar/Editar)
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [recipe, setRecipe] = useState('');

    // Estado para controlar expansão de receita
    const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);

    useEffect(() => {
        if (visible) {
            loadItems();
            resetForm();
            setSelectedCategory(null);
            setSearch('');
        }
    }, [visible]);

    const loadItems = () => {
        setItems(getMenuItems());
    };

    const resetForm = () => {
        setName('');
        setCategory('');
        setPrice('');
        setRecipe('');
        setEditingId(null);
        setIsFormOpen(false);
    };

    const handleEditInit = (item: MenuItemData) => {
        setEditingId(item.id);
        setName(item.name);
        setCategory(item.category || '');
        setPrice(item.price ? String(item.price) : '');
        setRecipe(item.recipe || '');
        setIsFormOpen(true);
    };

    const handleSave = () => {
        if (!name.trim()) return;

        const numericPrice = parseFloat(price.replace(',', '.')) || 0;

        if (editingId) {
            updateMenuItem({ id: editingId, name, category, price: numericPrice, recipe });
        } else {
            addMenuItem({ name, category, price: numericPrice, recipe });
        }

        loadItems();
        resetForm();
    };

    const handleDelete = (id: string) => {
        deleteMenuItem(id);
        loadItems();
    };

    const toggleRecipe = (id: string) => {
        setExpandedRecipeId(expandedRecipeId === id ? null : id);
    };

    // Agrupa os itens e conta a quantidade por categoria
    const categoriesMap = useMemo(() => {
        const map: Record<string, MenuItemData[]> = {};

        items.forEach((item) => {
            const catName = item.category?.trim()
                ? item.category.trim().charAt(0).toUpperCase() + item.category.trim().slice(1)
                : 'Outros';

            if (!map[catName]) {
                map[catName] = [];
            }
            map[catName].push(item);
        });

        return map;
    }, [items]);

    const categoriesList = Object.keys(categoriesMap);

    // Itens filtrados para exibição
    const currentCategoryItems = useMemo(() => {
        if (!selectedCategory) return [];

        const list = categoriesMap[selectedCategory] || [];
        if (!search.trim()) return list;

        return list.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [categoriesMap, selectedCategory, search]);

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.card]}>
                    {/* Cabeçalho */}
                    <View style={styles.header}>
                        <View style={styles.headerTitleGroup}>
                            {selectedCategory && !isFormOpen && (
                                <TouchableOpacity onPress={() => { setSelectedCategory(null); setSearch(''); }}>
                                    <Icon name="arrow_back" size={22} color="#303338" />
                                </TouchableOpacity>
                            )}
                            <Text style={styles.title}>
                                {isFormOpen
                                    ? (editingId ? 'Editar Item' : 'Novo Item')
                                    : (selectedCategory ? selectedCategory : 'Cardápio')}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={22} color="#686B70" />
                        </TouchableOpacity>
                    </View>

                    {/* MODO 1: FORMULÁRIO DE ADIÇÃO/EDIÇÃO */}
                    {isFormOpen ? (
                        <View style={styles.formContainer}>
                            <View style={styles.scrollFlex}>
                                <Text style={styles.label}>Nome do Item *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: Hambúrguer Artesanal"
                                    placeholderTextColor="#A09C9D"
                                    value={name}
                                    onChangeText={setName}
                                />

                                <View style={styles.row}>
                                    <View style={styles.flex1}>
                                        <Text style={styles.label}>Categoria</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Ex: Entradas"
                                            placeholderTextColor="#A09C9D"
                                            value={category}
                                            onChangeText={setCategory}
                                        />
                                    </View>
                                    <View style={styles.flex1}>
                                        <Text style={styles.label}>Preço (R$)</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="0,00"
                                            placeholderTextColor="#A09C9D"
                                            keyboardType="decimal-pad"
                                            value={price}
                                            onChangeText={setPrice}
                                        />
                                    </View>
                                </View>

                                <Text style={styles.label}>Receita / Modo de Preparo</Text>
                                <TextInput
                                    style={styles.textArea}
                                    placeholder="Ingredientes e modo de preparo..."
                                    placeholderTextColor="#A09C9D"
                                    multiline
                                    numberOfLines={5}
                                    value={recipe}
                                    onChangeText={setRecipe}
                                />
                            </View>

                            {/* Ações no Rodapé do Formulário */}
                            <View style={styles.formActions}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
                                    <Text style={styles.cancelText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                    <Text style={styles.saveText}>
                                        {editingId ? 'Salvar Alteração' : 'Adicionar Item'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        /* MODO 2: LISTAGEM DE CATEGORIAS E ITENS */
                        <View style={styles.formContainer}>
                            <TouchableOpacity
                                style={styles.addBtn}
                                onPress={() => {
                                    if (selectedCategory) {
                                        setCategory(selectedCategory === 'Outros' ? '' : selectedCategory);
                                    }
                                    setIsFormOpen(true);
                                }}
                            >
                                <Icon name="add" size={18} color="#FFFFFF" />
                                <Text style={styles.saveText}>Adicionar Novo Item</Text>
                            </TouchableOpacity>

                            {/* LISTA DE CATEGORIAS */}
                            {!selectedCategory ? (
                                <View style={styles.scrollGroup}>
                                    {categoriesList.length === 0 ? (
                                        <Text style={styles.emptyText}>
                                            Nenhum item cadastrado no cardápio.
                                        </Text>
                                    ) : (
                                        categoriesList.map((catName) => {
                                            const itemCount = categoriesMap[catName].length;

                                            return (
                                                <TouchableOpacity
                                                    key={catName}
                                                    onPress={() => setSelectedCategory(catName)}
                                                    style={styles.categoryCard}
                                                >
                                                    <View style={styles.categoryInfo}>
                                                        <View style={styles.categoryIconContainer}>
                                                            <Icon name="restaurant_menu" size={20} color="#F07342" />
                                                        </View>
                                                        <View>
                                                            <Text style={styles.categoryTitle}>{catName}</Text>
                                                            <Text style={styles.categoryCount}>
                                                                {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    <Icon name="chevron_right" size={22} color="#A09C9D" />
                                                </TouchableOpacity>
                                            );
                                        })
                                    )}
                                </View>
                            ) : (
                                /* ITENS DA CATEGORIA SELECIONADA */
                                <View style={styles.scrollGroup}>
                                    <TextInput
                                        style={[styles.input]}
                                        placeholder={`Buscar em ${selectedCategory}...`}
                                        placeholderTextColor="#A09C9D"
                                        value={search}
                                        onChangeText={setSearch}
                                    />

                                    <ScrollView nestedScrollEnabled style={styles.scrollFlex}>
                                        {currentCategoryItems.length === 0 ? (
                                            <Text style={styles.emptyText}>
                                                Nenhum item nesta categoria.
                                            </Text>
                                        ) : (
                                            currentCategoryItems.map((item) => (
                                                <View key={item.id} style={styles.itemCard}>
                                                    <View style={styles.itemHeader}>
                                                        <View style={styles.flex1}>
                                                            <Text style={styles.itemTitle}>{item.name}</Text>
                                                            <Text style={styles.itemPrice}>
                                                                R$ {item.price ? item.price.toFixed(2) : '0.00'}
                                                            </Text>
                                                        </View>

                                                        <View style={styles.itemActions}>
                                                            {item.recipe ? (
                                                                <TouchableOpacity
                                                                    onPress={() => toggleRecipe(item.id)}
                                                                    style={[
                                                                        styles.iconBtn,
                                                                        expandedRecipeId === item.id && styles.activeIconBtn
                                                                    ]}
                                                                >
                                                                    <Icon
                                                                        name="menu_book"
                                                                        size={18}
                                                                        color={expandedRecipeId === item.id ? '#F07342' : '#686B70'}
                                                                    />
                                                                </TouchableOpacity>
                                                            ) : null}

                                                            <TouchableOpacity onPress={() => handleEditInit(item)} style={styles.iconBtn}>
                                                                <Icon name="edit" size={18} color="#F07342" />
                                                            </TouchableOpacity>

                                                            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconBtn}>
                                                                <Icon name="delete" size={18} color="#E53935" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>

                                                    {expandedRecipeId === item.id && item.recipe ? (
                                                        <View style={styles.recipeContainer}>
                                                            <Text style={styles.recipeTitle}>
                                                                RECEITA / MODO DE PREPARO:
                                                            </Text>
                                                            <Text style={styles.recipeText}>
                                                                {item.recipe}
                                                            </Text>
                                                        </View>
                                                    ) : null}
                                                </View>
                                            ))
                                        )}
                                    </ScrollView>
                                </View>
                            )}
                        </ View>
                    )}
                </View>
            </View>
        </Modal>
    );
};