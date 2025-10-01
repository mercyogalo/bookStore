import { BookCard } from './BookCard';

export function BookList({ books, title, className = "" }) {
  if (!books || books.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No books found.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
}