import React, { createContext, useContext, ReactNode } from 'react';
import { useOrders } from '../hooks/useOrders';

// Gerenciador de Estado Global

interface OrderContextType {
    activeOrder: ReturnType<typeof useOrders>['activeOrder'];
    allOrders: ReturnType<typeof useOrders>['allOrders'];
    claimOrder: ReturnType<typeof useOrders>['claimOrder'];
    completeOrder: ReturnType<typeof useOrders>['completeOrder'];
    releaseOrder: ReturnType<typeof useOrders>['releaseOrder'];
    deleteOrder: ReturnType<typeof useOrders>['deleteOrder'];
    createOrder: ReturnType<typeof useOrders>['createOrder'];
    refreshOrders: ReturnType<typeof useOrders>['refreshOrders'];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
    children: ReactNode;
    stationNumber: number | null;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children, stationNumber }) => {
    const orderState = useOrders(stationNumber);

    return (
        <OrderContext.Provider value={orderState}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrderContext = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrderContext deve ser usado dentro de OrderProvider');
    }
    return context;
};
