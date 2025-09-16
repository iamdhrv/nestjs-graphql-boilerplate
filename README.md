# NestJS GraphQL Boilerplate

A production-ready NestJS GraphQL boilerplate with TypeORM, PostgreSQL, Redis, JWT authentication, monitoring, and Docker support.

## 🚀 Features

- **NestJS Framework** - Scalable Node.js server-side applications
- **GraphQL** - Code-first approach with automatic schema generation
- **TypeORM** - Database ORM with PostgreSQL support
- **Authentication** - JWT-based authentication and authorization
- **Caching** - Redis integration for performance optimization
- **Monitoring** - Prometheus metrics and Grafana dashboards
- **Logging** - Structured logging with multiple transports
- **Validation** - Request validation with class-validator
- **Docker** - Multi-stage builds and development environment
- **Code Generation** - Automated module generation scripts
- **Health Checks** - Application and database health monitoring

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally)
- Redis (if running locally)

## 🛠 Installation

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nestjs-graphql-boilerplate
   ```

2. **Start development environment**
   ```bash
   ./scripts/start-dev.sh
   ```

3. **Start monitoring stack (optional)**
   ```bash
   ./scripts/start-monitoring.sh
   ```

### Manual Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start PostgreSQL and Redis**
   ```bash
   # Using Docker
   docker-compose up -d postgres redis
   ```

4. **Run database migrations**
   ```bash
   npm run migration:run
   ```

5. **Start the application**
   ```bash
   npm run start:dev
   ```

## 🌐 Available Services

### Development Environment
- **Application**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/graphql
- **Health Check**: http://localhost:3000/health
- **Metrics**: http://localhost:3000/metrics
- **pgAdmin**: http://localhost:5050 (admin@admin.com / admin)
- **Redis Commander**: http://localhost:8081

### Monitoring Stack
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin / admin)
- **Loki**: http://localhost:3100
- **Node Exporter**: http://localhost:9100
- **cAdvisor**: http://localhost:8080

## 📁 Project Structure

```
src/
├── cache/                 # Redis cache configuration
├── common/               # Shared utilities and decorators
├── health/               # Health check endpoints
├── metrics/              # Prometheus metrics
├── migrations/           # Database migrations
├── modules/              # Feature modules
│   ├── auth/            # Authentication module
│   └── user/            # User management module
├── monitoring/           # Application monitoring
└── test/                # Test utilities

templates/                # Code generation templates
├── dto/                 # DTO templates
├── entity/              # Entity templates
├── resolver/            # Resolver templates
└── service/             # Service templates

scripts/                  # Utility scripts
├── generate-module.js   # Module generation script
├── start-dev.sh         # Development environment startup
└── start-monitoring.sh  # Monitoring stack startup

monitoring/               # Monitoring configuration
├── grafana/             # Grafana dashboards and config
├── loki/                # Loki log aggregation config
├── prometheus/          # Prometheus metrics config
└── promtail/            # Promtail log collection config
```

## 🔧 Code Generation

Generate a complete module with entity, service, resolver, and DTOs:

```bash
node scripts/generate-module.js Product
```

This creates:
- `src/modules/product/product.module.ts`
- `src/modules/product/product.service.ts`
- `src/modules/product/product.resolver.ts`
- `src/modules/product/entities/product.entity.ts`
- `src/modules/product/dto/create-product.input.ts`
- `src/modules/product/dto/update-product.input.ts`

## 🔐 Authentication

The boilerplate includes JWT-based authentication with the following endpoints:

### GraphQL Mutations
```graphql
# Register a new user
mutation {
  register(registerInput: {
    email: "user@example.com"
    password: "password123"
    firstName: "John"
    lastName: "Doe"
  }) {
    access_token
    user {
      id
      email
      firstName
      lastName
    }
  }
}

# Login
mutation {
  login(loginInput: {
    email: "user@example.com"
    password: "password123"
  }) {
    access_token
    user {
      id
      email
      firstName
      lastName
    }
  }
}
```

### Protected Queries
```graphql
# Get current user profile (requires Authorization header)
query {
  profile {
    id
    email
    firstName
    lastName
    createdAt
    updatedAt
  }
}
```

## 📊 Monitoring and Metrics

### Application Metrics
- HTTP request duration and count
- Error rates by endpoint
- Memory and CPU usage
- Database connection pool metrics
- Cache hit/miss rates

### Custom Metrics
```typescript
// In your service
constructor(private readonly monitoringService: MonitoringService) {}

// Record custom metrics
this.monitoringService.incrementCounter('custom_operation_total', { operation: 'create' });
this.monitoringService.recordTiming('operation_duration_ms', duration, { operation: 'create' });
```

### Health Checks
- Database connectivity
- Redis connectivity
- Memory usage
- Disk space

## 🐳 Docker Commands

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Restart application
docker-compose -f docker-compose.dev.yml restart app

# Stop environment
docker-compose -f docker-compose.dev.yml down
```

### Production
```bash
# Build and start production environment
docker-compose up -d

# Scale application
docker-compose up -d --scale app=3
```

### Monitoring
```bash
# Start monitoring stack
docker-compose -f docker-compose.monitoring.yml up -d

# View monitoring logs
docker-compose -f docker-compose.monitoring.yml logs -f
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🚀 Deployment

### Environment Variables
```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=nestjs_boilerplate

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Application
PORT=3000
NODE_ENV=production
```

### Production Build
```bash
# Build application
npm run build

# Start production server
npm run start:prod
```

## 📝 API Documentation

### GraphQL Schema
Visit http://localhost:3000/graphql to explore the interactive GraphQL playground with:
- Schema documentation
- Query/mutation examples
- Real-time testing interface

### REST Endpoints
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [GraphQL](https://graphql.org/) - Query language for APIs
- [TypeORM](https://typeorm.io/) - ORM for TypeScript and JavaScript
- [Prometheus](https://prometheus.io/) - Monitoring and alerting toolkit
- [Grafana](https://grafana.com/) - Analytics and monitoring platform

## 📞 Support

If you have any questions or need help, please:
1. Check the [documentation](docs/)
2. Search existing [issues](issues/)
3. Create a new [issue](issues/new) if needed

---

**Happy coding! 🎉**