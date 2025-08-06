import React from 'react';
import { TableOfContentsItem } from './TableOfContentsItem';
import useTableOfContents from '../../hooks/useTableOfContents';
import type { TableOfContentsProps, TOCItem } from '../../types';
import styles from './TableOfContents.module.scss';

export const TableOfContents: React.FC<TableOfContentsProps> = ({
                                                                    data,
                                                                    onItemClick,
                                                                    onAnchorClick,
                                                                    initialActiveId,
                                                                    searchable = false,
                                                                    className,
                                                                    apiEndpoint = '/api/toc',
                                                                }) => {
    const {
        state,
        actions,
        loading,
        error,
        isSearching
    } = useTableOfContents({
        data,
        initialActiveId,
        enableSearch: searchable,
        apiEndpoint,
        searchDebounceMs: 400,
        minQueryLength: 2,
    });

    const { items, searchQuery, filteredItems } = state;
    const displayItems = filteredItems || items;
    const isShowingSearchResults = !!filteredItems;

    const handleItemClick = (item: TOCItem): void => {
        actions.setActiveItem(item.id);
        onItemClick?.(item);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const query = e.target.value;
        actions.setSearchQuery(query);
    };

    const clearSearch = (): void => {
        actions.clearSearch();
    };

    const handleCollapseAll = (): void => {
        actions.collapseAll();

        if (searchQuery) {
            actions.clearSearch();
        }
    };

    if (loading) {
        return (
            <div className={`${styles.container} ${className || ''}`}>
                <div className={styles.loading}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Loading table of contents...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${styles.container} ${className || ''}`}>
                <div className={styles.error}>
                    <p>Error loading table of contents: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${className || ''}`}>
            {searchable && (
                <div className={styles.searchContainer}>
                    <div className={styles.searchInputWrapper}>
                        <input
                            type="text"
                            placeholder="Search documentation..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                            autoComplete="off"
                            spellCheck={false}
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className={styles.clearButton}
                                aria-label="Clear search"
                                title="Clear search"
                            >
                                ×
                            </button>
                        )}
                        {isSearching && (
                            <div className={styles.searchSpinner} aria-label="Searching...">
                                <div className={styles.searchSpinnerIcon}></div>
                            </div>
                        )}
                    </div>

                    {/* Search status */}
                    {searchQuery && searchQuery.length >= 2 && !isSearching && (
                        <div className={styles.searchStatus}>
                            {isShowingSearchResults ? (
                                <span className={styles.searchResults}>
                                    Found {displayItems.length} result{displayItems.length !== 1 ? 's' : ''} for "{searchQuery}"
                                </span>
                            ) : (
                                <span className={styles.searchNoResults}>
                                    No results found for "{searchQuery}"
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className={styles.controls}>
                <button
                    onClick={actions.expandAll}
                    className={styles.controlButton}
                    title="Expand All"
                    disabled={isShowingSearchResults}
                >
                    Expand All
                </button>
                <button
                    onClick={handleCollapseAll}
                    className={styles.controlButton}
                    title="Collapse All"
                >
                    {searchQuery ? 'Clear & Collapse' : 'Collapse All'}
                </button>
            </div>

            <nav className={styles.navigation} role="navigation" aria-label="Table of contents">
                {displayItems.length === 0 ? (
                    <div className={styles.empty}>
                        {searchQuery && searchQuery.length >= 2 ? (
                            <>
                                <p>No matching items found for "{searchQuery}"</p>
                                <p className={styles.emptyHint}>Try a different search term or browse the full tree.</p>
                            </>
                        ) : searchQuery ? (
                            <p>Type at least 2 characters to search...</p>
                        ) : (
                            <p>No items to display.</p>
                        )}
                    </div>
                ) : (
                    <ul className={styles.list}>
                        {displayItems.map((item) => (
                            <TableOfContentsItem
                                key={item.id}
                                item={item}
                                onItemClick={handleItemClick}
                                onAnchorClick={onAnchorClick}
                                onToggleExpand={actions.toggleExpanded}
                                isSearching={isShowingSearchResults}
                            />
                        ))}
                    </ul>
                )}
            </nav>
        </div>
    );
};

export default TableOfContents;