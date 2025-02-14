
export default {
    development: {
        client: "postgresql",
        connection: {
            host: "localhost",
            database: "nodejs_starter_template",
            user: "postgres",
            password: "123",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },
}
