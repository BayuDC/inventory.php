import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Product from "App/Models/Product";

export default class ProductsController {
    public async index({ request, response }: HttpContextContract) {
        const limit = Number.parseInt(request.input("limit")) || 10;
        const page = Number.parseInt(request.input("page")) || 1;

        const sortBy = request.input("sort_by") || "id";
        const order = request.input("order") || "asc";

        const products = await Product.query()
            .orderBy(sortBy, order)
            .paginate(page, limit);

        return response.json({
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
            return response.status(404).json({
                message: "Product not found",
            });
        }

        return response.json({ product });
    }

    public async store({}: HttpContextContract) {}

    public async update({}: HttpContextContract) {}

    public async destroy({}: HttpContextContract) {}
}
