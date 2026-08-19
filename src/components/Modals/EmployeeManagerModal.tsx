import React, { useState, useEffect, useMemo } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee, EmployeeData } from '../../services/EmployeeService';
import { styles } from './Modal.styles';
import Icon from '../Icon';

interface EmployeeManagerModalProps {
    visible: boolean;
    onClose: () => void;
}

export const EmployeeManagerModal: React.FC<EmployeeManagerModalProps> = ({ visible, onClose }) => {
    const [employees, setEmployees] = useState<EmployeeData[]>([]);
    const [search, setSearch] = useState('');

    // Navegação Interna: null = Categorias | string = Categoria selecionada ('recepcao' | 'cozinha')
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    // Estados do Formulário (Criar/Editar)
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [role, setRole] = useState<'recepcao' | 'cozinha'>('recepcao');
    const [shift, setShift] = useState('');

    useEffect(() => {
        if (visible) {
            loadEmployees();
            resetForm();
            setSelectedRole(null);
            setSearch('');
        }
    }, [visible]);

    const loadEmployees = () => {
        setEmployees(getEmployees());
    };

    const resetForm = () => {
        setName('');
        setRole('recepcao');
        setShift('');
        setEditingId(null);
        setIsFormOpen(false);
    };

    const handleEditInit = (emp: EmployeeData) => {
        setEditingId(emp.id);
        setName(emp.name);
        setRole(emp.role === 'cozinha' ? 'cozinha' : 'recepcao');
        setShift(emp.shift || '');
        setIsFormOpen(true);
    };

    const handleSave = () => {
        if (!name.trim()) return;

        if (editingId) {
            updateEmployee({ id: editingId, name, role, shift });
        } else {
            addEmployee({ name, role, shift });
        }

        loadEmployees();
        resetForm();
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Excluir Funcionário',
            'Tem certeza que deseja remover este funcionário?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => {
                        deleteEmployee(id);
                        loadEmployees();
                    },
                },
            ]
        );
    };

    const rolesMap = useMemo(() => {
        const map: Record<string, EmployeeData[]> = {
            'recepcao': [],
            'cozinha': [],
        };

        employees.forEach((emp) => {
            const group = emp.role === 'cozinha' ? 'cozinha' : 'recepcao';
            map[group].push(emp);
        });

        return map;
    }, [employees]);

    const currentRoleEmployees = useMemo(() => {
        if (!selectedRole) return [];

        const list = rolesMap[selectedRole] || [];
        if (!search.trim()) return list;

        return list.filter((emp) =>
            emp.name.toLowerCase().includes(search.toLowerCase()) ||
            (emp.shift && emp.shift.toLowerCase().includes(search.toLowerCase()))
        );
    }, [rolesMap, selectedRole, search]);

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.card, { maxWidth: 540, width: '90%', maxHeight: '90%', position: 'relative' }]}>

                    {/* Cabeçalho */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            {selectedRole && !isFormOpen && (
                                <TouchableOpacity onPress={() => { setSelectedRole(null); setSearch(''); }}>
                                    <Icon name="arrow_back" size={22} color="#303338" />
                                </TouchableOpacity>
                            )}
                            <Text style={styles.title}>
                                {isFormOpen
                                    ? (editingId ? 'Editar Funcionário' : 'Novo Funcionário')
                                    : (selectedRole ? selectedRole : 'Funcionários')}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={22} color="#686B70" />
                        </TouchableOpacity>
                    </View>

                    {/* MODO 1: FORMULÁRIO DE CRIAÇÃO / EDIÇÃO */}
                    {isFormOpen ? (
                        <View style={{ flex: 1, justifyContent: 'space-between' }}>
                            <View>
                                <Text style={styles.label}>Nome do Funcionário *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: João Silva"
                                    placeholderTextColor="#A09C9D"
                                    value={name}
                                    onChangeText={setName}
                                />

                                {/* Seleção de Setor */}
                                <Text style={styles.label}>Setor / Cargo</Text>
                                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                                    {(['recepcao', 'cozinha'] as const).map((itemRole) => {
                                        const isSelected = role === itemRole;
                                        return (
                                            <TouchableOpacity
                                                key={itemRole}
                                                onPress={() => setRole(itemRole)}
                                                style={{
                                                    flex: 1,
                                                    paddingVertical: 10,
                                                    borderRadius: 8,
                                                    borderWidth: 1,
                                                    borderColor: isSelected ? '#F07342' : '#E0DDD9',
                                                    backgroundColor: isSelected ? '#F0734215' : '#FFFFFF',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Text style={{ fontFamily: 'Lexend', fontWeight: isSelected ? '600' : '400', color: isSelected ? '#F07342' : '#303338' }}>
                                                    {itemRole}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                <Text style={styles.label}>Turno / Horário</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: Manhã (08h às 16h)"
                                    placeholderTextColor="#A09C9D"
                                    value={shift}
                                    onChangeText={setShift}
                                />
                            </View>

                            {/* Botões do Rodapé */}
                            <View style={[styles.actions, { marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E0DDD9' }]}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
                                    <Text style={styles.cancelText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                    <Text style={styles.saveText}>{editingId ? 'Salvar Alteração' : 'Adicionar Funcionário'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        /* MODO 2: LISTAGEM */
                        <>
                            <TouchableOpacity
                                style={[styles.saveBtn, { marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }]}
                                onPress={() => {
                                    if (selectedRole === 'cozinha' || selectedRole === 'recepcao') {
                                        setRole(selectedRole);
                                    }
                                    setIsFormOpen(true);
                                }}
                            >
                                <Icon name="add" size={18} color="#FFFFFF" />
                                <Text style={styles.saveText}>Adicionar Novo Funcionário</Text>
                            </TouchableOpacity>

                            {/* NAVEGAÇÃO DE SETORES (HOME) */}
                            {!selectedRole ? (
                                <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
                                    {(['recepcao', 'cozinha'] as const).map((roleName) => {
                                        const count = rolesMap[roleName].length;

                                        return (
                                            <TouchableOpacity
                                                key={roleName}
                                                onPress={() => setSelectedRole(roleName)}
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
                                                        <Icon
                                                            name={roleName === 'cozinha' ? 'soup_kitchen' : 'badge'}
                                                            size={20}
                                                            color="#F07342"
                                                        />
                                                    </View>
                                                    <View>
                                                        <Text style={{ fontFamily: 'Lexend', fontWeight: '600', color: '#303338', fontSize: 16 }}>
                                                            {roleName}
                                                        </Text>
                                                        <Text style={{ fontFamily: 'Lexend', color: '#686B70', fontSize: 12, marginTop: 2 }}>
                                                            {count} {count === 1 ? 'funcionário' : 'funcionários'}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <Icon name="chevron_right" size={22} color="#A09C9D" />
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            ) : (
                                /* LISTA DE FUNCIONÁRIOS DO SETOR SELECIONADO */
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        style={[styles.input, { marginBottom: 12 }]}
                                        placeholder={`Buscar em ${selectedRole}...`}
                                        placeholderTextColor="#A09C9D"
                                        value={search}
                                        onChangeText={setSearch}
                                    />

                                    <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
                                        {currentRoleEmployees.length === 0 ? (
                                            <Text style={{ textAlign: 'center', color: '#A09C9D', marginVertical: 20, fontFamily: 'Lexend' }}>
                                                Nenhum funcionário cadastrado neste setor.
                                            </Text>
                                        ) : (
                                            currentRoleEmployees.map((emp) => (
                                                <View
                                                    key={emp.id}
                                                    style={{
                                                        backgroundColor: '#FFFFFF',
                                                        padding: 12,
                                                        borderRadius: 8,
                                                        marginBottom: 8,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ fontFamily: 'Lexend', fontWeight: '500', color: '#303338', fontSize: 15 }}>
                                                            {emp.name}
                                                        </Text>
                                                        {emp.shift ? (
                                                            <Text style={{ fontFamily: 'Lexend', color: '#686B70', fontSize: 12, marginTop: 2 }}>
                                                                Turno: {emp.shift}
                                                            </Text>
                                                        ) : null}
                                                    </View>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                        <TouchableOpacity onPress={() => handleEditInit(emp)} style={{ padding: 6 }}>
                                                            <Icon name="edit" size={18} color="#F07342" />
                                                        </TouchableOpacity>

                                                        <TouchableOpacity onPress={() => handleDelete(emp.id)} style={{ padding: 6 }}>
                                                            <Icon name="delete" size={18} color="#E53935" />
                                                        </TouchableOpacity>
                                                    </View>
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