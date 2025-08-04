import type { TOCState, TOCApi, JetBrainsHelpTOC } from '../types';

export type UseTableOfContentsOptions = {
    data?: JetBrainsHelpTOC;
    initialActiveId?: string;
    autoExpandActive?: boolean;
    enableSearch?: boolean;
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
    state: TOCState;
    actions: UseTableOfContentsActions;
    api: TOCApi;
    loading: boolean;
    error: string | null;
};