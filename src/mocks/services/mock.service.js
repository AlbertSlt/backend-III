import { faker } from '@faker-js/faker';
import {
    USER_ROLES,
    PRODUCT_STATUS,
    ORDER_STATUS,
    ORDER_PRIORITY,
    DELIVERY_STATUS
} from '../../utils/constants.js';
import MockRepository from '../repositories/mock.repository.js';

class MockService {
    generateMockUsers = (count, role = USER_ROLES.USER) => {
        const users = Array.from({ length: count }, () => {
            return {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email().toLowerCase(),
                password: faker.internet.password({ length: 10 }),
                role
            };
        });

        return users;
    };

    generateMockProducts = (count) => {
        const products = Array.from({ length: count }, () => {
            return {
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: parseFloat(faker.commerce.price()),
                code: faker.string.uuid(),
                stock: faker.number.int({ min: 0, max: 100 }),
                status: faker.helpers.arrayElement(Object.values(PRODUCT_STATUS)),
                thumbnail: [faker.image.url()]
            };
        });

        return products;
    };

    generateMockOrders = (count, userIds = []) => {
        return Array.from({ length: count }, () => {
            return {
                user: userIds.length
                    ? faker.helpers.arrayElement(userIds)
                    : faker.database.mongodbObjectId(),
                items: [{
                    product: faker.database.mongodbObjectId(),
                    quantity: faker.number.int({ min: 1, max: 5 })
                }],
                address: faker.location.streetAddress(),
                status: faker.helpers.arrayElement(Object.values(ORDER_STATUS)),
                priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY))
            };
        });
    };

    generateMockDeliveries = (count, orderIds = [], courierIds = []) => {
        return Array.from({ length: count }, () => {
            return {
                order: orderIds.length
                    ? faker.helpers.arrayElement(orderIds)
                    : faker.database.mongodbObjectId(),
                courier: courierIds.length
                    ? faker.helpers.arrayElement(courierIds)
                    : null,
                status: faker.helpers.arrayElement(Object.values(DELIVERY_STATUS))
            };
        });
    };

    insertMockData = async ({ users = 5, couriers = 3, orders = 5, deliveries = 5 } = {}) => {
        const insertedUsers = await MockRepository.insertUsers(
            this.generateMockUsers(users, USER_ROLES.USER)
        );
        const insertedCouriers = await MockRepository.insertUsers(
            this.generateMockUsers(couriers, USER_ROLES.COURIER)
        );

        const userIds = insertedUsers.map((user) => user._id);
        const courierIds = insertedCouriers.map((courier) => courier._id);

        const insertedOrders = await MockRepository.insertOrders(
            this.generateMockOrders(orders, userIds)
        );
        const orderIds = insertedOrders.map((order) => order._id);

        const insertedDeliveries = await MockRepository.insertDeliveries(
            this.generateMockDeliveries(deliveries, orderIds, courierIds)
        );

        return {
            users: insertedUsers.length,
            couriers: insertedCouriers.length,
            orders: insertedOrders.length,
            deliveries: insertedDeliveries.length
        };
    };
    saveMockProducts = async (products) => {
        return await MockRepository.insertProducts(products);
    };
}

export default new MockService();