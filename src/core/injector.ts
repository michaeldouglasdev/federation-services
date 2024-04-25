import { INJECTABLE_METADATA } from "../decorators/constants";

export type Constructable<T> = {
  new (...args: any[]): T
}
export class Injector {
  static get<T>(target: Constructable<T>):T {
    const injectable = Reflect.getMetadata(INJECTABLE_METADATA, target);
    if (!injectable) {
      throw new Error(`Target ${target.name} is not injectable. Use @Injectable`)
    }

    const services: [] = Reflect.getMetadata("design:paramtypes", target) || [];
    const dependencies = services.map(service => Injector.get(service));

    return new target(...dependencies);
  }
}