import { useState, useCallback } from 'react';
import type { TOCState, TOCItem } from '../types';
import {
    updateItemExpanded,
    updateActiveItem,
    expandAllItems,
    collapseAllItems,
    getParentIds,
} from '../utils';

export const useTOCState = (initialItems: TOCItem[] = [], initialActiveId?: string) => {
    const [state, setState] = useState<TOCState>({
        items: initialItems,
        activeItemId: initialActiveId || null,
        expandedItems: new Set<string>(),
        searchQuery: '',
        filteredItems: null,
    });

    const updateState = useCallback((updater: (prev: TOCState) => TOCState) => {
        setState(updater);
    }, []);

    const toggleExpanded = useCallback((itemId: string) => {
        setState(prev => {
            const isCurrentlyExpanded = prev.expandedItems.has(itemId);
            const newExpandedItems = new Set(prev.expandedItems);

            if (isCurrentlyExpanded) {
                newExpandedItems.delete(itemId);
            } else {
                newExpandedItems.add(itemId);
            }

            const updatedItems = updateItemExpanded(prev.items, itemId, !isCurrentlyExpanded);

            return {
                ...prev,
                items: updatedItems,
                expandedItems: newExpandedItems,
            };
        });
    }, []);

    const setActiveItem = useCallback((itemId: string | null, autoExpand = true) => {
        setState(prev => {
            const updatedItems = updateActiveItem(prev.items, itemId);

            let newExpandedItems = prev.expandedItems;
            if (itemId && autoExpand) {
                const parentIds = getParentIds(updatedItems, itemId);
                newExpandedItems = new Set([...prev.expandedItems, ...parentIds]);

                let itemsWithExpanded = updatedItems;
                parentIds.forEach(parentId => {
                    itemsWithExpanded = updateItemExpanded(itemsWithExpanded, parentId, true);
                });

                return {
                    ...prev,
                    items: itemsWithExpanded,
                    activeItemId: itemId,
                    expandedItems: newExpandedItems,
                };
            }

            return {
                ...prev,
                items: updatedItems,
                activeItemId: itemId,
            };
        });
    }, []);

    const expandAll = useCallback(() => {
        setState(prev => {
            const expandedItems = expandAllItems(prev.items);
            const allIds = new Set<string>();

            const collectIds = (items: TOCItem[]) => {
                items.forEach(item => {
                    allIds.add(item.id);
                    collectIds(item.children);
                });
            };

            collectIds(expandedItems);

            return {
                ...prev,
                items: expandedItems,
                expandedItems: allIds,
            };
        });
    }, []);

    const collapseAll = useCallback(() => {
        setState(prev => ({
            ...prev,
            items: collapseAllItems(prev.items),
            expandedItems: new Set(),
        }));
    }, []);

    const setSearchQuery = useCallback((query: string) => {
        setState(prev => ({
            ...prev,
            searchQuery: query,
        }));
    }, []);

    const clearSearch = useCallback(() => {
        setState(prev => ({
            ...prev,
            searchQuery: '',
            filteredItems: null,
        }));
    }, []);

    return {
        state,
        updateState,
        actions: {
            toggleExpanded,
            setActiveItem,
            setSearchQuery,
            expandAll,
            collapseAll,
            clearSearch,
        },
    };
};