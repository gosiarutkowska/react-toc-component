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

    // Load data asynchronously - either from API or provided data
    useEffect(() => {
        if (initialized) return;

        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                let tocData;

                if (data) {
                    // Use provided data
                    tocData = data;
                } else {
                    // Fetch from public API endpoint with fallback
                    try {
                        // Try the public API first
                        const response = await fetch('/api/jetbrainsHelpTOC.json');

                        if (!response.ok) {
                            throw new Error(`API fetch failed: ${response.status}`);
                        }

                        tocData = await response.json();
                        console.log('✅ Loaded data from public API');

                    } catch (apiError) {
                        console.warn('🔄 API failed, trying direct public file:', apiError);

                        // Fallback to direct public file access
                        const fallbackResponse = await fetch('/api/jetbrainsHelpTOC.json');

                        if (!fallbackResponse.ok) {
                            throw new Error(`Failed to load TOC data: ${fallbackResponse.status}`);
                        }

                        tocData = await fallbackResponse.json();
                        console.log('✅ Loaded data from public file');
                    }

                    // Simulate realistic loading delay
                    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 300));
                }

                // Validate data structure
                if (!tocData?.entities?.pages) {
                    throw new Error('Invalid TOC data structure - missing entities.pages');
                }

                // Parse the data
                const parsedItems = parseTableOfContentsData(tocData);
                console.log('✅ Parsed TOC items:', parsedItems.length);

                updateState(prev => ({
                    ...prev,
                    items: parsedItems,
                }));

                // Set initial active item if provided
                if (initialActiveId) {
                    setTimeout(() => {
                        actions.setActiveItem(initialActiveId, autoExpandActive);
                        console.log('✅ Set initial active item:', initialActiveId);
                    }, 0);
                }

                setInitialized(true);

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load Table of Contents data';
                setError(errorMessage);
                console.error('❌ Error loading TOC data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [data, initialActiveId, autoExpandActive, initialized, updateState, actions]);

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
    }, [filteredItems, initialized, updateState]);

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
        reload: async () => {
            setInitialized(false);
            setError(null);
        }
    }), [state.activeItemId, state.items, actions]);

    return {
        state,
        actions,
        api,
        loading,
        error,
        initialized,
    };
};

export default useTableOfContents;