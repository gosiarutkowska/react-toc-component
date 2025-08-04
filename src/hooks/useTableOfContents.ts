import { useState, useEffect, useMemo } from 'react';
import type { TOCApi } from '../types';
import { parseTableOfContentsData, findItemById, filterTreeByQuery } from '../utils';
import { useTOCState } from './useTOCState';
import type { UseTableOfContentsOptions, UseTableOfContentsReturn } from './useTableOfContents.types';

export const useTableOfContents = (
    options: UseTableOfContentsOptions = {}
): UseTableOfContentsReturn => {
    const { data, initialActiveId, autoExpandActive = true, enableSearch = true } = options;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { state, updateState, actions } = useTOCState([], initialActiveId);

    // Initialize data
    useEffect(() => {
        if (data) {
            setLoading(true);
            setError(null);

            try {
                const parsedItems = parseTableOfContentsData(data);

                updateState(prev => ({
                    ...prev,
                    items: parsedItems,
                }));

                // Set initial active item if provided
                if (initialActiveId) {
                    actions.setActiveItem(initialActiveId, autoExpandActive);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to parse TOC data');
            } finally {
                setLoading(false);
            }
        }
    }, [data, initialActiveId, autoExpandActive, updateState, actions]);

    // Search functionality
    const filteredItems = useMemo(() => {
        if (!enableSearch || !state.searchQuery.trim()) {
            return null;
        }
        return filterTreeByQuery(state.items, state.searchQuery);
    }, [state.items, state.searchQuery, enableSearch]);

    // Update filtered items
    useEffect(() => {
        updateState(prev => ({
            ...prev,
            filteredItems,
        }));
    }, [filteredItems, updateState]);

    // API object
    const api: TOCApi = useMemo(() => ({
        setActiveById: actions.setActiveItem,
        expandAll: actions.expandAll,
        collapseAll: actions.collapseAll,
        filterByString: actions.setSearchQuery,
        clearFilter: actions.clearSearch,
        getActiveItem: () => {
            if (!state.activeItemId) return null;
            return findItemById(state.items, state.activeItemId);
        },
    }), [actions, state.activeItemId, state.items]);

    return {
        state,
        actions,
        api,
        loading,
        error,
    };
};