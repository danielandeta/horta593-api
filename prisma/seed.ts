import { OrderStatus, PrismaClient, UserRole } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function createRandomUser(userRole: UserRole = UserRole.USER) {
  let firstName = faker.person.firstName();
  let lastName = faker.person.lastName();
  let email = faker.internet.email();
  let password = faker.internet.password();

  if (userRole === UserRole.ADMIN) {
    firstName = 'Cosmito';
    lastName = 'Marquez';
    email = 'cosmito@gmail.com';
    password = 'contrasena';
  }
  const hash = await argon.hash(password);

  return prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      hash,
      role: userRole,
    },
  });
}

async function createRandomCategory() {
  let name = faker.commerce.department();
  const categories = await prisma.category.findMany();
  if (categories) {
    const categoryNames = categories.map((category) => category.name);
    while (categoryNames.includes(name)) {
      name = faker.commerce.department();
    }
  }

  return prisma.category.create({
    data: {
      name: faker.commerce.department(),
      icon: 'https://via.placeholder.com/50',
    },
  });
}

async function createRandomProduct(categoryId: string) {
  let productName = faker.commerce.productName();
  const products = await prisma.product.findMany();
  if (products) {
    const productNames = products.map((product) => product.name);
    while (productNames.includes(productName)) {
      productName = faker.commerce.productName();
    }
  }
  return prisma.product.create({
    data: {
      name: productName,
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      categoryId,
    },
  });
}

async function createRandomOrder(userId: string) {
  return prisma.order.create({
    data: {
      userId,
      amount: parseFloat(faker.commerce.price()),
    },
  });
}

async function createRandomOrderDetail(orderId: string, productId: string) {
  return prisma.orderDetail.create({
    data: {
      orderId,
      productId,
      status: 'SENT',
      quantity: faker.number.int({ min: 1, max: 5 }),
      total: parseFloat(faker.commerce.price()),
    },
  });
}

async function createRandomPromo() {
  return prisma.promo.create({
    data: {
      name: faker.commerce.productName(),
      active: faker.datatype.boolean(),
    },
  });
}

async function createRandomScore(userId: string) {
  return prisma.score.create({
    data: {
      points: faker.number.int({ min: 1, max: 100 }),
      userId,
    },
  });
}

async function createRandomPayment(orderId: string) {
  return prisma.payment.create({
    data: {
      orderId,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      nationalId: faker.string.uuid(),
      transferImage: faker.image.urlPicsumPhotos(),
    },
  });
}

async function seedDatabase() {
  const categories = [];
  const products = [];

  for (let i = 0; i < 5; i++) {
    let category = await createRandomCategory();
    categories.push(category);

    for (let j = 0; j < 5; j++) {
      let product = await createRandomProduct(category.id);
      products.push(product);
    }
  }

  const users = [];

  for (let i = 0; i < 5; i++) {
    const user = await createRandomUser();

    await createRandomScore(user.id);
    const order = await createRandomOrder(user.id);
    const product = products[i];
    for (let j = 0; j < 5; j++) {
      await createRandomOrderDetail(order.id, product.id);
    }
    await createRandomPayment(order.id);
  }

  await createRandomUser(UserRole.ADMIN);

  await createRandomPromo();
}

seedDatabase().finally(() => prisma.$disconnect());
