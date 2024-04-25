import { RESTDataSource } from "@apollo/datasource-rest";
import { OfexSectionModel } from "../models/ofex-section.model";
import { OfferModel } from "../models/offer.model";

export class OffersDataSource extends RESTDataSource {

  baseURL?: string | undefined = process.env.DATABASE_URL;

  async list(): Promise<OfferModel[]> {
    return this.get('/offers');
  }

  async listOfexSection(): Promise<OfexSectionModel[]> {
    return this.get('/ofex-sections');

  }
}