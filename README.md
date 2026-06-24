# Architectural Decision Log & Approach

This document outlines the core technical decisions, architectural patterns, and engineering considerations adopted during the design and implementation of the E-Commerce platform.

---

CSV file was downloaded on 21 Jun 2026 at 8:27 am

## Key Technical Decisions

### 1. Polyglot Persistence: PostgreSQL + MongoDB Dual Storage
* **Decision:** Relational records are mapped to **PostgreSQL**, while system diagnostic metadata is routed to **MongoDB**.
* **Rationale:** * Core business objects like `Products` and `Orders` require strict ACID compliance, relational integrity, and foreign-key constraints (e.g., an Order must map cleanly to structural transactional IDs). PostgreSQL ensures complete structural stability here.
  * In contrast, CSV bulk processing logs (`/api/import-logs`) are inherently document-oriented and write-heavy. CSV uploads can vary wildly in size, error structures, or schema versions over time. Storing these audit footprints inside MongoDB keeps large, un-indexed payload logs away from transactional tables while taking advantage of MongoDB's document-store flexibilities.

### 2. Frontend State Isolation via React Context API (`CartContext`)
* **Decision:** Used native React Context to coordinate state globally across components for the shopping cart.
* **Rationale:** Persistent views like the `Navbar` badge count, total item additions from `ProductCard`, and line-item modification in `CartPage` require immediate synchronization. Context provides a native, highly readable mechanism to distribute cart events cleanly without adding bulky external architecture.

### 3. Nginx API Gate Deployment
* **Decision:** The frontend is packaged into a production build and multi-staged directly into an **Nginx** base layer on standard web port `80`.
* **Rationale:** Offloads asset hosting completely from Spring Boot. It provides a standardized runtime environment that acts as a scalable, clean entrypoint for application rendering.

---

## Architectural & Engineering Approach

* **Containerization First:** The environment utilizes a fully decoupled multi-container ecosystem via `docker-compose.yml`. Network isolation ensures backend containers address internal database engines over private bridge ports safely (`5432`/`27017`), while exposing accessible host proxies dynamically.
* **Resilient Service Lifecycle Mechanics:** Container orchestrations include robust health-checks utilizing custom diagnostic pings (e.g., executing structural ping checks over `mongosh` inside the container lifecycle) to guarantee dependent backend services only attempt booting after storage engine ports are officially verified active.
* **Unified API Design:** Global Axios interceptors inject clean validation boundaries, abstract configuration constraints, and baseline mapping across client requests uniformly.

---

## Alternatives Considered

### Alternative 1: Single Database (PostgreSQL Only)
* **Why it was rejected:** While storing CSV logs in a `JSONB` column inside PostgreSQL was fully viable, high-volume batch imports run the risk of bloat on main structural tables. Isolating logs entirely to MongoDB preserves transactional speeds on critical inventory calls.

### Alternative 2: Redux Toolkit for Frontend State
* **Why it was rejected:** While Redux is ideal for complex, massive state ecosystems, the data surface layer of an e-commerce cart is highly streamlined. Introducing Redux actions, slices, and store configurations would introduce unnecessary boilerplate engineering overhead for a lightweight client application.

### Alternative 3: Running Containers without Health-Check Definitions
* **Why it was rejected:** Spring Boot frameworks initialize data connection pools the absolute millisecond they boot. Without container-level health validations, a database that initializes 5 seconds late will cause an immediate backend crash, leading to unstable deployment lifecycles.

### Alternative 4: Full Microservices Architecture (Splitting Auth, Inventory, and Orders into distinct applications)
* **Why it was rejected:** Breaking down a streamlined e-commerce application into distributed microservices introducing independent runtime instances adds massive architectural complexity premature to its growth stage. Distributed architectures require implementing complex transaction synchronization patterns (like the Saga Pattern), strict event-driven message brokers (Kafka/RabbitMQ), and localized independent routing layers. Given the current velocity requirements and clean domain isolation already achieved via the database split, a highly modular monolithic backend minimizes networking overhead, simplifies testing, and vastly reduces localized deployment friction.


## How to run the project 
### Executing: docker compose up --build -d
Is completely sufficient to compile, link, and spin up your entire architecture in the background, provided the prerequisites are installed.
### Technical Prerequisites
* **The Core Docker Engine & Docker Compose Plugin**
* **The project downloaded in your local machine**
* **Sufficient Host Port Availability. Ports 80, 8080, 5434, 27017**