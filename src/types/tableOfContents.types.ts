export type JetBrainsPage = {
    id: string;
    title: string;
    url?: string;
    parentId?: string;
    level: number;
    tabIndex?: number;
    doNotShowWarningLink?: boolean;
    pages?: string[];
    anchors?: string[];
};

export type JetBrainsAnchor = {
    id: string;
    title: string;
    url: string;
    anchor: string;
    level: number;
    disqus_id?: string;
};

export type JetBrainsEntities = {
    pages: Record<string, JetBrainsPage>;
    anchors?: Record<string, JetBrainsAnchor>;
};

export type JetBrainsHelpTOC = {
    entities: JetBrainsEntities;
    topLevelIds: string[];
};

export type TOCItem = {
    id: string;
    title: string;
    url?: string;
    level: number;
    children: TOCItem[];
    anchors: TOCAnchor[];
    isExpanded: boolean;
    isActive: boolean;
};

export type TOCAnchor = {
    id: string;
    title: string;
    url: string;
    anchor: string;
    level: number;
};

export type TOCState = {
    items: TOCItem[];
    activeItemId: string | null;
    expandedItems: Set<string>;
    searchQuery: string;
    filteredItems: TOCItem[] | null;
};

export type TableOfContentsProps = {
    data?: JetBrainsHelpTOC;
    onItemClick?: (item: TOCItem) => void;
    onAnchorClick?: (anchor: TOCAnchor) => void;
    initialActiveId?: string;
    searchable?: boolean;
    className?: string;
    apiEndpoint?: string;
};

export type TableOfContentsItemProps = {
    item: TOCItem;
    onItemClick?: (item: TOCItem) => void;
    onAnchorClick?: (anchor: TOCAnchor) => void;
    onToggleExpand?: (itemId: string) => void;
    isSearching?: boolean;
};

export type TOCApi = {
    setActiveById: (id: string) => void;
    expandAll: () => void;
    collapseAll: () => void;
    filterByString: (query: string) => void;
    clearFilter: () => void;
    getActiveItem: () => TOCItem | null;
    reload: () => Promise<void>;
};