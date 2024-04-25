import { ProductDataSource, } from "./datasources/datasource"

export interface ProductContextModel {
  datasources: {
    product: ProductDataSource;
  }
}