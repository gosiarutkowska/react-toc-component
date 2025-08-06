import type { TOCState, TOCApi, JetBrainsHelpTOC } from '../types';

export type UseTableOfContentsOptions = {
    data?: JetBrainsHelpTOC;
    initialActiveId?: string;
    autoExpandActive?: boolean;
    enableSearch?: boolean;
    apiEndpoint?: string;
    searchDebounceMs?: number;
    minQueryLength?: number;
};

export type UseTableOfContentsActions = {
    toggleExpanded: (itemId: string) => void;
    setActiveItem: (itemId: string | null) => void;
    setSearchQuery: (query: string) => void;
    expandAll: () => void;
    collapseAll: () => void;
    clearSearch: () => void;
};

export type UseTableOfContentsReturn = {
    actions: UseTableOfContentsActions;
    api: TOCApi;
    error: string | null;
    initialized: boolean;
    isSearching: boolean;
    loading: boolean;
    state: TOCState;
};