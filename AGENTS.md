# AGENTS.md - Instructions for AI Agents

This document provides context and guidelines for AI agents working on this project. Please adhere to these rules and use the provided information to understand the system architecture and business logic.

## System Information

- **Timestamp**: 2025-08-20 15:20:42.454928

## Database Schema

Here is the Entity-Relationship diagram for the PostgreSQL database.

```mermaid
erDiagram
    UTENTE {
        int id_utente PK
        string nome
        string cognome
        string email
        string telefono
        string indirizzo
        string citta
        string cap
        date data_registrazione
        boolean attivo
    }

    ORDINE {
        int id_ordine PK
        int id_utente FK
        date data_ordine
        decimal totale
        string stato
        string metodo_pagamento
        string indirizzo_spedizione
        date data_spedizione
        string note
    }

    PRODOTTO {
        int id_prodotto PK
        string nome
        string descrizione
        decimal prezzo
        int quantita_disponibile
        string categoria
        boolean attivo
        date data_creazione
    }

    DETTAGLIO_ORDINE {
        int id_dettaglio PK
        int id_ordine FK
        int id_prodotto FK
        int quantita
        decimal prezzo_unitario
        decimal subtotale
    }

    CATEGORIA {
        int id_categoria PK
        string nome
        string descrizione
        boolean attiva
    }

    STATO_ORDINE {
        int id_stato PK
        string nome_stato
        string descrizione
    }

    METODO_PAGAMENTO {
        int id_metodo PK
        string nome_metodo
        string descrizione
        boolean attivo
    }

    %% Relazioni
    UTENTE ||--o{ ORDINE : "effettua"
    ORDINE ||--o{ DETTAGLIO_ORDINE : "contiene"
    PRODOTTO ||--o{ DETTAGLIO_ORDINE : "incluso_in"
    CATEGORIA ||--o{ PRODOTTO : "appartiene_a"
    STATO_ORDINE ||--o{ ORDINE : "ha_stato"
    METODO_PAGAMENTO ||--o{ ORDINE : "pagato_con"
```

## Business Logic Flowchart

This flowchart describes the CRUD operations for orders.

