# Northcoders News API
In order to connect to the databases, you need to set up environment variables for both the development and test databases. You will need to create two .env files in the root directory of the project:

.env.development: this file should contain the environment variables for the development database.
Into each, add PGDATABASE=your_development_db_name

.env.test: this file should contain the environment variables for the test database.
Into each, add PGDATABASE=your_test_db_name
