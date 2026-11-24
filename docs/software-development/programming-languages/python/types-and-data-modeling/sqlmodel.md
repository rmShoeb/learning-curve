# SQLModel
- In traditional Python web architectures, developers maintain two parallel hierarchies of class definitions.
- SQLAlchemy ORM models for relational persistence and Pydantic BaseModel schemas for request validation and response serialization.
- This dual-schema architecture introduces structural duplication, modifying a single column often requires updating the database model, the creation schema, the read schema, and the update schema separately.
- SQLModel resolves this duplication by unifying SQLAlchemy's `DeclarativeBase` and Pydantic's `BaseModel` into a single class inheritance hierarchy.

## The Unified Model Concept

![sqlmodel-architecture](../images/sqlmodel-architecture.png)

- Every class inheriting from `SQLModel` is simultaneously a valid Pydantic model and a valid SQLAlchemy ORM entity (when configured with `table=True`).
- Data Models (`table=False`, the default) behave strictly as Pydantic `BaseModel` classes. They execute full runtime validation and type coercion upon instantiation and do not register tables in `SQLModel.metadata`.
- Table Models (`table=True`) register a mapped SQL table in `SQLModel.metadata` and attach SQLAlchemy `InstrumentedAttribute` descriptors onto class fields.
    - `table=True` Bypasses Pydantic Validation on Instantiation.
    - This is the most widespread pitfall in SQLModel.
    - For architectural compatibility with SQLAlchemy's instrumentation lifecycle, classes declared with `table=True` do not run Pydantic validation when instantiated directly (`Hero(age="not-a-number")` will not raise a `ValidationError` in Python until the database rejects the SQL `INSERT`).
    - Mitigation: Always validate untrusted data through a `table=False` schema (`HeroCreate`, `HeroUpdate`) first, or explicitly call `Hero.model_validate(data)` when constructing a `table=True` model.
- If `__tablename__` is omitted on a `table=True` class, SQLModel automatically sets the table name to `cls.__name__.lower()` (e.g., `UserAccount` becomes `useraccount`, not `user_accounts`).
- Always define `__tablename__` explicitly on `table=True` models to maintain predictable table names.

```python
from sqlmodel import Field, SQLModel

# Pure Pydantic Schema (table=False by default)
class HeroInput(SQLModel):
    name: str
    secret_name: str
    age: int | None = None

# SQLAlchemy ORM Table + Pydantic Schema (table=True)
class Hero(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    secret_name: str
    age: int | None = Field(default=None, index=True)
```

## Separation of Schemas
- Exposing a database table model (`table=True`) directly at API boundaries creates severe security and data-integrity vulnerabilities.
	- Over-Posting / Mass Assignment: A client sending {`"id": 1, "is_admin": true`} in a creation payload could overwrite database-controlled primary keys or privilege flags.
	- Data Leakage: Returning a table model directly serializes sensitive internal columns (such as `hashed_password` or `internal_audit_notes`).
	- Partial Update Friction: HTTP `PATCH` endpoints accept optional subsets of fields, whereas database table models require non-nullable columns to be present.
- SQLModel solves this via schema inheritance, sharing core field definitions in a non-table base class while isolating boundary contracts into specialized subclasses.

```python
from sqlmodel import Field, SQLModel

# 1. Shared Base Schema (table=False): Common fields across all representations
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=120, index=True)
    description: str | None = Field(default=None, max_length=500)
    price_cents: int = Field(gt=0)

# 2. Database Table Model (table=True): Adds primary keys, foreign keys, and internal state
class Item(ItemBase, table=True):
    __tablename__ = "items"

    id: int | None = Field(default=None, primary_key=True)
    internal_cost_cents: int = Field(default=0)
    owner_id: int = Field(foreign_key="users.id")

# 3. Creation Schema (table=False): Only fields the client is permitted to submit
class ItemCreate(ItemBase):
    owner_id: int

# 4. Read/Public Response Schema (table=False): Guarantees `id` is non-optional and omits internal costs
class ItemRead(ItemBase):
    id: int
    owner_id: int

# 5. Partial Update Schema (table=False): Every field becomes optional for PATCH operations
class ItemUpdate(SQLModel):
    title: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=500)
    price_cents: int | None = Field(default=None, gt=0)
```

## Field Configuration
- SQLModel's `Field()` function acts as a unified bridge that translates arguments into both Pydantic validation constraints and SQLAlchemy `mapped_column()` DDL parameters.
- When a column requires advanced SQLAlchemy capabilities not exposed directly by `sqlmodel.Field()` (such as `server_default=func.now()`, timezone-aware `DateTime`, PostgreSQL `ARRAY` or `JSONB` types, or custom `onupdate` triggers), pass a raw SQLAlchemy `Column(...)` object to `sa_column`.
- Mutual Exclusivity Rule: When `sa_column` is provided on a `Field()`, SQLAlchemy-specific arguments (`primary_key`, `index`, `unique`, `nullable`, `foreign_key`) must be configured directly inside that `Column(...)` rather than on `Field()`, or SQLModel raises a `RuntimeError`.

```python
from datetime import datetime
from sqlalchemy import CheckConstraint, Column, DateTime, UniqueConstraint, func
from sqlmodel import Field, SQLModel

class Account(SQLModel, table=True):
    __tablename__ = "accounts"

    # Primary key & database index
    id: int | None = Field(default=None, primary_key=True)

    # Unique constraint + B-tree index + Pydantic string length validation
    email: str = Field(unique=True, index=True, min_length=5, max_length=255)

    # Foreign key referencing 'tablename.column'
    organization_id: int = Field(foreign_key="organizations.id", ondelete="CASCADE")

    # Numerical Pydantic constraints (ge, le) + Python default
    credit_limit: int = Field(default=1000, ge=0, le=1_000_000)

    # Escape hatch to raw SQLAlchemy Column via `sa_column` for database-specific features
    created_at: datetime | None = Field(
        default=None,
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False,
        ),
    )

    # Composite constraints and multi-column indexes via SQLAlchemy's __table_args__
    __table_args__ = (
        UniqueConstraint("organization_id", "email", name="uq_org_account_email"),
        CheckConstraint("credit_limit >= 0", name="ck_accounts_credit_non_negative"),
    )
```

