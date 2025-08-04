import type {
    JetBrainsHelpTOC,
    JetBrainsPage,
    JetBrainsAnchor,
    TOCItem,
    TOCAnchor,
} from '../types';

/**
 * Converts JetBrains anchor data to our TOCAnchor format
 */
export const parseAnchor = (anchor: JetBrainsAnchor): TOCAnchor => ({
    id: anchor.id,
    title: anchor.title,
    url: anchor.url,
    anchor: anchor.anchor,
    level: anchor.level,
});

/**
 * Recursively builds TOC tree structure from JetBrains data
 */
export const buildTOCTree = (
    pages: Record<string, JetBrainsPage>,
    anchors: Record<string, JetBrainsAnchor> = {},
    parentId?: string,
    level = 0
): TOCItem[] => {
    const items: TOCItem[] = [];

    // Find all pages with the given parentId (or no parentId for root level)
    Object.values(pages).forEach(page => {
        if (page.parentId === parentId && page.level === level) {
            // Parse anchors for this page
            const pageAnchors: TOCAnchor[] = page.anchors
                ? page.anchors
                    .map(anchorId => anchors[anchorId])
                    .filter(Boolean)
                    .map(parseAnchor)
                : [];

            // Recursively get children
            const children = buildTOCTree(pages, anchors, page.id, level + 1);

            const tocItem: TOCItem = {
                id: page.id,
                title: page.title,
                url: page.url,
                level: page.level,
                children,
                anchors: pageAnchors,
                isExpanded: false, // Initially collapsed
                isActive: false,
            };

            items.push(tocItem);
        }
    });

    // Sort by tabIndex if available, otherwise maintain original order
    return items.sort((a, b) => {
        const pageA = pages[a.id];
        const pageB = pages[b.id];

        if (pageA.tabIndex !== undefined && pageB.tabIndex !== undefined) {
            return pageA.tabIndex - pageB.tabIndex;
        }

        return 0;
    });
};

/**
 * Main parser function - converts JetBrains data to our TOC structure
 */
export const parseTableOfContentsData = (data: JetBrainsHelpTOC): TOCItem[] => {
    const { entities } = data;
    const { pages, anchors = {} } = entities;

    // Build tree starting from top-level items
    const topLevelItems: TOCItem[] = [];

    data.topLevelIds.forEach(topLevelId => {
        const page = pages[topLevelId];
        if (page) {
            // Parse anchors for this page
            const pageAnchors: TOCAnchor[] = page.anchors
                ? page.anchors
                    .map(anchorId => anchors[anchorId])
                    .filter(Boolean)
                    .map(parseAnchor)
                : [];

            // Get children recursively
            const children = buildTOCTree(pages, anchors, page.id, page.level + 1);

            const tocItem: TOCItem = {
                id: page.id,
                title: page.title,
                url: page.url,
                level: page.level,
                children,
                anchors: pageAnchors,
                isExpanded: false,
                isActive: false,
            };

            topLevelItems.push(tocItem);
        }
    });

    return topLevelItems;
};

/**
 * Loads and parses TOC data from JSON file
 */
export const loadTableOfContentsData = async (): Promise<TOCItem[]> => {
    try {
        // In real app, this would be an API call
        // For now, we'll import the JSON directly
        const response = await fetch('/src/data/jetbrainsHelpTOC.json');
        const data: JetBrainsHelpTOC = await response.json();

        return parseTableOfContentsData(data);
    } catch (error) {
        console.error('Failed to load table of contents data:', error);
        return [];
    }
};