import logging
from logging.handlers import RotatingFileHandler


def _setup_sqlalchemy_logging(log_file: str = "sqlalchemy_queries.log") -> None:
    sql_logger = logging.getLogger("sqlalchemy.engine")
    sql_logger.setLevel(logging.DEBUG)  # logging.INFO to omit bound parameter values

    # Prevent SQL logs from leaking into stdout or your main application log file
    sql_logger.propagate = False

    # Avoid attaching duplicate handlers if setup is called more than once
    if not sql_logger.handlers:
        file_handler = RotatingFileHandler(
            log_file,
            maxBytes=10 * 1024 * 1024,  # 5 MB per file
            backupCount=3,
            encoding="utf-8",
        )
        formatter = logging.Formatter(
            "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
        )
        file_handler.setFormatter(formatter)
        sql_logger.addHandler(file_handler)

def setup_logging() -> None:
    _setup_sqlalchemy_logging()