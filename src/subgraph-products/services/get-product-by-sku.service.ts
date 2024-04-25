import { ProductDataSource } from "../datasources/datasource";
import { ProductModel } from "../models/product.model";

export class GetProductBySKUService {

  constructor (
    private productMSDataSource: ProductDataSource
  ) { }

  async execute(sku: string): Promise<ProductModel> {
    return this.productMSDataSource.getBySKU(sku);
  }
}