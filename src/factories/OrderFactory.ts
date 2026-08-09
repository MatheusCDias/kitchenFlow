import { Order } from '../models/Order';
import { Customer } from '../models/Customer';
import { Address } from '../models/Address';
import { TableService } from '../models/service/TableService';
import { Cook } from '../models/employee/Cook';
import { Employee } from '../models/employee/Employee';
import { OrderOriginEnum } from '../enums/OrderOriginEnum';
import { CategoryEnum } from '../enums/CategoryEnum';
import { DrinkTypeEnum } from '../enums/DrinkTypeEnum';
import { FoodItem } from '../models/menu/FoodItem';
import { DrinkItem } from '../models/menu/DrinkItem';
import { OrderItem } from '../models/OrderItem';
import { Ingredient } from '../models/kitchen/Ingredient';
import { Recipe } from '../models/kitchen/Recipe';

export class OrderFactory {
    private static baseIngredients = {
        meat: new Ingredient('ing-1', 'Carne Artesanal 180g', 1, 1, 'unidade'),
        cheese: new Ingredient('ing-2', 'Queijo Cheddar', 2, 2, 'fatias'),
        fries: new Ingredient('ing-3', 'Batata Palito', 250, 250, 'g'),
    };

    private static baseRecipes = {
        burger: new Recipe(
            'rec-1',
            'Grelhar a carne no ponto desejado e selar o pão na manteiga.',
            new Date(),
            1,
            12.0,
            [OrderFactory.baseIngredients.meat, OrderFactory.baseIngredients.cheese]
        ),
        fries: new Recipe(
            'rec-2',
            'Fritar a batata a 180°C por 5 minutos até dourar.',
            new Date(),
            1,
            4.0,
            [OrderFactory.baseIngredients.fries]
        ),
    };

    private static baseMenu = {
        burger: new FoodItem(
            'menu-1',
            'Hambúrguer Artesanal',
            32.00,
            'Delicioso hambúrguer',
            2026,
            10,
            new Date(),
            CategoryEnum.MAIN_COURSE,
            1
        ),
        fries: new FoodItem(
            'menu-2',
            'Batata Frita Grande',
            18.00,
            'Porção individual',
            2026,
            15,
            new Date(),
            CategoryEnum.APPETIZER,
            1
        ),
        soda: new DrinkItem(
            'menu-3',
            'Refrigerante',
            7.00,
            'Lata 350ml',
            2026,
            5,
            false,
            DrinkTypeEnum.CAN
        ),
    };

    static createOrder(
        id: string,
        code: number,
        deadlineMinutes: number,
        assignedEmployee?: Employee
    ): Order {
        const address = new Address('Rua Principal', 100, '13730-000', 'Apto 12');
        const customer = new Customer('cust-101', 'João Silva', '(19) 98765-4321');
        customer.addAddress(address);

        const tableService = new TableService(new Date(), 5, 2);
        const now = new Date();
        const kitchenDeadline = new Date(now.getTime() + deadlineMinutes * 60000);

        const order = new Order(
            id,
            code,
            OrderOriginEnum.PRESENTIAL,
            new Date (kitchenDeadline),
            kitchenDeadline,
            new Date(now.getTime() + (deadlineMinutes + 15) * 60000),
            deadlineMinutes,
            customer,
            tableService,
            assignedEmployee,
            now,
        );

        // Adicionar itens ao pedido
        order.addItem(new OrderItem(
            'item-1',
            this.baseMenu.burger.getName(),
            2,
            new Date(),
            '1x Sem picles',
            this.baseMenu.burger,
            this.baseRecipes.burger
        ));

        order.addItem(new OrderItem(
            'item-2',
            this.baseMenu.fries.getName(),
            2,
            new Date(),
            '',
            this.baseMenu.fries,
            this.baseRecipes.fries
        ));

        order.addItem(new OrderItem(
            'item-3',
            this.baseMenu.soda.getName(),
            1,
            new Date(),
            'Com Gelo',
            this.baseMenu.soda
        ));

        return order;
    }

    static createMockOrders(employee: Employee): Order[] {
        return [
            this.createOrder('ord-101', 101, 5),
            this.createOrder('ord-102', 102, 10, new Cook('emp-2', 'Funcionário #2', 3, 'Tarde')),
            this.createOrder('ord-103', 103, 7),
            this.createOrder('ord-104', 104, 20),
            this.createOrder('ord-105', 105, 9),
            this.createOrder('ord-106', 106, 30),
        ];
    }
}