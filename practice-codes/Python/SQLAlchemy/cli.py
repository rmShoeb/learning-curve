from database import SessionLocal
from crud import (
    create_book,
    delete_book,
    get_all_books,
    get_book_by_id,
    search_books,
    update_book,
)
from schemas import Book
from models import BookCreate, BookUpdate
from logging_config import setup_logging


def print_book(book: Book) -> None:
    genre_list = ", ".join(g.name for g in book.genres) if book.genres else "None"
    country = f" ({book.author.country})" if book.author.country else ""
    print(
        f"[{book.id}] {book.title} ({book.published_year}) | "
        f"ISBN: {book.isbn} | Author: {book.author.name}{country} | "
        f"Genres: {genre_list}"
    )


def handle_add() -> None:
    title = input("Title: ")
    isbn = input("ISBN: ")
    year_str = input("Published Year: ")
    author_name = input("Author Name: ")
    author_country = input("Author Country (optional): ").strip() or None
    genres_raw = input("Genres (comma-separated, e.g. Sci-Fi, Classics): ")

    try:
        payload = BookCreate(
            title=title,
            isbn=isbn,
            published_year=int(year_str),
            author_name=author_name,
            author_country=author_country,
            genres=[g for g in genres_raw.split(",") if g.strip()],
        )
        with SessionLocal() as session:
            book = create_book(session, payload)
            print("\nBook added successfully:")
            print_book(book)
    except ValueError as err:
        print(f"\nError: {err}")


def handle_list() -> None:
    with SessionLocal() as session:
        books = get_all_books(session)
        if not books:
            print("\nNo books found in the database.")
            return
        print(f"\n--- Catalog ({len(books)} books) ---")
        for book in books:
            print_book(book)


def handle_search() -> None:
    keyword = input("Search by title or author: ")
    with SessionLocal() as session:
        results = search_books(session, keyword)
        if not results:
            print("\nNo matching books found.")
            return
        print(f"\n--- Search Results ({len(results)}) ---")
        for book in results:
            print_book(book)


def handle_update() -> None:
    try:
        book_id = int(input("Enter Book ID to update: "))
    except ValueError:
        print("Invalid ID.")
        return

    with SessionLocal() as session:
        existing = get_book_by_id(session, book_id)
        if not existing:
            print("Book not found.")
            return
        print("Leave any field blank to keep its current value.")
        print_book(existing)

        new_title = input("New Title: ").strip() or None
        new_year_str = input("New Published Year: ").strip()
        new_author = input("New Author Name: ").strip() or None
        new_genres_raw = input("New Genres (comma-separated, replaces existing): ").strip()

        new_year = int(new_year_str) if new_year_str else None
        new_genres = (
            [g for g in new_genres_raw.split(",") if g.strip()]
            if new_genres_raw
            else None
        )

        updated = update_book(
            session,
            book_id,
            BookUpdate(
                title=new_title,
                published_year=new_year,
                author_name=new_author,
                genres=new_genres,
            ),
        )
        if updated:
            print("\nBook updated:")
            print_book(updated)


def handle_delete() -> None:
    try:
        book_id = int(input("Enter Book ID to delete: "))
    except ValueError:
        print("Invalid ID.")
        return

    with SessionLocal() as session:
        if delete_book(session, book_id):
            print(f"\nBook ID {book_id} deleted.")
        else:
            print("\nBook not found.")


def main() -> None:
    setup_logging()
    menu = """
=== Book Manager ===
1. Add a book
2. List all books
3. Search books
4. Update a book
5. Delete a book
0. Exit
"""
    actions = {
        "1": handle_add,
        "2": handle_list,
        "3": handle_search,
        "4": handle_update,
        "5": handle_delete,
    }

    while True:
        print(menu)
        choice = input("Choose an option: ").strip()
        if choice == "0":
            print("Goodbye.")
            break
        action = actions.get(choice)
        if action:
            action()
        else:
            print("Invalid option. Try again.")


if __name__ == "__main__":
    main()