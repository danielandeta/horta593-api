# Horta593 API

## Requirements

Before starting, make sure you have at least these components on your workstation

- NVM (Node Version Management)
- Docker
- Docker-compose

Node version used in this project: v20.3.1 (stable)

## Project configuration

Start by cloning this project on your workstation

### HTTPS

```bash
git clone https://github.com/Galuchi-Restaurant/horta593-backend.git

```

### SSH

```bash
git clone git@github.com:Galuchi-Restaurant/horta593-backend.git
```

The next thing will be to install all the dependencies of the project.

```bash
cd path/to/horta593-backend
pnpm install
```

Once the dependencies are installed, you can now configure your project by creating a new `.env` file containing your environment variables used for development.

```bash
cp .env.example .env
vi .env
```

```bash
cp .env.exampletest .env.test
vi .env
```

## Starting the project

Now set the databases up

```bash
pnpm db:test:up
pnpm db:dev:up
```
Database initialization
```bash
pnpm run seed
```

Then you can start the application using this command

```bash
pnpm run start:dev
```

To run migrations you can execute the following command

```bash
pnpm prisma:dev:deploy
```

If you change something to the prisma models, you need to run this command

```bash
pnpm prisma:migrate
npx prisma generate
```

### production mode

```
pnpm run start:prod
```

### Test

```bash
# unit tests
pnpm run test

# e2e tests
pnpm test:e2e

# test coverage
pnpm run test:cov
```

### To visualize the databases in prisma studio

### Dev Database

```bash
npx dotenv -e .env -- prisma studio
```

### Test Database

```bash
npx dotenv -e .env.test -- prisma studio
```
