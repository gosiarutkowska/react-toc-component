import type { TOCItem } from '../types';

/**
 * Finds an item in the TOC tree by its ID
 */
export const findItemById = (items: TOCItem[], targetId: string): TOCItem | null => {
    for (const item of items) {
        if (item.id === targetId) {
            return item;
        }

        const foundInChildren = findItemById(item.children, targetId);
        if (foundInChildren) {
            return foundInChildren;
        }
    }

    return null;
};

/**
 * Gets all parent IDs for a given item ID
 */
export const getParentIds = (items: TOCItem[], targetId: string, parents: string[] = []): string[] => {
    for (const item of items) {
        if (item.id === targetId) {
            return parents;
        }

        const foundInChildren = getParentIds(item.children, targetId, [...parents, item.id]);
        if (foundInChildren.length > parents.length) {
            return foundInChildren;
        }
    }

    return [];
};

/**
 * Flattens the tree structure into a single array
 */
export const flattenTree = (items: TOCItem[]): TOCItem[] => {
    const flattened: TOCItem[] = [];

    const flatten = (items: TOCItem[]) => {
        items.forEach(item => {
            flattened.push(item);
            if (item.children.length > 0) {
                flatten(item.children);
            }
        });
    };

    flatten(items);
    return flattened;
};

/**
 * Filters tree items by search query
 */
export const filterTreeByQuery = (items: TOCItem[], query: string): TOCItem[] => {
    if (!query.trim()) {
        return items;
    }

    const searchTerm = query.toLowerCase();

    const filterItems = (items: TOCItem[]): TOCItem[] => {
        const filtered: TOCItem[] = [];

        items.forEach(item => {
            const matchesTitle = item.title.toLowerCase().includes(searchTerm);
            const matchesAnchors = item.anchors.some(anchor =>
                anchor.title.toLowerCase().includes(searchTerm)
            );

            // Recursively filter children
            const filteredChildren = filterItems(item.children);

            // Include item if it matches or has matching children
            if (matchesTitle || matchesAnchors || filteredChildren.length > 0) {
                filtered.push({
                    ...item,
                    children: filteredChildren,
                    isExpanded: filteredChildren.length > 0, // Auto-expand if has matching children
                });
            }
        });

        return filtered;
    };

    return filterItems(items);
};

/**
 * Updates the expanded state of an item in the tree
 */
export const updateItemExpanded = (
    items: TOCItem[],
    targetId: string,
    isExpanded: boolean
): TOCItem[] => {
    return items.map(item => {
        if (item.id === targetId) {
            return { ...item, isExpanded };
        }

        return {
            ...item,
            children: updateItemExpanded(item.children, targetId, isExpanded),
        };
    });
};

/**
 * Updates the active state of items in the tree
 */
export const updateActiveItem = (items: TOCItem[], activeId: string | null): TOCItem[] => {
    return items.map(item => ({
        ...item,
        isActive: item.id === activeId,
        children: updateActiveItem(item.children, activeId),
    }));
};

/**
 * Expands all items in the tree
 */
export const expandAllItems = (items: TOCItem[]): TOCItem[] => {
    return items.map(item => ({
        ...item,
        isExpanded: true,
        children: expandAllItems(item.children),
    }));
};

/**
 * Collapses all items in the tree
 */
export const collapseAllItems = (items: TOCItem[]): TOCItem[] => {
    return items.map(item => ({
        ...item,
        isExpanded: false,
        children: collapseAllItems(item.children),
    }));
};