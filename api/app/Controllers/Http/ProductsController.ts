import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Product from "App/Models/Product";
import {
    CreateProductValidator,
    UpdateProductValidator,
} from "App/Validators/ProductValidator";

export default class ProductsController {
    public async index({ request, response }: HttpContextContract) {
        const limit = Number.parseInt(request.input("limit")) || 10;
        const page = Number.parseInt(request.input("page")) || 1;

        const sortBy = request.input("sort_by") || "id";
        const order = request.input("order") || "asc";

        const products = await Product.query()
            .orderBy(sortBy, order)
            .paginate(page, limit);

        response.ok({
            products: products.all(),
            page: {
                current: products.currentPage,
                total: products.lastPage,
            },
        });
    }

    public async show({ params, response }: HttpContextContract) {
        const product = await Product.find(params.id);

        if (!product) {
            return response.notFound({ message: "Product not found" });
        }

        response.ok({ product });
    }

    public async store({ request, response }: HttpContextContract) {
        const payload = await request.validate(CreateProductValidator);

        const product = await Product.create(payload);

        response.created({ product });
    }

    public async update({ request, response, params }: HttpContextContract) {
        const product = await Product.find(params.id);

        if (!product) {
            return response.notFound({ message: "Product not found" });
        }

        const payload = await request.validate(UpdateProductValidator);
        await product.merge(payload).save();

        response.ok({ product });
    }

    public async destroy({ response, params }: HttpContextContract) {
        const product = await Product.find(params.id);

        if (!product) {
            return response.notFound({ message: "Product not found" });
        }

        await product.delete();

        response.noContent();
    }
}
