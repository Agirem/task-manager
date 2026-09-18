# Backend

Spring Boot 4 REST API: JWT auth and task CRUD, backed by MySQL.

## Stack

Java 21, Spring Boot 4 (Web, Data JPA, Security, Validation), MySQL,
`jjwt` for JWT signing/parsing.

## Run locally

Requires a MySQL instance reachable at `localhost:3306` (see the root
`docker-compose.yml` to spin one up, or run your own).

```bash
./mvnw spring-boot:run
```

The server starts on `:8080`. Default connection settings target
`localhost:3306/task_manager` with user `taskuser` - override via env vars
if needed (see below).

## Configuration

All values in `application.properties` fall back to local dev defaults and
can be overridden with environment variables:

| Variable | Purpose |
|---|---|
| `SPRING_DATASOURCE_URL` | JDBC URL |
| `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` | DB credentials |
| `JWT_SECRET` | Signing key for issued tokens |
| `JWT_EXPIRATION` | Token lifetime in ms |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins |

In production (Cloud Run), the `prod` Spring profile
(`application-prod.properties`) is activated instead, connecting to Cloud
SQL through its native connector rather than a plain JDBC URL - see the root
README for details.

## Tests

```bash
./mvnw test
```

## Docker

```bash
docker build -t task-manager-backend .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/task_manager \
  -e SPRING_DATASOURCE_USERNAME=taskuser \
  -e SPRING_DATASOURCE_PASSWORD=yourpassword \
  task-manager-backend
```

Pass any of the variables listed above with `-e` as needed. The root
`docker-compose.yml` already wires these for you if you use it instead.
