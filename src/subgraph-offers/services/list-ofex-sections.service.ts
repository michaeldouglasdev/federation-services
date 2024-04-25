import { OffersDataSource } from "../datasources/offers.datasource";
import { OfexSectionModel } from "../models";

export class ListOfexSections {
  constructor (
    private offersDatasource: OffersDataSource
  ) {}

  async execute(): Promise<OfexSectionModel[]> {
    return await new Promise((res) => setTimeout(() => res(this.offersDatasource.listOfexSection()), 5000))
  }
}