import { Popover } from '@headlessui/react';
import { useState } from 'react';

export default function FeedbackPopover() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setIsError(false);

        try {
            const response = await fetch('/forms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: event.target.type.value,
                email: event.target.email.value,
                message: event.target.message.value,
            }),
            });

            if (response.ok) {
            setIsSubmitted(true);
            } else {
            throw new Error('Network response was not ok');
            }
        } catch (error) {
            setIsError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Popover className="relative">
            <Popover.Button className="cursor-pointer inline-flex items-center gap-x-1.5 rounded-md border border-violet-600 bg-violet-900 px-2.5 py-1.5 text-xs font-semibold text-violet-50 shadow-xs hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600">
                Give Feedback
            </Popover.Button>
            <Popover.Panel className="absolute -left-44 mt-2 z-10 border-1 bg-violet-950 border-violet-900 max-w-lg p-4 rounded-2xl shadow-6xl w-72">
                {isSubmitted ? (
                    <p className="flex gap-1"><i className="fa-solid fa-circle-check text-green-500"></i><span className="text-xs text-violet-100">Feedback sent. You have received a confirmation email.</span></p>
                ) : (
                    <form onSubmit={handleSubmit} className="">
                        <div class="mb-4">
                            <fieldset>
                                <legend className="text-violet-100 text-xs mb-2">What's on your mind?</legend>

                                <div class="flex justify-stretch gap-1">
                                    <input type="radio" id="issue" name="type" disabled={isSubmitting} value="issue" className="hidden peer/option1" />
                                    <label for="issue" className="flex gap-1 items-center cursor-pointer bg-white px-4 py-2 text-xs font-sans border-2 border-gray-700 rounded-full 
            peer-checked/option1:bg-yellow-200 peer-checked/option1:border-yellow-600 
            peer-focus/option1:border-dashed peer-focus/option1:border-yellow-700 
            hover:bg-yellow-100 transition"><i className="fa-solid fa-triangle-exclamation text-yellow-800"></i><span className="text-yellow-900">Issue</span></label>

                                    <input type="radio" id="feature" name="type" disabled={isSubmitting} value="feature" className="hidden peer/option2" />
                                    <label for="feature" className="flex gap-1 items-center cursor-pointer bg-white px-4 py-2 text-xs font-sans border-2 border-gray-700 rounded-full 
            peer-checked/option2:bg-blue-200 peer-checked/option2:border-blue-600 
            peer-focus/option2:border-dashed peer-focus/option2:border-blue-700 
            hover:bg-blue-100 transition"><i class="fa-solid fa-lightbulb text-blue-800"></i><span className="text-blue-900">Feature</span></label>

                                    <input type="radio" id="other" name="type" disabled={isSubmitting} value="other" className="hidden peer/option3" />
                                    <label for="other" className="flex gap-1 items-center cursor-pointer bg-white px-4 py-2 text-xs font-sans border-2 border-gray-700 rounded-full 
            peer-checked/option3:bg-green-200 peer-checked/option3:border-green-600 
            peer-focus/option3:border-dashed peer-focus/option3:border-green-700 
            hover:bg-green-100 transition"><i class="fa-solid fa-ellipsis text-green-800"></i><span className="text-green-900">Other</span></label>
                                </div>
                            </fieldset>
                        </div>
                        <div class="mb-4">
                            <label class="block text-xs font-medium text-violet-100">Email</label>
                            <input disabled={isSubmitting} name="email" type="email" class="p-2 mt-1 block w-full rounded-md border-1 border-violet-400 text-violet-200 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
                        </div>
                        <div class="mb-4">
                            <label class="block text-xs font-medium text-violet-100">Message</label>
                            <textarea disabled={isSubmitting} name="message" rows="4" class="p-2 mt-1 block w-full rounded-md border-1 border-violet-400 text-violet-200 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"></textarea>
                        </div>
                        <div class="cf-turnstile" data-sitekey="0x4AAAAAAA7WX5YoqLQOPiIW"></div>

                        <div class="flex justify-start">
                            <button disabled={isSubmitting} type="submit" class="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                            
                        </div>
                        {isError && (<p className="flex gap-1"><i className="fa-solid fa-circle-xmark text-red-500"></i><span className="text-xs text-violet-100">There was an issue. Please email <a className="underline" href="mailto:digital@unltd.org.uk">digital@unltd.org.uk</a>.</span></p>)}
                    </form>
                )}
            </Popover.Panel>
        </Popover>
    );
}