import { ProductDataSource } from "../datasources/datasource";
import { ProductModel } from "../models/product.model";

export class ListProductsService {
  constructor (
    private datasource: ProductDataSource,
  ) { }

  async execute(): Promise<ProductModel[]>{
    return await this.datasource.list();
  }
}