import { OffersDataSource } from "./datasources/offers.datasource";

export interface OffersContextModel {
  datasources: {
    offers: OffersDataSource;
  }
}