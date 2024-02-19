import { Button } from '../catalyst/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '../catalyst/dialog'
import { Field, Label } from '../catalyst/fieldset'
import { Input } from '../catalyst/input'
import { useState } from 'react'

export default function Example() {
    let [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button type="button" onClick={() => setIsOpen(true)}>
                Watch video
            </Button>
            <Dialog size="5xl" open={isOpen} onClose={setIsOpen}>
                <DialogBody>
                    <iframe class="w-full" src="https://www.youtube-nocookie.com/embed/OiTiKOy59o4?si=KD3ZOPTqW24ePHSC" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </DialogBody>
                <DialogActions>
                    <Button plain onClick={() => setIsOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}