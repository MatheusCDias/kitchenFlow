import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ActiveWorkspace } from '../../components/ActiveWorkspace/ActiveWorkspace';
import { AllOrders } from '../../components/AllOrders/AllOrders';
import { Order } from '../../models/Order';
import { Employee } from '../../models/employee/Employee';

interface KitchenProps {
    orders: Order[];
    activeOrder: Order | null;
    currentUser: Employee;
    onClaimOrder: (orderId: string) => void;
    onCompleteOrder: (order: Order) => void;
    onCancelOrder: (order: Order) => void;
}

export const Kitchen: React.FC<KitchenProps> = ({
    orders,
    activeOrder,
    currentUser,
    onClaimOrder,
    onCompleteOrder,
    onCancelOrder,
}) => {
    return (
        <ScrollView>
            <ActiveWorkspace
                key={activeOrder ? activeOrder.getId() : 'no-active-order'}
                order={activeOrder}
                onCompleteOrder={onCompleteOrder}
                onCancelOrder={onCancelOrder}
            />
            <AllOrders
                orders={orders}
                activeOrder={activeOrder}
                currentUser={currentUser}
                onClaimOrder={onClaimOrder}
            />
        </ScrollView>
    );
};