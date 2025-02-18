import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { handleDBExceptions } from 'src/common/helpers/handle-db-exception.helper';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { encrypt } from 'src/auth/lib/encrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const user = await this.insertUsers();
    return await this.insertNewProducts(user);
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });
    const dbUsers = await this.userRepository.save(seedUsers);
    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    try {
      await this.productsService.deleteAllProducts();
      const products = initialData.products;
      const insertPromises = [];
      products.forEach((product) => {
        insertPromises.push(this.productsService.create(product, user));
      });
      await Promise.all(insertPromises);
      return 'SEED Executed';
    } catch (error) {
      handleDBExceptions(error);
    }
  }
}
