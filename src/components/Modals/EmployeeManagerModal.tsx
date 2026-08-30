import React, { useState, useEffect, useMemo } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee, EmployeeData } from '../../services/EmployeeService';
import { styles } from './ManagerModal.styles';
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
        const confirmDelete = () => {
            deleteEmployee(id);
            loadEmployees();
        };

        // Caso esteja rodando na Web, usa o confirm nativo do navegador
        if (Platform.OS === 'web') {
            const confirmed = window.confirm('Tem certeza que deseja remover este funcionário?');
            if (confirmed) {
                confirmDelete();
            }
            return;
        }

        // Caso esteja no iOS ou Android nativo
        Alert.alert(
            'Excluir Funcionário',
            'Tem certeza que deseja remover este funcionário?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: confirmDelete,
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
                <View style={styles.card}>
                    {/* Cabeçalho */}
                    <View style={styles.header}>
                        <View style={styles.headerTitleGroup}>
                            {selectedRole && !isFormOpen && (
                                <TouchableOpacity onPress={() => { setSelectedRole(null); setSearch(''); }}>
                                    <Icon name="arrow_back" size={20} color="#303338" />
                                </TouchableOpacity>
                            )}
                            <Text style={styles.title}>
                                {isFormOpen
                                    ? (editingId ? 'Editar Funcionário' : 'Novo Funcionário')
                                    : (selectedRole ? selectedRole : 'Funcionários')}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={20} color="#686B70" />
                        </TouchableOpacity>
                    </View>

                    {/* MODO 1: FORMULÁRIO DE CRIAÇÃO / EDIÇÃO */}
                    {isFormOpen ? (
                        <View style={styles.formContainer}>
                            <View style={styles.scrollFlex}>
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
                                <View style={styles.roleSelectorGroup}>
                                    {(['recepcao', 'cozinha'] as const).map((itemRole) => {
                                        const isSelected = role === itemRole;
                                        return (
                                            <TouchableOpacity
                                                key={itemRole}
                                                onPress={() => setRole(itemRole)}
                                                style={[
                                                    styles.roleOptionBtn,
                                                    isSelected ? styles.roleOptionSelected : styles.roleOptionUnselected
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.roleOptionText,
                                                    isSelected ? styles.roleOptionTextSelected : styles.roleOptionTextUnselected
                                                ]}>
                                                    {itemRole}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                <Text style={styles.label}>Turno</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: Manhã, Tarde, Noite"
                                    placeholderTextColor="#A09C9D"
                                    value={shift}
                                    onChangeText={setShift}
                                />
                            </View>

                            {/* Botões do Rodapé */}
                            <View style={styles.actions}>
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
                        <View style={styles.formContainer}>
                            <TouchableOpacity
                                style={styles.addBtn}
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
                                <View style={styles.scrollGroup}>
                                    {(['recepcao', 'cozinha'] as const).map((roleName) => {
                                        const count = rolesMap[roleName].length;

                                        return (
                                            <TouchableOpacity
                                                key={roleName}
                                                onPress={() => setSelectedRole(roleName)}
                                                style={styles.sectorCard}
                                            >
                                                <View style={styles.sectorCardInfo}>
                                                    <View style={styles.sectorIconContainer}>
                                                        <Icon
                                                            name={roleName === 'cozinha' ? 'soup_kitchen' : 'badge'}
                                                            size={20}
                                                            color="#F07342"
                                                        />
                                                    </View>
                                                    <View>
                                                        <Text style={styles.sectorTitle}>
                                                            {roleName}
                                                        </Text>
                                                        <Text style={styles.sectorSubTitle}>
                                                            {count} {count === 1 ? 'funcionário' : 'funcionários'}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <Icon name="chevron_right" size={22} color="#A09C9D" />
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            ) : (
                                /* LISTA DE FUNCIONÁRIOS DO SETOR SELECIONADO */
                                <View style={styles.scrollGroup}>
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder={`Buscar em ${selectedRole}...`}
                                        placeholderTextColor="#A09C9D"
                                        value={search}
                                        onChangeText={setSearch}
                                    />

                                    <View style={styles.scrollGroup}>
                                        {currentRoleEmployees.length === 0 ? (
                                            <Text style={styles.emptyText}>
                                                Nenhum funcionário cadastrado neste setor.
                                            </Text>
                                        ) : (
                                            currentRoleEmployees.map((emp) => (
                                                <View key={emp.id} style={styles.employeeCard}>
                                                    <View style={styles.scrollFlex}>
                                                        <Text style={styles.employeeName}>
                                                            {emp.name}
                                                        </Text>
                                                        {emp.shift ? (
                                                            <Text style={styles.employeeShift}>
                                                                Turno: {emp.shift}
                                                            </Text>
                                                        ) : null}
                                                    </View>

                                                    <View style={styles.employeeActionsGroup}>
                                                        <TouchableOpacity onPress={() => handleEditInit(emp)} style={styles.iconBtn}>
                                                            <Icon name="edit" size={18} color="#F07342" />
                                                        </TouchableOpacity>

                                                        <TouchableOpacity onPress={() => handleDelete(emp.id)} style={styles.iconBtn}>
                                                            <Icon name="delete" size={18} color="#E53935" />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            ))
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};