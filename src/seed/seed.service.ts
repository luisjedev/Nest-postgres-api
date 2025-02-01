import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { handleDBExceptions } from 'src/common/helpers/handle-db-exception.helper';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    return await this.insertNewProducts();
  }

  private async insertNewProducts() {
    try {
      await this.productsService.deleteAllProducts();

      const products = initialData.products;
      const insertPromises = [];

      products.forEach((product) => {
        insertPromises.push(this.productsService.create(product));
      });

      await Promise.all(insertPromises);
      return 'SEED Executed';
    } catch (error) {
      handleDBExceptions(error);
    }
  }
}
