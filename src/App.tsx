import { useState, useEffect } from 'react';
import { TableOfContents } from './components/TableOfContents';
import type { TOCItem, TOCAnchor } from './types';

function App() {
    const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null); // null = system preference

    // Initialize theme based on system preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Check if user has a saved preference
        const savedTheme = localStorage.getItem('theme-preference');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
        } else if (savedTheme === 'light') {
            setIsDarkMode(false);
        } else {
            // Use system preference
            setIsDarkMode(null);
        }

        const handleChange = (): void => {
            // Only update if user hasn't manually set a preference
            const currentSaved = localStorage.getItem('theme-preference');
            if (!currentSaved) {
                // Don't auto-update, leave as null for system preference
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Apply theme to document
    useEffect(() => {
        const htmlElement = document.documentElement;

        if (isDarkMode === true) {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme-preference', 'dark');
        } else if (isDarkMode === false) {
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme-preference', 'light');
        } else {
            // Remove attribute to use system preference
            htmlElement.removeAttribute('data-theme');
            localStorage.removeItem('theme-preference');
        }
    }, [isDarkMode]);

    const handleItemClick = (item: TOCItem): void => {
        console.log('Clicked item:', item);
        // In real app, navigate to the page
        if (item.url) {
            console.log('Navigate to:', item.url);
        }
    };

    const handleAnchorClick = (anchor: TOCAnchor): void => {
        console.log('Clicked anchor:', anchor);
        // In real app, navigate to the anchor
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
                    <TableOfContents
                        // Remove the data prop to use async loading
                        onItemClick={handleItemClick}
                        onAnchorClick={handleAnchorClick}
                        initialActiveId="Getting_started"
                        searchable={true}
                        className="main-toc"
                    />
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
                            <li>✅ Expand/collapse functionality</li>
                            <li>✅ Active item highlighting</li>
                            <li>✅ Search functionality</li>
                            <li>✅ Anchor navigation</li>
                            <li>✅ Keyboard accessibility</li>
                            <li>✅ Smooth animations</li>
                            <li>✅ Light/Dark mode support</li>
                            <li>✅ Asynchronous data loading</li>
                            <li>✅ Level-based backgrounds</li>
                        </ul>

                        <div className="demo-note">
                            <p><strong>Demo Note:</strong> This is a demonstration of the Table of Contents component.
                                Data is now loaded asynchronously from a mock API endpoint. The component shows proper loading states and error handling.</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;