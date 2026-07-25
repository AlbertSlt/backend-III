import UserModel from '../../models/user.model.js';
import OrderModel from '../../models/order.model.js';
import DeliveryModel from '../../models/delivery.model.js';
import ProductModel from '../../models/product.model.js';


class MockRepository {
    async insertUsers(users) {
        return await UserModel.insertMany(users);
    }

    async insertOrders(orders) {
        return await OrderModel.insertMany(orders);
    }

    async insertDeliveries(deliveries) {
        return await DeliveryModel.insertMany(deliveries);
    }

    async insertProducts(products) {
        return await ProductModel.insertMany(products);
    }
}
export default new MockRepository();