## Relationships in SQLModel
- SQLModel wraps SQLAlchemy's `relationship()` with `sqlmodel.Relationship()`, maintaining bidirectional object synchronization while keeping Pydantic serialization safe from infinite recursion.
- `back_populates="heroes"` does not refer to the SQL table name "`heroes`". It refers to the Python attribute name `heroes: list["Hero"]` defined on the `Team` class.
    - On `Team`, the attribute is named `heroes` , so `Hero.team` points to `back_populates="heroes"`.
    - On `Hero`, the attribute is named team (singular, because a hero belongs to one team), so Team.heroes points to back_populates="team".
- If a `Team` instance holds a list of `Hero` objects, and each `Hero` holds a back-reference to its `Team`, serializing them directly causes a cyclic reference loop (`Team -> heroes -> Hero -> team -> Team -> ...`).
- SQLModel prevents recursion bugs through dedicated nested Read schemas that break the cycle intentionally.
- Because `HeroRead` omits the `team` attribute, `TeamReadWithHeroes` serializes the parent team and its nested hero list cleanly without traversing back upward into `Team`.

```python
from sqlmodel import Field, Relationship, SQLModel

class TeamBase(SQLModel):
    name: str = Field(index=True, unique=True)
    headquarters: str

class Team(TeamBase, table=True):
    __tablename__ = "teams"

    id: int | None = Field(default=None, primary_key=True)

    # Relationship attributes are ORM-only; Pydantic does not treat them as table columns
    heroes: list["Hero"] = Relationship(
        back_populates="team",
        cascade_delete=True,  # SQLModel shortcut for cascade="all, delete-orphan"
    )

class HeroBase(SQLModel):
    name: str = Field(index=True)
    secret_name: str

class Hero(HeroBase, table=True):
    __tablename__ = "heroes"

    id: int | None = Field(default=None, primary_key=True)
    team_id: int | None = Field(
        default=None,
        foreign_key="teams.id",
        ondelete="CASCADE",
    )

    team: Team | None = Relationship(back_populates="heroes")

# Leaf read schema (contains NO parent back-reference)
class HeroRead(HeroBase):
    id: int
    team_id: int | None = None

class TeamRead(TeamBase):
    id: int

# Expanded read schema explicitly includes nested children using the non-cyclic HeroRead
class TeamReadWithHeroes(TeamRead):
    heroes: list[HeroRead] = []

class HeroReadWithTeam(HeroRead):
    team: TeamRead | None = None
```

## CRUD Integration
- SQLModel provides thin, type-enhanced wrappers around SQLAlchemy's `Session` and `select()` APIs so static type checkers infer exact model return types without needing `.scalars()`.
- `session.exec(statement)` wraps SQLAlchemy's `session.execute()` while automatically extracting scalar ORM models (eliminating `.scalars()`) and preserving full generic type inference for `mypy` and `pyright`.
- `model.sqlmodel_update(data)` safely mutates an existing ORM instance in place from a dictionary of validated fields while triggering SQLAlchemy's dirty-tracking history.
- Because SQLModel uses SQLAlchemy's `Session` and relationship engine under the hood, accessing `team.heroes` on a loaded `Team` outside an active session or inside an async context still triggers lazy-loading rules.
- Always pass `.options(selectinload(Team.heroes)`) to `select(Team)` when serializing nested relationship schemas like `TeamReadWithHeroes`.

```python
from sqlmodel import Session, SQLModel, create_engine, select

engine = create_engine(
    "postgresql+psycopg://app_user:secret@localhost:5432/heroes_db",
    pool_pre_ping=True,
)

# 1. CREATE: Validate input schema -> convert to table model -> persist
def create_hero(session: Session, payload: HeroCreate) -> Hero:
    db_hero = Hero.model_validate(payload)
    session.add(db_hero)
    session.commit()
    session.refresh(db_hero)  # Reloads DB-generated ID and defaults
    return db_hero

# 2. READ: SQLModel's `select(Hero)` infers `Hero` directly on `session.exec()`
def get_heroes_by_team(session: Session, team_name: str) -> list[Hero]:
    statement = (
        select(Hero)
        .join(Team)
        .where(Team.name == team_name)
        .order_by(Hero.name)
    )
    # `session.exec()` automatically unwraps scalar ORM objects (replaces `session.scalars()`)
    return list(session.exec(statement).all())

# 3. PARTIAL UPDATE (PATCH): Apply only fields explicitly supplied by the caller
def update_hero(session: Session, hero_id: int, payload: HeroUpdate) -> Hero | None:
    db_hero = session.get(Hero, hero_id)
    if not db_hero:
        return None

    # `exclude_unset=True` ignores fields omitted from the incoming JSON request
    update_data = payload.model_dump(exclude_unset=True)
    db_hero.sqlmodel_update(update_data)

    session.add(db_hero)
    session.commit()
    session.refresh(db_hero)
    return db_hero

# 4. DELETE
def delete_hero(session: Session, hero_id: int) -> bool:
    db_hero = session.get(Hero, hero_id)
    if not db_hero:
        return False

    session.delete(db_hero)
    session.commit()
    return True
```