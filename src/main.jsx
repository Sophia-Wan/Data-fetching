import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AddNew from "./AddNew.jsx";
import ManageLoans from "./ManageLoans.jsx";
import BookDetailsPage from "./BookDetailsPage.jsx";


function Filter({ books, onFilterChange }) {
    const handleChange = (e) => {
        const value = e.target.value;
        onFilterChange(value === 'All' ? null : value);
    };

    // Get unique authors from books
    const authors = ['All', ...new Set(books.map(book => book.author).filter(Boolean))];

    return (
        <div className="filter" >
            <span >Filter by author:</span>
            <select
                onChange={handleChange}
            >
                {authors.map(author => (
                    <option key={author} value={author}>
                        {author}
                    </option>
                ))}
            </select>
        </div>
    );
}

function AddNewWrapper() {
    const [books, setBooks] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [loans, setLoans] = useState([]);
    const [currentView, setCurrentView] = useState('catalog'); // 'catalog', 'loans', or 'details'
    const [viewingBookId, setViewingBookId] = useState(null);

    const filteredBooks = selectedAuthor
        ? books.filter(book => book.author === selectedAuthor)
        : books;

    const viewingBook = books.find(b => b.id === viewingBookId);

    const handleViewDetails = (bookId) => {
        setViewingBookId(bookId);
        setCurrentView('details');
    };

    const handleBackFromDetails = () => {
        setViewingBookId(null);
        setCurrentView('catalog');
    };

    return (
        <div className='bookList'>
            <div >
                <h1 className='title'>BOOK CATALOG</h1>
                <div className='line'> </div>
                <div className='top-bar'>
                    {currentView === 'catalog' && (
                        <>
                            <button 
                                className="manage-loans-btn" 
                                onClick={() => setCurrentView('loans')}
                            >
                                Manage Loans
                            </button>
                            <Filter books={books} onFilterChange={setSelectedAuthor} />
                        </>
                    )}
                </div>
            </div>

            {currentView === 'details' ? (
                <BookDetailsPage 
                    book={viewingBook} 
                    onBack={handleBackFromDetails}
                />
            ) : currentView === 'catalog' ? (
                <div className='allContent'>
                    <div className='books'>
                        <div className='griding'>
                            {filteredBooks.map((b) => (
                                <App
                                    key={b.id}
                                    {...b}
                                    onSelect={(bookId) => setSelectedBookId(bookId)}
                                    selectedBookId={selectedBookId}
                                    loans={loans}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                            <AddNew
                                books={books}
                                setBooks={setBooks}
                                selectedBookId={selectedBookId}
                                setSelectedBookId={setSelectedBookId}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <ManageLoans
                    books={books}
                    loans={loans}
                    setLoans={setLoans}
                    onBack={() => setCurrentView('catalog')}
                />
            )}

            <footer className='footer'>
                <p>@Wing Yan Sophia Wan, 2025 </p>
            </footer>
        </div>
    );
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AddNewWrapper />
    </StrictMode>
);