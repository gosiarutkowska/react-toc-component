import React from 'react';
import { TableOfContents } from './components/TableOfContents';
import type { JetBrainsHelpTOC, TOCItem, TOCAnchor } from './types';
import jetbrainsData from './data/jetbrainsHelpTOC.json';
import './App.css';

function App() {
    const handleItemClick = (item: TOCItem) => {
        console.log('Clicked item:', item);
        // In real app, navigate to the page
        if (item.url) {
            console.log('Navigate to:', item.url);
        }
    };

    const handleAnchorClick = (anchor: TOCAnchor) => {
        console.log('Clicked anchor:', anchor);
        // In real app, navigate to the anchor
        const fullUrl = `${anchor.url}${anchor.anchor}`;
        console.log('Navigate to:', fullUrl);
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>IntelliJ IDEA Help</h1>
                <p>Interactive Table of Contents</p>
            </header>

            <main className="app-main">
                <aside className="toc-sidebar">
                    <TableOfContents
                        data={jetbrainsData as JetBrainsHelpTOC}
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
                        </ul>

                        <div className="demo-note">
                            <p><strong>Demo Note:</strong> This is a demonstration of the Table of Contents component.
                                In a real application, clicking on items would navigate to actual documentation pages.</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;