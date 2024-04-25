import { AugmentedRequest, RESTDataSource } from '@apollo/datasource-rest';
import { ValueOrPromise } from '@apollo/datasource-rest/dist/RESTDataSource';
import axios, { AxiosInstance } from 'axios';
import DataLoader from 'dataloader';
import { ProductModel } from '../models/product.model';

const getBySkuLoader = new DataLoader(async (keys: readonly string[]) => {
  return await Promise.all(
    keys.map(async key => {
      return await (new ProductMSDataSource2().get(key))
      //return this.get(`https://odyssey-lift-off-rest-api.herokuapp.com/tracks`);
      //return await this.get(`https://api-stg.raiadrogasil.io/v2/api/products?code=${key}`)
    })
  )
})

enum MSDomain {
  PRODUCTS = 'products'
}
export abstract class MSDataSource extends RESTDataSource {
  //override baseURL = ''

  getToken(domain: MSDomain) {
    return this.post(`/${domain}/oauth2/token`, {
      body: {
        grant_type: 'client_credentials',
        client_id: 'rd-app-ecommerce-stg',
        client_secret: '/JXn0MWG1ZJZnWq9',
      }
    })
  }
}

export class ProductMSDataSource2 {
  protected client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://api-stg.raiadrogasil.io/v2/api"
    })
  }
  async get(sku: string) {
    return await this.client.get(`/products?code=${sku}`, {
      headers: {
        Authorization: 'Bearer eziOpXjloifRI8e5D06Z8ZdRCE9kMO1O'
      }
    })
  }
}
export class ProductMSDataSource extends MSDataSource {

  protected async willSendRequest(path: string, request: AugmentedRequest): Promise<void> {
      //const token = await this.getToken(MSDomain.PRODUCTS);
    //console.log('token', token)
    const token = "eziOpXjloifRI8e5D06Z8ZdRCE9kMO1O";
    request.headers.authorization = `Bearer ${token}`
  }
  getBySKU(sku: string) {
    console.log('teste')
    //return this.get(`https://odyssey-lift-off-rest-api.herokuapp.com/tracks`);
    return this.get(`https://json-server-api-fake-3df6b4c1971c.herokuapp.com/products/${sku}`);
    return this.get(`https://api-stg.raiadrogasil.io/v2/api/products?code=${sku}`)
  }

  getBySKU2(sku: string) {
    return getBySkuLoader.load(sku)
  }
}

export class ProductMSDataSource3 extends RESTDataSource {
  override async willSendRequest(path: string, request: AugmentedRequest): Promise<void> {
    console.log('willSendRequest')
      //const token = await this.getToken();
      request.headers.authorization = `Bearer teste`
  }

  getBySKU(sku: string) {
    console.log('teste')
    //return this.get(`https://odyssey-lift-off-rest-api.herokuapp.com/tracks`);
    return this.get(`https://json-server-api-fake-3df6b4c1971c.herokuapp.com/products/${sku}`);
  }

  async getToken() {
    const token =  await this.get(`https://odyssey-lift-off-rest-api.herokuapp.com/tracks`);
    console.log('token', token)
    return token;
  }
}

export class ProductDataSource extends RESTDataSource {

  baseURL?: string | undefined = process.env.DATABASE_URL;

  async list(): Promise<ProductModel[]> {
    return this.get('/products');
  }

  async getBySKU(sku: string): Promise<ProductModel> {
    return this.get(`/products/${sku}`);
  }
}