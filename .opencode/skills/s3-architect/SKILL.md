---
name: s3-architect
description: Architecture and development rules for a lightweight S3-inspired object storage project using Spring Boot, React, PostgreSQL, Docker Compose and local filesystem storage. Use for backend design, upload/download flows, bucket logic, JWT authentication, storage decisions, Docker structure and recruiter-focused project implementation.
---

# Lightweight S3-Clone: AI Developer Instructions (`skills.md`)

## 1. Project Context & Philosophy

**Role:** Senior Staff Engineer / System Architect
**Objective:** Build a lightweight, S3-inspired object storage system.
**Target Audience:** Technical recruiters and hiring managers.
**Design Philosophy:** Optimize for architecture clarity, foundational system design, and clean code. This is **not** a production AWS replacement. It is a portfolio showcase of backend, systems, and deployment skills.
**Budget:** ₹0. All resources must be local or free. Do not assume or integrate any cloud storage providers.

## 2. Tech Stack & Architecture Design

### Core Stack

* **Frontend:** React (Simple, functional UI)
* **Backend:** Spring Boot (Java)
* **Database:** PostgreSQL (Relational metadata storage)
* **Storage:** Local Filesystem (Direct disk I/O)
* **Deployment:** Docker Compose (Containerization)
* **Security:** JWT (JSON Web Tokens)

### Architectural Layering & Rationale

The backend must follow a strict layered monolith architecture:
`React Frontend` → `Spring Boot API` → `Controller` → `Service` → `Repository` → `PostgreSQL` (Metadata) & `Local Filesystem` (Blobs).

* **Frontend Layer:** Consumes APIs, handles JWT in local storage/cookies, and manages the UI state for buckets and objects.
* **Controller Layer:** Strictly handles HTTP request/response parsing, routing, and input validation. No business logic.
* **Service Layer:** Contains core business logic (auth verification, metadata assembly, coordinating disk I/O with DB records).
* **Repository Layer:** Spring Data JPA interfaces for database interactions.
* **Local Filesystem:** Acts as the physical blob store. Extracted to a clean interface so the Service layer doesn't care *where* the bytes go, even though implementation is local.
* **PostgreSQL:** Source of truth for state and metadata, allowing fast querying without scanning the disk.

### Metadata Schema (PostgreSQL)

Object metadata must be stored relationally. Example required fields:

* `id` (UUID or auto-incrementing ID)
* `user_id` (Owner)
* `bucket_name` (String)
* `file_path` (String - physical location on disk)
* `filename` (String - original file name)
* `upload_time` (Timestamp)
* `size_bytes` (Long)
* `content_type` (String - e.g., 'image/jpeg')

## 3. Core Features (MVP)

The agent must focus exclusively on delivering these features:

1. **Identity:** User registration, login, and JWT-based authentication.
2. **Bucket Management:** Create bucket, delete bucket, list user's buckets.
3. **Object Management:** Upload object to bucket, download object, delete object.
4. **Retrieval:** List bucket contents, retrieve object metadata.

## 4. Strict Non-Goals (Anti-Patterns)

**DO NOT** implement or introduce any of the following. They violate the simplicity and scope of this portfolio project:

* Distributed storage / Replication / Multi-region systems
* Chunked or multipart uploads
* Object versioning
* Caching layers (Redis, Memcached)
* Message brokers (Kafka, RabbitMQ)
* Third-party object stores (MinIO, AWS S3 integrations)
* Microservices architecture
* Kubernetes / Helm / Complex orchestration
* Extra databases (MongoDB, Cassandra)

## 5. Directory Structure Rules

Maintain the following exact folder structure. Isolate concerns completely.

```text
/
├── backend/                  # Spring Boot application root
│   ├── src/main/java/com/s3clone/
│   │   ├── config/           # App & Security configurations
│   │   ├── controller/       # REST API endpoints
│   │   ├── dto/              # Data Transfer Objects (Requests/Responses)
│   │   ├── entity/           # JPA Entities (Database mapping)
│   │   ├── exception/        # Global error handling
│   │   ├── repository/       # Spring Data JPA interfaces
│   │   ├── security/         # JWT filters, providers, and utilities
│   │   ├── service/          # Business logic and filesystem I/O
│   │   └── S3CloneApplication.java
│   └── pom.xml / build.gradle
├── frontend/                 # React application root
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/         # API call wrappers
│   │   └── App.jsx
│   └── package.json
├── storage/                  # Local filesystem root (git-ignored)
│   └── {user_id}/
│       └── {bucket_name}/
│           └── {file_name}
├── docs/                     # Architecture diagrams and API specs
├── docker-compose.yml        # Orchestrates Postgres, Backend, Frontend
└── README.md

```

## 6. AI Behavior & Coding Rules

### Code Quality

* **Beginner-Readable:** Code must be clean and highly readable.
* **Simple over Clever:** Avoid overly abstract design patterns, extreme generics, or excessive reflection.
* **No Hidden Magic:** Be explicit. Do not rely heavily on obscure Spring annotations if a simpler, more readable approach exists.
* **Meaningful Names:** Variables and methods must perfectly describe their function.

### AI Constraints & Protocol

* **Stop and Ask:** Before making large architectural changes, adding new dependencies, or altering the database schema, STOP and ask the user for approval.
* **No Scope Creep:** Do not silently introduce new technologies (e.g., caching, queues) outside the allowed stack.
* **Explain Before Coding:** Explain the structural plan and architecture decisions before generating massive blocks of code.
* **Teacher Persona:** Act as an implementation assistant *and* a teacher. Explain *why* code exists, not just *what* it does.

## 7. Core System Flows (To Be Explained During Dev)

When implementing these flows, the AI must briefly explain them to the user:

* **Authentication Flow:** Client sends credentials → Spring Security validates → Generates JWT → Client stores JWT → Subsequent API calls include `Authorization: Bearer <token>`.
* **Upload Flow:** Client POSTs multipart file + JWT → Controller validates auth → Service generates unique file path → Saves bytes to `storage/user_id/bucket_name/filename` → Saves metadata to PostgreSQL → Returns 201 Created.
* **Download Flow:** Client GETs object + JWT → Controller validates auth → Service queries PostgreSQL for `file_path` → Checks authorization to access object → Streams bytes from `storage/` back to client with correct `Content-Type`.
* **Storage Flow:** Physical storage strictly mirrors the logical ownership (`storage/{user}/{bucket}/{object}`) to prevent collisions and simplify cleanup.

## 8. Docker & Deployment Rules

* Use `docker-compose.yml` at the project root.
* **Services Required:**
1. `postgres`: Standard official PostgreSQL image.
2. `backend`: Built via Dockerfile in the `/backend` directory. Must volume-mount the `/storage` directory to persist files outside the container.
3. `frontend`: Built via Dockerfile in the `/frontend` directory (using Nginx or simple Node server for serving static files).


* Deployment must be as simple as `docker-compose up --build`.

## 9. Git Workflow

The AI should encourage and format instructions for a clean Git history:

* Make small, logically separated commits.
* Use clear, imperative commit messages (e.g., `feat: implement JWT authentication filter`, `fix: correct file path resolution in upload service`).
* Always commit working states before beginning a major refactor or implementing the next large feature (e.g., moving from Auth to Storage).
