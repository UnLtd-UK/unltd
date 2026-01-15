/**
 * SpaceResources Component
 * Client-side wrapper that handles view mode switching between Type and Topic views
 */

import { useState, useEffect } from "react";
import ViewToggle, { type ViewMode } from "./ViewToggle";

interface SpaceResourcesProps {
    spaceSlug: string;
}

export default function SpaceResources({
    spaceSlug,
}: SpaceResourcesProps) {
    const [viewMode, setViewMode] = useState<ViewMode>("type");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load persisted view mode
        const stored = localStorage.getItem(`space-view-mode-${spaceSlug}`);
        if (stored === "type" || stored === "topic") {
            setViewMode(stored);
        }
    }, [spaceSlug]);

    const handleViewChange = (mode: ViewMode) => {
        setViewMode(mode);
        localStorage.setItem(`space-view-mode-${spaceSlug}`, mode);

        // Toggle visibility of view sections
        const typeView = document.getElementById("view-by-type");
        const topicView = document.getElementById("view-by-topic");

        if (typeView && topicView) {
            if (mode === "type") {
                typeView.classList.remove("hidden");
                topicView.classList.add("hidden");
            } else {
                typeView.classList.add("hidden");
                topicView.classList.remove("hidden");
            }
        }

        // Also update navigation
        const typeNav = document.getElementById("nav-by-type");
        const topicNav = document.getElementById("nav-by-topic");

        if (typeNav && topicNav) {
            if (mode === "type") {
                typeNav.classList.remove("hidden");
                topicNav.classList.add("hidden");
            } else {
                typeNav.classList.add("hidden");
                topicNav.classList.remove("hidden");
            }
        }

        // Update mobile navigation
        const typeMobileNav = document.getElementById("mobile-nav-by-type");
        const topicMobileNav = document.getElementById("mobile-nav-by-topic");

        if (typeMobileNav && topicMobileNav) {
            if (mode === "type") {
                typeMobileNav.classList.remove("hidden");
                topicMobileNav.classList.add("hidden");
            } else {
                typeMobileNav.classList.add("hidden");
                topicMobileNav.classList.remove("hidden");
            }
        }
    };

    // Initialize view on mount
    useEffect(() => {
        if (mounted) {
            handleViewChange(viewMode);
        }
    }, [mounted, viewMode]);

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-violet-400">View:</span>
            <ViewToggle
                defaultView={viewMode}
                onChange={handleViewChange}
                storageKey={`space-view-mode-${spaceSlug}`}
            />
        </div>
    );
}
