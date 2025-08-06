import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useTableOfContents } from '../useTableOfContents';
import type { JetBrainsHelpTOC } from '../../types';

// Mock data
const mockTOCData: JetBrainsHelpTOC = {
    entities: {
        pages: {
            'getting-started': {
                id: 'getting-started',
                title: 'Getting started',
                url: '/getting-started',
                level: 0,
                pages: ['ide-configuration'],
                anchors: []
            },
            'ide-configuration': {
                id: 'ide-configuration',
                title: 'IDE configuration',
                url: '/ide-configuration',
                parentId: 'getting-started',
                level: 1,
                pages: [],
                anchors: []
            }
        },
        anchors: {}
    },
    topLevelIds: ['getting-started']
};

describe('useTableOfContents', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(global.fetch).mockClear();
    });

    it('initializes with loading state when no data provided', () => {
        // Mock fetch to never resolve
        vi.mocked(global.fetch).mockImplementation(() => new Promise(() => {}));

        const { result } = renderHook(() => useTableOfContents());

        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBe(null);
        expect(result.current.state.items).toEqual([]);
    });

    it('parses provided data correctly', async () => {
        const { result } = renderHook(() => useTableOfContents({
            data: mockTOCData
        }));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.state.items).toHaveLength(1);
        }, { timeout: 10000 });

        expect(result.current.state.items[0]).toEqual(
            expect.objectContaining({
                id: 'getting-started',
                title: 'Getting started',
                level: 0,
                isExpanded: false,
                isActive: false
            })
        );
    });

    it('sets initial active item', async () => {
        const { result } = renderHook(() => useTableOfContents({
            data: mockTOCData,
            initialActiveId: 'getting-started'
        }));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        }, { timeout: 10000 });

        await waitFor(() => {
            const activeItem = result.current.state.items.find(item => item.isActive);
            expect(activeItem?.id).toBe('getting-started');
        }, { timeout: 10000 });
    });

    it('toggles item expansion', async () => {
        const { result } = renderHook(() => useTableOfContents({
            data: mockTOCData
        }));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        }, { timeout: 10000 });

        act(() => {
            result.current.actions.toggleExpanded('getting-started');
        });

        await waitFor(() => {
            const item = result.current.state.items[0];
            expect(item.isExpanded).toBe(true);
        });
    });

    it('sets active item via actions', async () => {
        const { result } = renderHook(() => useTableOfContents({
            data: mockTOCData
        }));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        }, { timeout: 10000 });

        act(() => {
            result.current.actions.setActiveItem('getting-started');
        });

        await waitFor(() => {
            const activeItem = result.current.state.items.find(item => item.isActive);
            expect(activeItem?.id).toBe('getting-started');
        });
    });

    it('expands all items', async () => {
        const { result } = renderHook(() => useTableOfContents({
            data: mockTOCData
        }));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        }, { timeout: 10000 });

        act(() => {
            result.current.actions.expandAll();
        });

        await waitFor(() => {
            const allItems = result.current.state.items;
            const expandedItems = allItems.filter(item => item.isExpanded);
            expect(expandedItems).toHaveLength(1);
        });
    });

    it('collapses all items', async () => {
        const { result } = renderHook(() => useTableOfContents({
            data: mockTOCData
        }));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        }, { timeout: 10000 });

        // First expand
        act(() => {
            result.current.actions.expandAll();
        });

        // Then collapse
        act(() => {
            result.current.actions.collapseAll();
        });

        await waitFor(() => {
            const allItems = result.current.state.items;
            const expandedItems = allItems.filter(item => item.isExpanded);
            expect(expandedItems).toHaveLength(0);
        });
    });

    it('handles search functionality', async () => {
        const { result } = renderHook(() => useTableOfContents({
            data: mockTOCData,
            enableSearch: true
        }));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        }, { timeout: 10000 });

        act(() => {
            result.current.actions.setSearchQuery('configuration');
        });

        await waitFor(() => {
            expect(result.current.state.searchQuery).toBe('configuration');
            expect(result.current.state.filteredItems).toBeDefined();
        });
    });

    it('provides API methods', async () => {
        const { result } = renderHook(() => useTableOfContents({
            data: mockTOCData
        }));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        }, { timeout: 10000 });

        // Test API methods exist
        expect(result.current.api.setActiveById).toBeDefined();
        expect(result.current.api.expandAll).toBeDefined();
        expect(result.current.api.collapseAll).toBeDefined();
        expect(result.current.api.filterByString).toBeDefined();
        expect(result.current.api.clearFilter).toBeDefined();
        expect(result.current.api.getActiveItem).toBeDefined();
        expect(result.current.api.reload).toBeDefined();

        // Test getActiveItem
        expect(result.current.api.getActiveItem()).toBe(null);

        act(() => {
            result.current.api.setActiveById('getting-started');
        });

        await waitFor(() => {
            const activeItem = result.current.api.getActiveItem();
            expect(activeItem?.id).toBe('getting-started');
        });
    });

    it('handles fetch success', async () => {
        // Mock successful fetch
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockTOCData)
        } as Response);

        const { result } = renderHook(() => useTableOfContents());

        // Should start loading
        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe(null);
            expect(result.current.state.items).toHaveLength(1);
        }, { timeout: 10000 });

        expect(global.fetch).toHaveBeenCalledWith('/api/jetbrainsHelpTOC.json');
    });
});