import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  OrderTicketPreview,
  OrderItem,
} from "../OrderTicketPreview/OrderTicketPreview";
import { styles } from "./ReceptionWorkspace.styles";
import { CheckeredBorder } from "../Patterns/CheckeredBorder";
import Icon from "../Icon";
import { getMenuItems, MenuItemData } from "../../services/MenuService";
import { Order } from "../../models/Order";
import { OrderOriginEnum } from "../../enums/OrderOriginEnum";
import { OrderItem as OrderItemModel } from "../../models/OrderItem";
import { TableService } from "../../models/service/TableService";

interface ReceptionWorkspaceProps {
  getNextOrderCode: () => number;
  onAddOrder?: (newOrder: Order) => void;
}

export const ReceptionWorkspace: React.FC<ReceptionWorkspaceProps> = ({
  getNextOrderCode,
  onAddOrder,
}) => {
  const [table, setTable] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [generalObs, setGeneralObs] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);

  const [itemQuantity, setItemQuantity] = useState("1");
  const [itemName, setItemName] = useState("");
  const [itemObs, setItemObs] = useState("");

  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [filteredMenu, setFilteredMenu] = useState<MenuItemData[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const currentOrderCode = getNextOrderCode();

  useEffect(() => {
    const loadedMenu = getMenuItems();
    setMenuItems(loadedMenu);
    setFilteredMenu(loadedMenu);
  }, []);

  const handleItemNameChange = (text: string) => {
    setItemName(text);
    if (text.trim() === "") {
      setFilteredMenu(menuItems);
    } else {
      const filtered = menuItems.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredMenu(filtered);
    }
    setIsDropdownOpen(true);
  };

  const handleSelectMenuItem = (selectedItem: MenuItemData) => {
    setItemName(selectedItem.name);
    setIsDropdownOpen(false);
  };

  const handleSelectItemToEdit = (item: OrderItem) => {
    setEditingItemId(item.id);
    setItemQuantity(String(item.quantity));
    setItemName(item.name);
    setItemObs(item.observation || "");
    setIsDropdownOpen(false);
  };

  const resetItemForm = () => {
    setEditingItemId(null);
    setItemQuantity("1");
    setItemName("");
    setItemObs("");
    setIsDropdownOpen(false);
  };

  const resetOrderForm = () => {
    setTable("");
    setPrepTime("");
    setGeneralObs("");
    setItems([]);
    resetItemForm();
  };

  const handleSaveItem = () => {
    if (!itemName.trim()) return;

    if (editingItemId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItemId
            ? {
              ...item,
              quantity: Number(itemQuantity) || 1,
              name: itemName,
              observation: itemObs,
            }
            : item,
        ),
      );
    } else {
      const newItem: OrderItem = {
        id: Date.now().toString(),
        quantity: Number(itemQuantity) || 1,
        name: itemName,
        observation: itemObs,
      };
      setItems((prev) => [...prev, newItem]);
    }

    resetItemForm();
  };

  const handleDeleteItem = () => {
    if (!editingItemId) return;
    setItems((prev) => prev.filter((item) => item.id !== editingItemId));
    resetItemForm();
  };

  const handleNumericInput = (text: string, setter: (val: string) => void) => {
    const cleanedText = text.replace(/[^0-9]/g, "");
    setter(cleanedText);
  };

  const handleCreateOrder = () => {
    if (items.length === 0) return;

    const orderCode = getNextOrderCode();
    const estimatedMinutes = Number(prepTime) || 15;
    const now = new Date();
    const kitchenDeadline = new Date(now.getTime() + estimatedMinutes * 60000);
    const receptionDeadline = new Date(
      now.getTime() + (estimatedMinutes + 5) * 60000,
    );
    const deliveryDeadline = new Date(
      now.getTime() + (estimatedMinutes + 15) * 60000,
    );

    const tableNumber = Number(table) || 1;
    const tableService = new TableService(now, tableNumber, 1);

    const newOrder = new Order(
      Date.now().toString(),
      orderCode,
      OrderOriginEnum.PRESENTIAL,
      receptionDeadline,
      kitchenDeadline,
      deliveryDeadline,
      estimatedMinutes, 
      undefined,
      tableService,
      undefined,
      now
    );

    items.forEach((item) => {
      const orderItem = new OrderItemModel(
        item.id,
        item.name,
        item.quantity,
        new Date(),
        item.observation || "",
      );
      newOrder.addItem(orderItem);
    });

    onAddOrder?.(newOrder);
    resetOrderForm();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.sectionContent}>
          <View style={styles.ticketSection}>
            <OrderTicketPreview
              orderNumber={String(currentOrderCode)}
              table={table}
              items={items}
              generalObs={generalObs}
              prepTime={prepTime}
              onSelectItem={handleSelectItemToEdit}
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Mesa</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 5"
              placeholderTextColor="#A09C9D"
              keyboardType="number-pad"
              value={table}
              onChangeText={(text) => handleNumericInput(text, setTable)}
            />

            <Text style={styles.label}>
              {editingItemId ? "Editar item" : "Adicionar item"}
            </Text>
            <View style={[styles.row, { zIndex: 10 }]}>
              <TextInput
                style={[styles.input, styles.qtyInput]}
                placeholder="000"
                placeholderTextColor="#A09C9D"
                keyboardType="number-pad"
                value={itemQuantity}
                onChangeText={(text) =>
                  handleNumericInput(text, setItemQuantity)
                }
              />

              <View style={[styles.flexInput, { position: "relative" }]}>
                <TextInput
                  style={[styles.input]}
                  placeholder="Selecione ou digite o item"
                  placeholderTextColor="#A09C9D"
                  value={itemName}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChangeText={handleItemNameChange}
                />

                {isDropdownOpen && filteredMenu.length > 0 && (
                  <View style={styles.dropdownContainer}>
                    <ScrollView
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                    >
                      {filteredMenu.map((menuItem) => (
                        <TouchableOpacity
                          key={menuItem.id}
                          style={styles.dropdownItem}
                          onPress={() => handleSelectMenuItem(menuItem)}
                        >
                          <Text style={styles.dropdownItemText}>
                            {menuItem.name}
                          </Text>
                          {menuItem.category ? (
                            <Text style={styles.dropdownCategoryText}>
                              {menuItem.category}
                            </Text>
                          ) : null}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.flexInput]}
                placeholder="Observação (Opcional)"
                placeholderTextColor="#A09C9D"
                value={itemObs}
                onChangeText={setItemObs}
              />

              {editingItemId ? (
                <>
                  <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: "#E53935" }]}
                    onPress={handleDeleteItem}
                  >
                    <Icon name="delete" size={16} color="#EAE8E5" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: "#3EB26A" }]}
                    onPress={handleSaveItem}
                  >
                    <Icon name="check" size={16} color="#EAE8E5" />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleSaveItem}
                >
                  <Icon name="add" size={16} color="#EAE8E5" />
                  <Text style={styles.addButtonText}>Adicionar item</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.row}>
              <View style={styles.flexInput}>
                <Text style={styles.label}>Prazo de Preparo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="(Em minutos)"
                  placeholderTextColor="#A09C9D"
                  keyboardType="number-pad"
                  value={prepTime}
                  onChangeText={(text) => handleNumericInput(text, setPrepTime)}
                />
              </View>

              <View style={styles.flexInput}>
                <Text style={styles.label}>Observação Geral</Text>
                <TextInput
                  style={styles.input}
                  placeholder="(Opcional)"
                  placeholderTextColor="#A09C9D"
                  value={generalObs}
                  onChangeText={setGeneralObs}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                items.length === 0 && { opacity: 0.5 },
              ]}
              onPress={handleCreateOrder}
              disabled={items.length === 0}
            >
              <Text style={styles.submitButtonText}>Criar Pedido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <CheckeredBorder />
    </View>
  );
};
