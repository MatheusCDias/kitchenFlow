import React, { useState, useEffect, useMemo } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { getMenuItems, addMenuItem, deleteMenuItem, updateMenuItem, MenuItemData } from '../../services/MenuService';
import { styles } from './Modal.styles';
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
                <View style={[styles.card, { maxWidth: 540, width: '90%', maxHeight: '90%', position: 'relative' }]}>
                    
                    {/* Cabeçalho */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
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

                    {/* MODO 1: FORMULÁRIO DE ADIÇÃO/EDIÇÃO (Espaço Expandido e Sem Scroll Interno) */}
                    {isFormOpen ? (
                        <View style={{ flex: 1, justifyContent: 'space-between' }}>
                            <View>
                                <Text style={styles.label}>Nome do Item *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: Hambúrguer Artesanal"
                                    placeholderTextColor="#A09C9D"
                                    value={name}
                                    onChangeText={setName}
                                />

                                <View style={styles.row}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.label}>Categoria</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Ex: Entradas, Prato Principal..."
                                            placeholderTextColor="#A09C9D"
                                            value={category}
                                            onChangeText={setCategory}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
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
                                    style={[styles.input, { height: 120, textAlignVertical: 'top', paddingTop: 10 }]}
                                    placeholder="Ingredientes e modo de preparo..."
                                    placeholderTextColor="#A09C9D"
                                    multiline
                                    numberOfLines={5}
                                    value={recipe}
                                    onChangeText={setRecipe}
                                />
                            </View>

                            {/* Ações/Aviso no Rodapé do Formulário */}
                            <View style={[styles.actions, { marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E0DDD9' }]}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
                                    <Text style={styles.cancelText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                    <Text style={styles.saveText}>{editingId ? 'Salvar Alteração' : 'Adicionar Item'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        /* MODO 2: LISTAGEM DE CATEGORIAS E ITENS */
                        <>
                            <TouchableOpacity
                                style={[styles.saveBtn, { marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }]}
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

                            {/* LISTA DE CATEGORIAS (HOME DO CARDÁPIO) */}
                            {!selectedCategory ? (
                                <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
                                    {categoriesList.length === 0 ? (
                                        <Text style={{ textAlign: 'center', color: '#A09C9D', marginVertical: 20, fontFamily: 'Lexend' }}>
                                            Nenhum item cadastrado no cardápio.
                                        </Text>
                                    ) : (
                                        categoriesList.map((catName) => {
                                            const itemCount = categoriesMap[catName].length;

                                            return (
                                                <TouchableOpacity
                                                    key={catName}
                                                    onPress={() => setSelectedCategory(catName)}
                                                    style={{
                                                        backgroundColor: '#FFFFFF',
                                                        padding: 16,
                                                        borderRadius: 10,
                                                        marginBottom: 10,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        elevation: 1,
                                                    }}
                                                >
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                                        <View style={{ backgroundColor: '#F0734215', padding: 8, borderRadius: 8 }}>
                                                            <Icon name="restaurant_menu" size={20} color="#F07342" />
                                                        </View>
                                                        <View>
                                                            <Text style={{ fontFamily: 'Lexend', fontWeight: '600', color: '#303338', fontSize: 16 }}>
                                                                {catName}
                                                            </Text>
                                                            <Text style={{ fontFamily: 'Lexend', color: '#686B70', fontSize: 12, marginTop: 2 }}>
                                                                {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    <Icon name="chevron_right" size={22} color="#A09C9D" />
                                                </TouchableOpacity>
                                            );
                                        })
                                    )}
                                </ScrollView>
                            ) : (
                                /* ITENS DA CATEGORIA SELECIONADA */
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        style={[styles.input, { marginBottom: 12 }]}
                                        placeholder={`Buscar em ${selectedCategory}...`}
                                        placeholderTextColor="#A09C9D"
                                        value={search}
                                        onChangeText={setSearch}
                                    />

                                    <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
                                        {currentCategoryItems.length === 0 ? (
                                            <Text style={{ textAlign: 'center', color: '#A09C9D', marginVertical: 20, fontFamily: 'Lexend' }}>
                                                Nenhum item nesta categoria.
                                            </Text>
                                        ) : (
                                            currentCategoryItems.map((item) => (
                                                <View
                                                    key={item.id}
                                                    style={{
                                                        backgroundColor: '#FFFFFF',
                                                        padding: 12,
                                                        borderRadius: 8,
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ fontFamily: 'Lexend', fontWeight: '500', color: '#303338', fontSize: 15 }}>
                                                                {item.name}
                                                            </Text>
                                                            <Text style={{ fontFamily: 'Lexend', color: '#686B70', fontSize: 12, marginTop: 2 }}>
                                                                R$ {item.price ? item.price.toFixed(2) : '0.00'}
                                                            </Text>
                                                        </View>

                                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                            {item.recipe ? (
                                                                <TouchableOpacity
                                                                    onPress={() => toggleRecipe(item.id)}
                                                                    style={{ padding: 6, backgroundColor: expandedRecipeId === item.id ? '#F0734220' : 'transparent', borderRadius: 6 }}
                                                                >
                                                                    <Icon name="menu_book" size={18} color={expandedRecipeId === item.id ? '#F07342' : '#686B70'} />
                                                                </TouchableOpacity>
                                                            ) : null}

                                                            <TouchableOpacity onPress={() => handleEditInit(item)} style={{ padding: 6 }}>
                                                                <Icon name="edit" size={18} color="#F07342" />
                                                            </TouchableOpacity>

                                                            <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ padding: 6 }}>
                                                                <Icon name="delete" size={18} color="#E53935" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>

                                                    {expandedRecipeId === item.id && item.recipe ? (
                                                        <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0ECE9' }}>
                                                            <Text style={{ fontFamily: 'Lexend', fontSize: 11, fontWeight: '600', color: '#F07342', marginBottom: 4 }}>
                                                                RECEITA / MODO DE PREPARO:
                                                            </Text>
                                                            <Text style={{ fontFamily: 'Lexend', fontSize: 13, color: '#303338', lineHeight: 18 }}>
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
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};