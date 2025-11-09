import "./ManageLoans.css";

function ManageLoans({ books = [], loans = [], setLoans, onBack }) {
    // Get available books (books that are not currently on loan)
    const availableBooks = books.filter(
        (book) => !loans.some((loan) => loan.bookId === book.id && !loan.returned)
    );

    // Get current active loans (not returned)
    const activeLoans = loans.filter((loan) => !loan.returned);

    function handleBorrow(bookId) {
        const borrowDate = new Date();
        const dueDate = new Date(borrowDate);
        dueDate.setDate(dueDate.getDate() + 30);
        
        const newLoan = {
            id: `loan-${Date.now()}`,
            bookId: bookId,
            borrowerName: "", // No name input required
            borrowDate: borrowDate.toLocaleDateString(),
            dueDate: dueDate.toLocaleDateString(),
            returned: false,
        };
        setLoans([...loans, newLoan]);
    }

    function handleReturn(loanId) {
        setLoans(
            loans.map((loan) =>
                loan.id === loanId ? { ...loan, returned: true, returnDate: new Date().toLocaleDateString() } : loan
            )
        );
    }

    // Find book details by bookId
    const getBookById = (bookId) => {
        return books.find((book) => book.id === bookId);
    };

    return (
        <div className="manage-loans-container">
            <div className="loans-header-section">
                <h2 className="loans-header">Manage Loans</h2>
                <button className="back-to-catalog-btn" onClick={onBack}>
                    Back to Catalog
                </button>
            </div>

            <div className="loans-content">
                <div className="available-books-section">
                    <h3>Available Books to Borrow</h3>
                    {availableBooks.length === 0 ? (
                        <div className="no-books-message">
                            <p>There are no available books to borrow.</p>
                        </div>
                    ) : (
                        <div className="available-books-list">
                            {availableBooks.map((book) => (
                                <div key={book.id} className="loan-book-item">
                                    <div className="loan-book-info">
                                        <strong>{book.title}</strong>
                                        {book.author && <span> by {book.author}</span>}
                                    </div>
                                    <button
                                        className="borrow-btn"
                                        onClick={() => handleBorrow(book.id)}
                                    >
                                        Borrow
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="current-loans-section">
                    <h3>Currently on loan</h3>
                    {activeLoans.length === 0 ? (
                        <div className="no-loans-message">
                            <p>No active loans.</p>
                        </div>
                    ) : (
                        <div className="loans-list">
                            {activeLoans.map((loan) => {
                                const book = getBookById(loan.bookId);
                                if (!book) return null;
                                return (
                                    <div key={loan.id} className="loan-item">
                                        <div className="loan-info">
                                            <p><strong>Borrower:</strong> {loan.borrowerName || ""}</p>
                                            <p><strong>Book:</strong> {book.title}</p>
                                            <p><strong>Due date:</strong> {loan.dueDate}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManageLoans;

