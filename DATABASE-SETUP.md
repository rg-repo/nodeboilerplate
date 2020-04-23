# Database setup

running the setup instructions will create a mysql container in docker.
In order to have database up and running we need to create a Database in the mysql container we installed.

## steps to create a DB

- we have to enter the mysql terminal which can be done in 2 ways:
  - If you've synchronised your IDE(VS Code) as descibed above. You will have a docker extension accessible in your left panel of VS Code.
    - Click on the docker extension.
    - You will see a section titled as `Containers` containing the list all docker containers on your system.
    - Right click on the mysql container
    - And select `Attach shell` option. This will open the terminal with bash inside the mysql container.
    - `mysql -u <DB_USER> -p` to enter mysql terminal
    - You'll be prompted for mysql password. After entering password, you'll reach mysql terminal.
  - In your terminal follow and execute the following commands in sequence
    - `docker ps -a` this will list all the containers on your system
    - From the list of containers select and copy the container id of mysql container
    - `docker exec -u <DB_USER> -it <CONTAINER_ID> mysql -p` replace <DB_USER> and <CONTAINER_ID> by the actual values and execute.
    - You'll be prompted for mysql password. After entering password, you'll reach mysql terminal.
- `CREATE DATABASE <DB_NAME>;` replace <DB_NAME> by the database name in your `.env` file

## useful mysql terminal commands

- `CREATE DATABASE <DB_NAME>;` to create a database
- `SHOW DATABASES;` list all databases
- `DROP DATABASE <DB_NAME>` drop a particular database
- `USE <DB_NAME>;` to select and execute sql commands on a particular DB
- `SHOW TABLES;` lists all tables in a DB. `SHOW TABLES FULL;` lists tables with table type
- `SHOW COLUMNS FROM <TABLE_NAME>;` list columns of a table

## useful sequelize commands

- `sequelize migration:generate --name <MIGRATION_NAME>` to create a migration file
- `sequelize db:migrate` run all pending migrations
- `sequelize db:migrate:undo` undo the last executed migration
- `sequelize db:migrate:undo:all` undo all migrations
- `sequelize db:migrate:undo:all --to <MIGRATION_FILE_NAME>` undo all migrations till the specified migration file
