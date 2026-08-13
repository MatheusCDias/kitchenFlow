// O servidor manda dados crus (JSON): só texto, número, sem métodos.
// Aqui a gente reconstrói um Order de verdade a partir disso, pra o resto
// do app (TicketCard, ActiveWorkspace, useCountdown...) continuar usando
// os mesmos getters de sempre, sem saber que os dados vieram da rede.
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Cook } from '../models/employee/Cook';
import { TableService } from '../models/service/TableService';
import { OrderOriginEnum } from '../enums/OrderOriginEnum';
import { OrderStateEnum } from '../enums/OrderStateEnum';
import { OrderState } from '../models/states/OrderState';
import { ReceivedState } from '../models/states/ReceivedState';
import { InPreparationState } from '../models/states/InPreparationState';
import { ReadyState } from '../models/states/ReadyState';
import { OnTheWayState } from '../models/states/OnTheWayState';
import { DeliveredState } from '../models/states/DeliveredState';
import { CanceledState } from '../models/states/CanceledState';
import { OrderPayload } from './api';

const STATE_FACTORY: Record<string, () => OrderState> = {
    [OrderStateEnum.RECEIVED]: () => new ReceivedState(),
    [OrderStateEnum.IN_PREPARATION]: () => new InPreparationState(),
    [OrderStateEnum.READY]: () => new ReadyState(),
    [OrderStateEnum.ON_THE_WAY]: () => new OnTheWayState(),
    [OrderStateEnum.DELIVERED]: () => new DeliveredState(),
    [OrderStateEnum.CANCELLED]: () => new CanceledState(),
};

export const toOrder = (payload: OrderPayload): Order => {
    const kitchenDeadline = new Date(payload.kitchenDeadline);
    const createdAt = new Date(payload.createdAt);

    const assignedEmployee = payload.assignedStation !== null
        ? new Cook(
            `station-${payload.assignedStation}`,
            `Bancada ${payload.assignedStation}`,
            payload.assignedStation,
            'N/A'
        )
        : undefined;

    const service = payload.tableNumber !== undefined
        ? new TableService(createdAt, payload.tableNumber, 1)
        : undefined;

    const order = new Order(
        payload.id,
        payload.orderCode,
        OrderOriginEnum.PRESENTIAL,
        kitchenDeadline,
        kitchenDeadline,
        kitchenDeadline,
        payload.deadlineMinutes,
        undefined,
        service,
        assignedEmployee,
        createdAt
    );

    payload.items.forEach(item => {
        order.addItem(new OrderItem(item.id, item.productName, item.quantity, createdAt, item.notes));
    });

    // Sem isso, order.getStatus() sempre voltaria "RECEIVED" (valor do
    // construtor), não importa o que o servidor realmente informou.
    order.setState((STATE_FACTORY[payload.status] ?? STATE_FACTORY[OrderStateEnum.RECEIVED])());

    // Reconstrói os marcos de tempo do preparo — é isso que faz o cronômetro
    // congelar certinho quando o pedido já foi concluído.
    order.setPreparationTimestamps(
        payload.preparationStartedAt ? new Date(payload.preparationStartedAt) : undefined,
        payload.preparationFinishedAt ? new Date(payload.preparationFinishedAt) : undefined
    );

    return order;
};
