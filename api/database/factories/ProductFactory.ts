import Drive from "@ioc:Adonis/Core/Drive";
import Factory from "@ioc:Adonis/Lucid/Factory";
import { file } from "@ioc:Adonis/Core/Helpers";
import { Attachment } from "@ioc:Adonis/Addons/AttachmentLite";
import Product from "App/Models/Product";

export default Factory.define(Product, async ({ faker }) => {
    const image = new Attachment({
        extname: "png",
        mimeType: "image/png",
        size: 10 * 1024,
        name: `${faker.string.alphanumeric(10)}.png`,
    });

    image.isPersisted = true;

    await Drive.put(image.name, (await file.generatePng("1mb")).contents);

    return {
        code: faker.string.alpha({ casing: "upper", length: 4 }),
        name: faker.commerce.productName(),
        stock: faker.number.int({ max: 100, min: 10 }),
        unit: "pcs",
        image,
    };
}).build();