```mermaid
flowchart TD
    A[Inizio] --> B{Operazione CRUD?}

    %% CREATE ORDER FLOW
    B -->|CREATE| C[Validazione Dati Utente]
    C --> D{Dati Validi?}
    D -->|NO| E[Log: Errore Validazione]
    E --> F[Email: Errore Registrazione]
    F --> G[Ritorna Errore 400]

    D -->|SI| H[Verifica Disponibilità Prodotti]
    H --> I{Prodotti Disponibili?}
    I -->|NO| J[Log: Prodotti Non Disponibili]
    J --> K[Email: Prodotti Non Disponibili]
    K --> L[Ritorna Errore 409]

    I -->|SI| M[Calcola Totale Ordine]
    M --> N[Inizia Transazione DB]
    N --> O[Crea Record Ordine]
    O --> P{Ordine Creato?}
    P -->|NO| Q[Rollback Transazione]
    Q --> R[Log: Errore Creazione DB]
    R --> S[Email: Errore Sistema]
    S --> T[Ritorna Errore 500]

    P -->|SI| U[Crea Dettagli Ordine]
    U --> V{Dettagli Creati?}
    V -->|NO| Q

    V -->|SI| W[Aggiorna Stock Prodotti]
    W --> X{Stock Aggiornato?}
    X -->|NO| Q

    X -->|SI| Y[Commit Transazione]
    Y --> Z[Log: Ordine Creato]
    Z --> AA[Email: Conferma Ordine]
    AA --> BB[Imposta Stato: CONFERMATO]
    BB --> CC[Ritorna Successo 201]

    %% READ ORDER FLOW
    B -->|READ| DD[Validazione ID Ordine]
    DD --> EE{ID Valido?}
    EE -->|NO| FF[Log: ID Non Valido]
    FF --> GG[Ritorna Errore 400]

    EE -->|SI| HH[Cerca Ordine nel DB]
    HH --> II{Ordine Trovato?}
    II -->|NO| JJ[Log: Ordine Non Trovato]
    JJ --> KK[Ritorna Errore 404]

    II -->|SI| LL[Verifica Autorizzazioni]
    LL --> MM{Autorizzato?}
    MM -->|NO| NN[Log: Accesso Non Autorizzato]
    NN --> OO[Ritorna Errore 403]

    MM -->|SI| PP[Recupera Dettagli Ordine]
    PP --> QQ[Log: Consultazione Ordine]
    QQ --> RR[Ritorna Dati Ordine]

    %% UPDATE ORDER FLOW
    B -->|UPDATE| SS[Validazione Dati Aggiornamento]
    SS --> TT{Dati Validi?}
    TT -->|NO| UU[Log: Dati Non Validi]
    UU --> VV[Ritorna Errore 400]

    TT -->|SI| WW[Verifica Esistenza Ordine]
    WW --> XX{Ordine Esiste?}
    XX -->|NO| YY[Log: Ordine Non Trovato]
    YY --> ZZ[Ritorna Errore 404]

    XX -->|SI| AAA[Verifica Stato Modificabile]
    AAA --> BBB{Stato Modificabile?}
    BBB -->|NO| CCC[Log: Stato Non Modificabile]
    CCC --> DDD[Ritorna Errore 409]

    BBB -->|SI| EEE[Inizia Transazione]
    EEE --> FFF[Aggiorna Dati Ordine]
    FFF --> GGG{Aggiornamento OK?}
    GGG -->|NO| HHH[Rollback Transazione]
    HHH --> III[Log: Errore Aggiornamento]
    III --> JJJ[Ritorna Errore 500]

    GGG -->|SI| KKK[Aggiorna Stato se Necessario]
    KKK --> LLL[Commit Transazione]
    LLL --> MMM[Log: Ordine Aggiornato]
    MMM --> NNN{Cambio Stato Significativo?}
    NNN -->|SI| OOO[Email: Aggiornamento Stato]
    NNN -->|NO| PPP[Ritorna Successo 200]
    OOO --> PPP

    %% DELETE ORDER FLOW
    B -->|DELETE| QQQ[Validazione ID Ordine]
    QQQ --> RRR{ID Valido?}
    RRR -->|NO| SSS[Log: ID Non Valido]
    SSS --> TTT[Ritorna Errore 400]

    RRR -->|SI| UUU[Verifica Esistenza Ordine]
    UUU --> VVV{Ordine Esiste?}
    VVV -->|NO| WWW[Log: Ordine Non Trovato]
    WWW --> XXX[Ritorna Errore 404]

    VVV -->|SI| YYY[Verifica Stato Cancellabile]
    YYY --> ZZZ{Stato Cancellabile?}
    ZZZ -->|NO| AAAA[Log: Ordine Non Cancellabile]
    AAAA --> BBBB[Email: Tentativo Cancellazione]
    BBBB --> CCCC[Ritorna Errore 409]

    ZZZ -->|SI| DDDD[Inizia Transazione]
    DDDD --> EEEE[Ripristina Stock Prodotti]
    EEEE --> FFFF{Stock Ripristinato?}
    FFFF -->|NO| GGGG[Rollback Transazione]
    GGGG --> HHHH[Log: Errore Ripristino Stock]
    HHHH --> IIII[Ritorna Errore 500]

    FFFF -->|SI| JJJJ[Soft Delete Ordine]
    JJJJ --> KKKK{Cancellazione OK?}
    KKKK -->|NO| GGGG

    KKKK -->|SI| LLLL[Commit Transazione]
    LLLL --> MMMM[Log: Ordine Cancellato]
    MMMM --> NNNN[Email: Conferma Cancellazione]
    NNNN --> OOOO[Ritorna Successo 200]

    %% COMMON END POINTS
    G --> PPPP[Fine]
    L --> PPPP
    T --> PPPP
    CC --> PPPP
    GG --> PPPP
    KK --> PPPP
    OO --> PPPP
    RR --> PPPP
    VV --> PPPP
    ZZ --> PPPP
    DDD --> PPPP
    JJJ --> PPPP
    PPP --> PPPP
    TTT --> PPPP
    XXX --> PPPP
    CCCC --> PPPP
    IIII --> PPPP
    OOOO --> PPPP

    %% STYLING
    classDef errorNode fill:#ffebee,stroke:#c62828,stroke-width:2px
    classDef successNode fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef processNode fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef decisionNode fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef emailNode fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef logNode fill:#fff9c4,stroke:#f9a825,stroke-width:2px

    class E,J,R,FF,JJ,NN,UU,YY,CCC,III,SSS,WWW,AAAA,HHHH logNode
    class F,K,S,AA,OOO,BBBB,NNNN emailNode
    class G,L,T,GG,KK,OO,VV,ZZ,DDD,JJJ,TTT,XXX,CCCC,IIII errorNode
    class CC,RR,PPP,OOOO successNode
    class D,I,P,V,X,EE,II,MM,TT,XX,BBB,GGG,NNN,RRR,VVV,ZZZ,FFFF,KKKK decisionNode
```

