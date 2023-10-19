# PostgreSQL migration test application



This is a application that uses a PostgreSQL database and consumes the DB configuration via a Kubernetes ConfigMap and Secret.

This allows the configuration to be changed easily based on environment the application is deployed in.

This allows use to migrate schemas easily

Creating and managing database schema migrations are crucial steps in the development lifecycle of applications utilizing databases like PostgreSQL. Schema migrations help in evolving the database schema over time without any manual intervention. Here's a step-by-step guide on how to handle PostgreSQL schema migrations:

1. Setup Environment:
Ensure PostgreSQL is installed and running on your machine or a server.
Choose a migration tool. Popular choices include Flyway, Alembic, or Sequelize based on your project's language or framework.
2. Initial Schema Creation:
Create your initial database schema as SQL scripts or using an ORM (Object Relational Mapper) to define your models.
Save the schema creation script as the first migration file, usually named with a timestamp or version number, e.g., V1__initial_schema.sql.
3. Configure Migration Tool:
Configure your migration tool with the necessary database connection information.
Specify the directory where your migration files will be stored.
4. Creating New Migrations:
Whenever you need to alter the database schema, create a new migration file.
Name the migration file with an incremental version number or timestamp, e.g., V2__add_new_column.sql.
Write the necessary SQL commands to alter the schema in the migration file.
5. Testing Migrations:
In a development or staging environment, run the migration tool to apply the migrations.
Verify that the schema has been updated as expected without any errors.
It's a good practice to have a rollback plan. Some migration tools support rollback scripts to undo migrations.
6. Applying Migrations:
In the production environment, run the migration tool to apply the migrations.
It's advisable to have backups and possibly a maintenance window depending on the nature and size of the changes.
7. Monitoring:
Monitor the application and database performance to ensure the migrations haven't introduced any issues.
Some migration tools have logging and monitoring capabilities to track migration history and status.
8. Version Control:
Store all migration files in version control to keep a history of schema changes.
This also facilitates collaboration among developers and ensures consistency across different environments.
9. Documentation:
Document any significant schema changes, the purpose of each migration, and any potential impacts.
Keeping a well-maintained documentation of the database schema and migrations is crucial for understanding the system and for troubleshooting.
10. Automation:
Automate the migration process as much as possible to reduce manual errors.
Integrating schema migrations into your CI/CD pipeline can ensure that migrations are applied as part of the deployment process.
By following these steps, you'll be able to create, manage, and apply PostgreSQL schema migrations efficiently and reliably.

For example, the ConfigMap and Secret when using an AWS RDS instance are as follows
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  annotations:
    kasten.io/config: dataservice
  name: dbconfig
data:
  dataservice.type: postgres
  postgres.manager: awsrds
  postgres.host: dbendpoint.adsadasa.us-west-2.rds.amazonaws.com
  postgres.databases: mypgsqldb
  postgres.user: postgres
  postgres.secret: dbcreds # name of K8s secret in the same namespace

---

apiVersion: v1
kind: Secret
metadata:
  name: dbcreds
type: Opaque
data:
  password: <BASE64 encoded password>
  ```

## Build/Package application
```bash
make clean
make container
make push
```

## Deployment into Kubernetes
```bash
# Set namespace to deploy into
export NAMESPACE=pgtestrds
kubectl create namespace ${NAMESPACE}
kubectl apply -f deploy/. --namespace ${NAMESPACE}
```

## Testing the application
Use `kubectl proxy` to connect to the service in the cluster
```
kubectl proxy&
```
### Get Service and Database Information
```bash
http://127.0.0.1:8001/api/v1/namespaces/pgtestrds/services/pgtestapp:8080/proxy/
```

### Count rows
```bash
http://127.0.0.1:8001/api/v1/namespaces/pgtestrds/services/pgtestapp:8080/proxy/count
```

### Insert a new row
```bash
http://127.0.0.1:8001/api/v1/namespaces/pgtestrds/services/pgtestapp:8080/proxy/insert
```


