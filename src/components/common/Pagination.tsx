import type { PaginationProps } from "../../types";

export function Pagination({
    pageInfo,
    currentPage,
    onPreviousPage,
    onNextPage,
    className = "",
    infoClassName = "",
    buttonsClassName = "",
    buttonClassName = "",
}: PaginationProps) {
    if (pageInfo.totalPages <= 1) {
        return null;
    }

    return (
        <div className={className}>
            <span className={infoClassName}>
                Page {currentPage + 1} of {pageInfo.totalPages}
            </span>
            <div className={buttonsClassName}>
                <button
                    className={buttonClassName}
                    disabled={pageInfo.first}
                    onClick={onPreviousPage}
                >
                    Previous
                </button>
                <button
                    className={buttonClassName}
                    disabled={pageInfo.last}
                    onClick={onNextPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
