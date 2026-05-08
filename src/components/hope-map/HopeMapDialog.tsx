/**
 * HopeMapDialog — Fullscreen dialog wrapper for the Hope Map.
 * Uses Headless UI Dialog for modal overlay with focus trapping.
 */

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import type { HopeMapPerson } from '../../data/hopeMap';
import HopeMap from './HopeMap';

interface HopeMapDialogProps {
    open: boolean;
    onClose: () => void;
    entries: HopeMapPerson[];
}

export default function HopeMapDialog({ open, onClose, entries }: HopeMapDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-6xl transform rounded-2xl bg-violet-950 p-6 shadow-2xl ring-1 ring-violet-700/50 transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                    >
                        {/* Header */}
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-violet-100">Hope Map</h2>
                                <p className="text-sm text-violet-400">Social entrepreneurs making a difference across the UK</p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg p-2 text-violet-400 hover:bg-violet-800/50 hover:text-violet-200 transition-colors"
                                aria-label="Close Hope Map"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 384 512" aria-hidden="true">
                                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                </svg>
                            </button>
                        </div>

                        {/* Full-size Hope Map */}
                        <HopeMap entries={entries} compact={false} />
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
