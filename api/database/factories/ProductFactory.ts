import Product from "App/Models/Product";
import Factory from "@ioc:Adonis/Lucid/Factory";

export default Factory.define(Product, ({ faker }) => {
    return {
        code: faker.string.alpha({ casing: "upper", length: 4 }),
        name: faker.commerce.productName(),
        stock: faker.number.int({ max: 100, min: 10 }),
        unit: "pcs",
    };
}).build();
