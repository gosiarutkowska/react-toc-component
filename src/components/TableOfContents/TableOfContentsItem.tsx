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

    const isInActiveTree = (currentItem: TOCItem): boolean => {
        if (currentItem.isActive) return true;
        return currentItem.children.some(child => isInActiveTree(child));
    };

    const shouldHighlightTree = !item.isActive && isInActiveTree(item); // Only highlight if NOT active

    const handleItemClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();

        if (hasChildren && onToggleExpand) {
            onToggleExpand(item.id);
        }

        if (onItemClick) {
            onItemClick(item);
        }
    };

    const handleAnchorClick = (anchor: TOCAnchor) => (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        if (onAnchorClick) {
            onAnchorClick(anchor);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                handleItemClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
                break;
            case 'ArrowRight':
                if (hasChildren && !item.isExpanded && onToggleExpand) {
                    e.preventDefault();
                    onToggleExpand(item.id);
                }
                break;
            case 'ArrowLeft':
                if (hasChildren && item.isExpanded && onToggleExpand) {
                    e.preventDefault();
                    onToggleExpand(item.id);
                }
                break;
        }
    };

    const getItemClasses = (): string => {
        const classes = [styles.item];

        if (item.isActive) classes.push(styles.active);
        if (hasChildren) classes.push(styles.hasChildren);
        if (item.isExpanded) classes.push(styles.expanded);
        if (isSearching) classes.push(styles.searching);
        if (shouldHighlightTree && !item.isActive) classes.push(styles.treeHighlight);

        return classes.join(' ');
    };

    const getIndentLevel = (): number => {
        if (isSearching) {
            return Math.min(item.level, 2);
        }
        return item.level;
    };

    const getChildrenListClasses = (): string => {
        const classes = [styles.childrenList];
        return classes.join(' ');
    };

    const handleAnchorKeyDown = (anchor: TOCAnchor) => (e: React.KeyboardEvent<HTMLButtonElement>): void => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAnchorClick(anchor)(e as unknown as React.MouseEvent<HTMLButtonElement>);
        }
    };

    return (
        <li className={getItemClasses()} data-level={getIndentLevel()}>
            <div
                className={styles.itemContent}
                style={{
                    '--indent-level': getIndentLevel()
                } as React.CSSProperties}
            >
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
                    {hasChildren && (
                        <ExpandIcon
                            isExpanded={shouldShowExpanded}
                            className={styles.expandIcon}
                        />
                    )}

                    <span className={styles.itemTitle}>
                        {item.title}
                    </span>
                </button>
            </div>

            {/* Anchors - only show when item is active */}
            {showAnchors && (
                <ul className={styles.anchorsList}>
                    {item.anchors.map((anchor) => (
                        <li key={anchor.id} className={styles.anchorItem} data-level={getIndentLevel()}>
                            <button
                                className={styles.anchorButton}
                                onClick={handleAnchorClick(anchor)}
                                title={`Navigate to ${anchor.title}`}
                                style={{
                                    '--indent-level': getIndentLevel() + 1
                                } as React.CSSProperties}
                                onKeyDown={handleAnchorKeyDown(anchor)}
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