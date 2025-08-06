import { useState, useEffect } from 'react';
import { TableOfContents } from './components/TableOfContents';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import type { TOCItem, TOCAnchor } from './types';

function App() {
    const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const savedTheme = localStorage.getItem('theme-preference');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
        } else if (savedTheme === 'light') {
            setIsDarkMode(false);
        } else {
            setIsDarkMode(null);
        }

        const handleChange = (): void => {
            const currentSaved = localStorage.getItem('theme-preference');
            if (!currentSaved) {
                // Don't auto-update, leaved as null for system preference
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Apply theme
    useEffect(() => {
        const htmlElement = document.documentElement;

        if (isDarkMode === true) {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme-preference', 'dark');
        } else if (isDarkMode === false) {
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme-preference', 'light');
        } else {
            htmlElement.removeAttribute('data-theme');
            localStorage.removeItem('theme-preference');
        }
    }, [isDarkMode]);

    const handleItemClick = (item: TOCItem): void => {
        console.log('Clicked item:', item);
        if (item.url) {
            console.log('Navigate to:', item.url);
        }
    };

    const handleAnchorClick = (anchor: TOCAnchor): void => {
        console.log('Clicked anchor:', anchor);
        const fullUrl = `${anchor.url}${anchor.anchor}`;
        console.log('Navigate to:', fullUrl);
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-content">
                    <div>
                        <h1>IntelliJ IDEA Help</h1>
                        <p>Interactive Table of Contents</p>
                    </div>
                    <div className="theme-controls">
                        <button
                            onClick={() => setIsDarkMode(null)}
                            className={`theme-toggle ${isDarkMode === null ? 'active' : ''}`}
                            aria-label="Use system theme preference"
                        >
                            🔄 Auto
                        </button>
                        <button
                            onClick={() => setIsDarkMode(false)}
                            className={`theme-toggle ${isDarkMode === false ? 'active' : ''}`}
                            aria-label="Use light theme"
                        >
                            ☀️ Light
                        </button>
                        <button
                            onClick={() => setIsDarkMode(true)}
                            className={`theme-toggle ${isDarkMode === true ? 'active' : ''}`}
                            aria-label="Use dark theme"
                        >
                            🌙 Dark
                        </button>
                    </div>
                </div>
            </header>

            <main className="app-main">
                <aside className="toc-sidebar">
                    <ErrorBoundary onError={(error, errorInfo) => {
                        console.error('TOC Error Boundary triggered:', error, errorInfo);
                    }}>
                        <TableOfContents
                            onItemClick={handleItemClick}
                            onAnchorClick={handleAnchorClick}
                            initialActiveId="Getting_started"
                            searchable={true}
                            className="main-toc"
                        />
                    </ErrorBoundary>
                </aside>

                <section className="content-area">
                    <div className="content-placeholder">
                        <h2>Welcome to IntelliJ IDEA Documentation</h2>
                        <p>
                            Click on any item in the table of contents to navigate through the help topics.
                        </p>
                        <p>
                            <strong>Features demonstrated:</strong>
                        </p>
                        <ul>
                            <li>✅ Hierarchical navigation tree</li>
                            <li>✅ Expand/collapse functionality with smooth animations</li>
                            <li>✅ Active item highlighting</li>
                            <li>✅ Smart search functionality with debouncing</li>
                            <li>✅ Anchor navigation</li>
                            <li>✅ Full keyboard accessibility</li>
                            <li>✅ Smooth expand/collapse animations</li>
                            <li>✅ Light/Dark mode support (Auto/Manual)</li>
                            <li>✅ Asynchronous data loading with loading states</li>
                            <li>✅ Level-based backgrounds</li>
                            <li>✅ Error handling with Error Boundaries</li>
                            <li>✅ Professional UI with loading indicators</li>
                            <li>✅ Responsive design</li>
                            <li>✅ Tree highlighting for active paths</li>
                        </ul>

                        <div className="demo-note">
                            <p><strong>Demo Note:</strong> This is a demonstration of the Table of Contents component.
                                Data is loaded asynchronously with debounced search functionality. The component shows
                                proper loading states, error handling with recovery options, and smooth animations throughout.</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;