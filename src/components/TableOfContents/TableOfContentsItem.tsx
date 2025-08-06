import React from 'react';
import type { TableOfContentsItemProps, TOCItem, TOCAnchor } from '../../types';
import { ExpandIcon } from '../../assets/ExpandIcon';
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

    // Helper function to check if this item or any of its descendants is active
    const isInActiveTree = (currentItem: TOCItem): boolean => {
        if (currentItem.isActive) return true;
        return currentItem.children.some(child => isInActiveTree(child));
    };

    const shouldHighlightTree = !item.isActive && isInActiveTree(item); // Only highlight if NOT active

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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                handleItemClick(e as any);
                break;
            case 'ArrowRight':
                if (hasChildren && !item.isExpanded) {
                    e.preventDefault();
                    onToggleExpand?.(item.id);
                }
                break;
            case 'ArrowLeft':
                if (hasChildren && item.isExpanded) {
                    e.preventDefault();
                    onToggleExpand?.(item.id);
                }
                break;
        }
    };

    const getItemClasses = () => {
        const classes = [styles.item];

        if (item.isActive) classes.push(styles.active);
        if (hasChildren) classes.push(styles.hasChildren);
        if (item.isExpanded) classes.push(styles.expanded);
        if (isSearching) classes.push(styles.searching);
        if (shouldHighlightTree && !item.isActive) classes.push(styles.treeHighlight);

        return classes.join(' ');
    };

    const getIndentLevel = () => {
        // For search results, reduce indentation to improve readability
        if (isSearching) {
            return Math.min(item.level, 2);
        }
        return item.level;
    };

    const getChildrenListClasses = () => {
        const classes = [styles.childrenList];
        return classes.join(' ');
    };

    return (
        <li className={getItemClasses()} data-level={getIndentLevel()}>
            <div
                className={styles.itemContent}
                style={{
                    '--indent-level': getIndentLevel()
                } as React.CSSProperties}
            >
                {/* Main item button */}
                <button
                    className={styles.itemButton}
                    onClick={handleItemClick}
                    onKeyDown={handleKeyDown}
                    title={item.title}
                    aria-expanded={hasChildren ? shouldShowExpanded : undefined}
                    aria-label={hasChildren
                        ? `${item.title} - ${shouldShowExpanded ? 'expanded' : 'collapsed'}`
                        : item.title
                    }
                >
                    {/* Expand/Collapse Icon - shows proper triangle based on state */}
                    {hasChildren && (
                        <ExpandIcon
                            isExpanded={shouldShowExpanded}
                            className={styles.expandIcon}
                        />
                    )}

                    {/* Item Title */}
                    <span className={styles.itemTitle}>
                        {item.title}
                    </span>
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
                                title={`Navigate to ${anchor.title}`}
                                style={{
                                    '--indent-level': getIndentLevel() + 1
                                } as React.CSSProperties}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleAnchorClick(anchor)(e as any);
                                    }
                                }}
                            >
                                <span className={styles.anchorTitle}>
                                    {anchor.title}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Children - recursive rendering with proper tree highlighting */}
            {hasChildren && shouldShowExpanded && (
                <ul className={getChildrenListClasses()}>
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