## Technical Guidelines and Coding Standards

These rules are for the **TESTAIGENT** solution.

### 1. Naming Conventions
- **Functions/Methods**: Use CamelCase (`getUserById`, `registerUser`, `calculateScore`).
- **Private Variables, Properties, and Fields**: Use a `_` prefix (`_userRepository`, `_isActive`, `_count`).
- **Other variables**: Use camelCase without a prefix (`userId`, `propertyList`, `score`).
- **Classes, Interfaces, Enums, Records, Types**: Use PascalCase (`UserRepository`, `IUserService`, `UserType`, `PropertyRecord`).

### 1.1 Logging Conventions
- Always use Serilog for logging.
- Use the Seq sink.
- Use file log sinks with daily rotation.

### 2. Code Best Practices
- Write clear, readable, and maintainable code.
- Divide logic into methods and classes with a single responsibility (SRP).
- Use architectural patterns (CQRS, Repository, UnitOfWork, Extension Method).
- Always validate input/output (ModelState, attributes, FluentValidation).
- Handle errors and logging in a centralized and advanced way (Serilog, ILogger, audit, try/catch, standard HTTP responses).
- Mandatory logging for errors, warnings, info, and audit trails.
- Use standardized HTTP responses (BadRequest, Unauthorized, NotFound, etc.).
- Use XML documentation on controllers, services, and middleware.
- Keep documentation and comments updated with every change.

### 3. Cache and Data Access Management

#### 3.1 Repository Pattern with Cache
- Every repository must have its corresponding CacheRepository that implements the Cache-Aside pattern.
- The CacheRepository receives both the base Repository and the RedisCacheRepository via Dependency Injection.
- **Mandatory read flow**: CacheRepository → check cache → if not present, Repository → save to cache.
- **Mandatory write flow**: Repository for CRUD operations → invalidate/update cache.

#### 3.2 Layered Architecture for Data Access
- **API Layer**: Can only call a Service or CacheRepository, never a Repository directly.
- **Service Layer**: Can call CacheRepository or Repository as needed.
- **CacheRepository**: The single point of access that combines cache and repository.
- **Repository**: Exclusive access to the database via DbContext.
- **Strictly forbidden**: Direct database connections outside of Repositories.

#### 3.3 Cache Implementation
- Use appropriate TTL (Time To Live) for each data type.
- Handle cache miss cases with a fallback to the database.
- Implement cache invalidation strategies for write operations.
- Mandatory logging for cache hits/misses and invalidation operations.

#### 3.4 Database Connection Management
- **Only Repositories** can directly access the DbContext.
- Always use `AsNoTracking()` for read-only operations.
- Manage database transactions exclusively in Repositories.
- Implement retry logic for critical operations.

### 4. Commenting requirements
- **Classes, Interfaces, Records, Types, Enums**: Every element must have an XML comment describing its purpose and usage.
- **Public methods and properties**: Comment with XML doc, describing parameters, returns, and exceptions.
- **Private methods and variables**: Comment only if the logic is not immediately understandable.
- **Update comments** with every significant change.
- **The entire solution is now documented with XML comments on every main source file (August 2025).**

### 5. Configuration Standards
- Use common configuration files (`appsettings.json`, `appsettings.Development.json`, etc.).
- Define configuration keys consistently and document them.
- Centralize the management of connection strings, security keys, and environment parameters.
- Use Dependency Injection for service configuration.
- Version and document every change to configuration files.

### 6. Application of Standards
- All projects and logical flows in the solution must strictly and mandatorily adhere to these rules.
- For specific needs, document exceptions in the README of the individual project.
- Conduct periodic code reviews to ensure compliance with standards.

---

**Note:**
These rules are mandatory for the entire team and must be kept up to date. Any new convention or change must be integrated into this document and communicated to all project members.

**Last modified:** 19 agosto 2025
