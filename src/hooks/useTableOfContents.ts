import { useState, useEffect, useMemo } from 'react';
import type { TOCApi } from '../types';
import { parseTableOfContentsData, findItemById, filterTreeByQuery } from '../utils';
import { useTOCState } from './useTOCState';
import { useDebounced } from './useDebounced';
import type { UseTableOfContentsOptions, UseTableOfContentsReturn } from './useTableOfContents.types';

export const useTableOfContents = (
    options: UseTableOfContentsOptions = {}
): UseTableOfContentsReturn => {
    const {
        data,
        initialActiveId,
        autoExpandActive = true,
        enableSearch = true,
        searchDebounceMs = 400,
        minQueryLength = 1
    } = options;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const { state, updateState, actions } = useTOCState();

    const debouncedSearchQuery = useDebounced(state.searchQuery, searchDebounceMs);

    useEffect(() => {
        if (state.searchQuery !== debouncedSearchQuery) {
            setIsSearching(true);
        } else {
            setIsSearching(false);
        }
    }, [state.searchQuery, debouncedSearchQuery]);

    useEffect(() => {
        if (initialized) return;

        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                let tocData;

                if (data) {
                    tocData = data;
                } else {
                    try {
                        const response = await fetch('/api/jetbrainsHelpTOC.json');

                        if (!response.ok) {
                            throw new Error(`API fetch failed: ${response.status}`);
                        }

                        tocData = await response.json();
                        console.log('✅ Loaded data from public API');

                    } catch (apiError) {
                        console.warn('🔄 API failed, trying direct public file:', apiError);

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

                if (!tocData?.entities?.pages) {
                    throw new Error('Invalid TOC data structure - missing entities.pages');
                }

                const parsedItems = parseTableOfContentsData(tocData);
                console.log('✅ Parsed TOC items:', parsedItems.length);

                updateState(prev => ({
                    ...prev,
                    items: parsedItems,
                }));

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

    const filteredItems = useMemo(() => {
        if (!enableSearch) {
            return null;
        }

        if (!debouncedSearchQuery.trim() || debouncedSearchQuery.length < minQueryLength) {
            return null;
        }

        console.log('🔍 Filtering with debounced query:', debouncedSearchQuery);
        return filterTreeByQuery(state.items, debouncedSearchQuery);
    }, [state.items, debouncedSearchQuery, enableSearch, minQueryLength]);

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
        filterByString: (query: string) => {
            actions.setSearchQuery(query);
            console.log('🔍 Search query set:', query);
        },
        clearFilter: () => {
            actions.clearSearch();
            console.log('🧹 Search cleared');
        },
        getActiveItem: () => {
            if (!state.activeItemId) return null;
            return findItemById(state.items, state.activeItemId);
        },
        reload: async () => {
            setInitialized(false);
            setError(null);
            actions.clearSearch();
        }
    }), [state.activeItemId, state.items, actions]);

    return {
        state,
        actions,
        api,
        loading,
        error,
        initialized,
        isSearching,
    };
};

export default useTableOfContents;