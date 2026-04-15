# Data Manipulation & Space Management

In MySQL, how you remove data directly impacts physical disk health.

TRUNCATE vs. DELETE:

DELETE: Row-by-row, generates heavy Undo/Redo logs, does not shrink the file.

TRUNCATE: Drops and recreates the table, resets the auto-increment, much faster.

Fragmentation (The "Swiss Cheese" Effect): Why deleting rows leaves "holes" in your .ibd files.

Reclaiming Space: How to use OPTIMIZE TABLE or ALTER TABLE ... ENGINE=InnoDB to defragment and "shrink" files back to the OS.

Related Topic to Add: MVCC (Multi-Version Concurrency Control). Understanding how InnoDB uses the Undo Log to provide consistent reads without locking is essential for understanding why files stay large even after deletes.