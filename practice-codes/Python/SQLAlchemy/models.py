from dataclasses import dataclass, field


@dataclass
class BookCreate:
    title: str
    isbn: str
    published_year: int
    author_name: str
    author_country: str | None = None
    genres: list[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        self.title = self.title.strip()
        self.isbn = self.isbn.strip()
        self.author_name = self.author_name.strip()
        if not self.title:
            raise ValueError("Book title cannot be empty.")
        if not self.isbn:
            raise ValueError("ISBN cannot be empty.")
        if not self.author_name:
            raise ValueError("Author name cannot be empty.")
        if self.published_year < 0 or self.published_year > 2100:
            raise ValueError("Published year must be between 0 and 2100.")


@dataclass
class BookUpdate:
    title: str | None = None
    published_year: int | None = None
    author_name: str | None = None
    genres: list[str] | None = None