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
    const [initialized, setInitialized] = useState(false);

    const { state, updateState, actions } = useTOCState();

    // Initialize data ONCE
    useEffect(() => {
        if (data && !initialized) {
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
                    setTimeout(() => {
                        actions.setActiveItem(initialActiveId, autoExpandActive);
                    }, 0);
                }

                setInitialized(true);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to parse TOC data');
            } finally {
                setLoading(false);
            }
        }
    }, [data, initialized]); // Minimal dependencies

    // Search functionality
    const filteredItems = useMemo(() => {
        if (!enableSearch || !state.searchQuery.trim()) {
            return null;
        }
        return filterTreeByQuery(state.items, state.searchQuery);
    }, [state.items, state.searchQuery, enableSearch]);

    // Update filtered items
    useEffect(() => {
        if (initialized) {
            updateState(prev => ({
                ...prev,
                filteredItems,
            }));
        }
    }, [filteredItems, initialized]);

    // API object
    const api: TOCApi = useMemo(() => ({
        setActiveById: (id: string) => actions.setActiveItem(id),
        expandAll: actions.expandAll,
        collapseAll: actions.collapseAll,
        filterByString: actions.setSearchQuery,
        clearFilter: actions.clearSearch,
        getActiveItem: () => {
            if (!state.activeItemId) return null;
            return findItemById(state.items, state.activeItemId);
        },
    }), [state.activeItemId, state.items]);

    return {
        state,
        actions,
        api,
        loading,
        error,
    };
};

// Add default export as well
export default useTableOfContents;