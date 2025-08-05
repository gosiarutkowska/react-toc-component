import React from 'react';
import type { TableOfContentsItemProps, TOCItem, TOCAnchor } from '../../types';
import styles from './TableOfContentsItem.module.scss';

export const TableOfContentsItem: React.FC<TableOfContentsItemProps> = ({
                                                                            item,
                                                                            onItemClick,
                                                                            onAnchorClick,
                                                                            onToggleExpand,
                                                                            isSearching = false,
                                                                        }) => {
    const hasChildren = item.children.length > 0;
    const hasAnchors = item.anchors.length > 0;
    const showAnchors = item.isActive && hasAnchors;
    const shouldShowExpanded = item.isExpanded || isSearching;

    const handleToggleExpand = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (hasChildren) {
            onToggleExpand?.(item.id);
        }
    };

    const handleItemClick = (e: React.MouseEvent) => {
        e.preventDefault();

        // If item has children, toggle expand on click
        if (hasChildren) {
            onToggleExpand?.(item.id);
        }

        // Always trigger the item click callback
        onItemClick?.(item);
    };

    const handleAnchorClick = (anchor: TOCAnchor) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAnchorClick?.(anchor);
    };

    const getItemClasses = () => {
        const classes = [styles.item];

        if (item.isActive) classes.push(styles.active);
        if (hasChildren) classes.push(styles.hasChildren);
        if (item.isExpanded) classes.push(styles.expanded);
        if (isSearching) classes.push(styles.searching);

        return classes.join(' ');
    };

    const getIndentLevel = () => {
        // For search results, reduce indentation
        if (isSearching) {
            return Math.min(item.level, 2);
        }
        return item.level;
    };

    return (
        <li className={getItemClasses()}>
            <div
                className={styles.itemContent}
                style={{
                    '--indent-level': getIndentLevel()
                } as React.CSSProperties}
            >
                {/* Single clickable area with icon + text */}
                <button
                    className={styles.itemButton}
                    onClick={handleItemClick}
                    title={item.title}
                    aria-expanded={hasChildren ? shouldShowExpanded : undefined}
                >
                    {/* Expand/Collapse Icon - part of the button */}
                    {hasChildren && (
                        <span className={styles.expandIcon}>
                            {shouldShowExpanded ? '▼' : '▶'}
                        </span>
                    )}

                    {/* Item Title */}
                    <span className={styles.itemTitle}>{item.title}</span>
                </button>
            </div>

            {/* Anchors - only show when item is active */}
            {showAnchors && (
                <ul className={styles.anchorsList}>
                    {item.anchors.map((anchor) => (
                        <li key={anchor.id} className={styles.anchorItem}>
                            <button
                                className={styles.anchorButton}
                                onClick={handleAnchorClick(anchor)}
                                title={anchor.title}
                            >
                                <span className={styles.anchorTitle}>
                                    {anchor.title}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Children - recursive rendering */}
            {hasChildren && shouldShowExpanded && (
                <ul className={styles.childrenList}>
                    {item.children.map((child) => (
                        <TableOfContentsItem
                            key={child.id}
                            item={child}
                            onItemClick={onItemClick}
                            onAnchorClick={onAnchorClick}
                            onToggleExpand={onToggleExpand}
                            isSearching={isSearching}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default TableOfContentsItem;