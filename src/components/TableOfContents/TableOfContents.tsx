import React from 'react';
import { TableOfContentsItem } from './TableOfContentsItem';
import useTableOfContents from '../../hooks/useTableOfContents';
import type { TableOfContentsProps } from '../../types';
import styles from './TableOfContents.module.scss';

export const TableOfContents: React.FC<TableOfContentsProps> = ({
                                                                    data,
                                                                    onItemClick,
                                                                    onAnchorClick,
                                                                    initialActiveId,
                                                                    searchable = false,
                                                                    className,
                                                                }) => {
    const { state, actions, loading, error } = useTableOfContents({
        data,
        initialActiveId,
        enableSearch: searchable,
    });

    const { items, searchQuery, filteredItems } = state;
    const displayItems = filteredItems || items;

    const handleItemClick = (item: any) => {
        actions.setActiveItem(item.id);
        onItemClick?.(item);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        actions.setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        actions.clearSearch();
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
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className={styles.clearButton}
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className={styles.controls}>
                <button
                    onClick={actions.expandAll}
                    className={styles.controlButton}
                    title="Expand All"
                >
                    Expand All
                </button>
                <button
                    onClick={() => {
                        actions.collapseAll();
                        // If we're searching, also clear search to see the effect
                        if (searchQuery) {
                            actions.clearSearch();
                        }
                    }}
                    className={styles.controlButton}
                    title="Collapse All"
                >
                    Collapse All
                </button>
            </div>

            <nav className={styles.navigation} role="navigation" aria-label="Table of contents">
                {displayItems.length === 0 ? (
                    <div className={styles.empty}>
                        {searchQuery ? 'No matching items found.' : 'No items to display.'}
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
                                isSearching={!!searchQuery}
                            />
                        ))}
                    </ul>
                )}
            </nav>
        </div>
    );
};

export default TableOfContents;