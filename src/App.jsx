import "./App.css";

function App(props) {
    const { id, image, img, price, author, title, onSelect, selectedBookId, loans = [], onViewDetails } = props;

    const isSelected = selectedBookId === id;
    
    // Check if this book is currently on loan
    const isOnLoan = loans.some((loan) => loan.bookId === id && !loan.returned);

    function handleClick() {
        if (onSelect) {
            // Toggle selection - if already selected, deselect; otherwise select
            if (isSelected) {
                onSelect(null);
            } else {
                onSelect(id);
            }
        }
    }

    function handleViewDetails(e) {
        e.stopPropagation(); // Prevent triggering the parent's onClick
        if (onViewDetails) {
            onViewDetails(id);
        }
    }

    const imgSrc = image || img || "";

    return (
        <div className='container' style={{ position: "relative" }}>
            <div
                className="bookdetails"
                style={{ position: "relative", background: isSelected ? "#f6e9ffff" : undefined }}
                onClick={handleClick}
            >
                {isOnLoan && (
                    <div className="on-loan-banner">On loan</div>
                )}
                
                <div className='listings'>
                    {imgSrc ? <img src={imgSrc} alt={title || "book"} /> : null}
                </div>
                <div className='details'>
                    {price !== undefined && <p>${price}</p>}
                    <p className='author'>by: {author || ""}</p>
                </div>
                <button 
                    className="view-details-btn" 
                    onClick={handleViewDetails}
                >
                    View Details
                </button>
            </div>
        </div>
    );
}


export default App;
