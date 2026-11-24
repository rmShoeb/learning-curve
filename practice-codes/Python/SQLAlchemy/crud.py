from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload
from schemas import Author, Book, Genre
from models import BookCreate, BookUpdate


def _get_or_create_author(
    session: Session, name: str, country: str | None = None
) -> Author:
    stmt = select(Author).where(Author.name.ilike(name))
    author = session.scalar(stmt)
    if not author:
        author = Author(name=name, country=country)
        session.add(author)
        session.flush()  # Assigns author.id without committing the full transaction
    return author


def _get_or_create_genres(session: Session, genre_names: list[str]) -> list[Genre]:
    clean_names: list[str] = []
    for raw_name in genre_names:
        clean_name = raw_name.strip().title()
        if not clean_name:
            continue
        clean_names.append(clean_name)
    stmt = select(Genre).where(Genre.name.in_(clean_names))
    genre_objects = session.scalars(stmt).all()
    missing_genre_names = set([name.lower() for name in genre_names]).difference(set([genre_object.name.lower() for genre_object in genre_objects]))
    print(missing_genre_names)
    for missing_genre in missing_genre_names:
        genre = Genre(name=missing_genre.title())
        session.add(genre)
        genre_objects.append(genre)
    session.flush()
    return genre_objects


# --- CREATE ---
def create_book(session: Session, data: BookCreate) -> Book:
    author = _get_or_create_author(session, data.author_name, data.author_country)
    genres = _get_or_create_genres(session, data.genres)

    book = Book(
        title=data.title,
        isbn=data.isbn,
        published_year=data.published_year,
        author=author,
        genres=genres,
    )
    session.add(book)
    try:
        session.commit()
    except IntegrityError as exc:
        session.rollback()
        raise ValueError(f"A book with ISBN '{data.isbn}' already exists.") from exc

    return get_book_by_id(session, book.id)  # type: ignore[return-value]


# --- READ ---
def get_all_books(session: Session) -> list[Book]:
    stmt = (
        select(Book)
        .options(selectinload(Book.author), selectinload(Book.genres))
        .order_by(Book.id.asc())
    )
    return list(session.scalars(stmt).all())


def get_book_by_id(session: Session, book_id: int) -> Book | None:
    stmt = (
        select(Book)
        .options(selectinload(Book.author), selectinload(Book.genres))
        .where(Book.id == book_id)
    )
    return session.scalar(stmt)


def search_books(session: Session, keyword: str) -> list[Book]:
    pattern = f"%{keyword.strip()}%"
    stmt = (
        select(Book)
        .join(Book.author)
        .options(selectinload(Book.author), selectinload(Book.genres))
        .where(Book.title.ilike(pattern) | Author.name.ilike(pattern))
        .order_by(Book.title.asc())
    )
    return list(session.scalars(stmt).all())


# --- UPDATE ---
def update_book(session: Session, book_id: int, data: BookUpdate) -> Book | None:
    book = get_book_by_id(session, book_id)
    if not book:
        return None

    if data.title is not None and data.title.strip():
        book.title = data.title.strip()
    if data.published_year is not None:
        book.published_year = data.published_year
    if data.author_name is not None and data.author_name.strip():
        book.author = _get_or_create_author(session, data.author_name.strip())
    if data.genres is not None:
        book.genres = _get_or_create_genres(session, data.genres)

    session.commit()
    return get_book_by_id(session, book.id)


# --- DELETE ---
def delete_book(session: Session, book_id: int) -> bool:
    book = session.get(Book, book_id)
    if not book:
        return False
    session.delete(book)
    session.commit()
    return True