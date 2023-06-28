import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import ProductFactory from "Database/factories/ProductFactory";
import UserFactory from "Database/factories/UserFactory";

export default class extends BaseSeeder {
    public async run() {
        await UserFactory.createMany(10);
        await ProductFactory.createMany(100);
    }
}
