
```
bun install
```

### 3\. Configure Environment Variables

Copy the env.example file to create your .env file:

```
cp env.example .env
```

Edit the `.env` file with your project's specific configurations:

- Add your Supabase keys and URLs.
- Configure any required authentication secrets.

### 4\. Setup Drizzle ORM

Generate your Drizzle schema and push into your database:

```
bun db:push
```

### 5\. Start the Development Server

Run the development server:

```
bun dev
```

