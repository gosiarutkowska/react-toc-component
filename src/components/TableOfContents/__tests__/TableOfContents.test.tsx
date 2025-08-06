import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TableOfContents } from '../TableOfContents';
import type { JetBrainsHelpTOC } from '../../../types';

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
                anchors: ['config-anchor']
            }
        },
        anchors: {
            'config-anchor': {
                id: 'config-anchor',
                title: 'Configuration settings',
                url: '/ide-configuration',
                anchor: '#configuration',
                level: 2
            }
        }
    },
    topLevelIds: ['getting-started']
};

describe('TableOfContents', () => {
    const mockOnItemClick = vi.fn();
    const mockOnAnchorClick = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(global.fetch).mockClear();
    });

    it('renders loading state initially when no data provided', () => {
        // Mock fetch to never resolve to test loading state
        vi.mocked(global.fetch).mockImplementation(() => new Promise(() => {}));

        render(<TableOfContents />);

        expect(screen.getByText('Loading table of contents...')).toBeInTheDocument();
    });

    it('renders TOC items when data is provided', async () => {
        render(
            <TableOfContents
                data={mockTOCData}
                onItemClick={mockOnItemClick}
                onAnchorClick={mockOnAnchorClick}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Getting started')).toBeInTheDocument();
        }, { timeout: 10000 });
    });

    it('shows search input when searchable prop is true', async () => {
        render(
            <TableOfContents
                data={mockTOCData}
                searchable={true}
            />
        );

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Search documentation...')).toBeInTheDocument();
        });
    });

    it('expands items when clicked', async () => {
        render(
            <TableOfContents
                data={mockTOCData}
                onItemClick={mockOnItemClick}
            />
        );

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByText('Getting started')).toBeInTheDocument();
        }, { timeout: 10000 });

        const gettingStartedButton = screen.getByRole('button', { name: /Getting started/ });

        // Click to expand
        fireEvent.click(gettingStartedButton);

        await waitFor(() => {
            expect(screen.getByText('IDE configuration')).toBeInTheDocument();
        });

        expect(mockOnItemClick).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'getting-started',
                title: 'Getting started'
            })
        );
    });

    it('has proper accessibility attributes', async () => {
        render(
            <TableOfContents
                data={mockTOCData}
                searchable={true}
            />
        );

        await waitFor(() => {
            const navigation = screen.getByRole('navigation', { name: 'Table of contents' });
            expect(navigation).toBeInTheDocument();
        });
    });

    it('handles control buttons', async () => {
        render(
            <TableOfContents
                data={mockTOCData}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Getting started')).toBeInTheDocument();
        }, { timeout: 10000 });

        const expandAllButton = screen.getByRole('button', { name: 'Expand All' });
        const collapseAllButton = screen.getByRole('button', { name: 'Collapse All' });

        expect(expandAllButton).toBeInTheDocument();
        expect(collapseAllButton).toBeInTheDocument();

        // Test expand all
        fireEvent.click(expandAllButton);

        await waitFor(() => {
            expect(screen.getByText('IDE configuration')).toBeInTheDocument();
        });
    });
});