import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react'
import moment from "moment";
import slugify from "slugify";
import { posts } from "@data/posts.js";
const types = ["news", "stories", "insights", "how to's"];

export default function Main() {
    return (
        <TabGroup>
            <TabList>
                {
                    types.map((type, i) => (
                        <Tab as={Fragment}>
                            {({ hover, selected }) => (
                                <button className="text-violet-300 rounded-md px-3 py-2 text-sm font-medium data-[hover]:text-gray-700 data-[selected]:bg-violet-300 data-[selected]:px-3 data-[selected]:py-2 data-[selected]:text-indigo-700">{type}</button>
                            )}
                        </Tab>
                    ))
                }
            </TabList>

            <TabPanels>
                {
                    types.map((type, i) => (
                        <TabPanel>
                            <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {
                                    posts.filter(post => post.tag === type).map((post) => (
                                        <li class="col-span-1 divide-y divide-gray-200 rounded-lg shadow">
                                            <a href={`/blog/${post.slug}`}>
                                                <article class="flex flex-col items-start justify-between transition hover:bg-violet-100 dark:hover:bg-violet-900 hover:outline-violet-200 hover:dark:outline-violet-800 p-6 rounded-2xl">
                                                    <div class="relative w-full h-64">
                                                        {post.image !== null ? (
                                                            <img
                                                                src={`https://unltd.directus.app/assets/${post.image}`}
                                                                alt=""
                                                                class="absolute inset-0 w-full h-full object-cover rounded-2xl"
                                                            />
                                                        ) : (
                                                            <img
                                                                src={`https://source.boringavatars.com/marble/128/${encodeURI(post.slug)}?colors=220353,3a0883,ce620c&square`}
                                                                alt=""
                                                                class="absolute inset-0 w-full h-full object-cover rounded-2xl"
                                                            />
                                                        )}
                                                    </div>
                                                    <div class="max-w-xl">
                                                        <div class="mt-8 flex items-center gap-x-4 text-xs">
                                                            <time
                                                                datetime={post.date_time}
                                                                class="text-violet-600 dark:text-violet-400"
                                                            >
                                                                {moment(post.date_time).format("ddd hh:mm, DD MMM YYYY")}
                                                            </time>
                                                            <span class="relative z-10 rounded-full bg-violet-100 dark:bg-violet-900 px-3 py-1.5 font-medium text-violet-600 dark:text-violet-400">
                                                                {post.tag}
                                                            </span>
                                                        </div>
                                                        <div class="group relative">
                                                            <h3 class="mt-3 text-lg font-semibold leading-6 text-violet-700 dark:text-violet-300">
                                                                <span class="absolute inset-0" />
                                                                {post.title}
                                                            </h3>
                                                        </div>
                                                        <p class="mt-5 line-clamp-3 text-sm leading-6 text-violet-600 dark:text-violet-400">
                                                            {post.description}
                                                        </p>
                                                    </div>
                                                    <div class="relative mt-8 flex gap-x-4 text-sm leading-6 flex-col">
                                                        <p class="font-semibold text-violet-700 dark:text-violet-300">
                                                            <span class="absolute inset-0" />
                                                            {post.author_name}
                                                        </p>
                                                        <p class="text-violet-600 dark:text-violet-400">
                                                            {post.author_position}
                                                        </p>
                                                    </div>
                                                </article>
                                            </a>
                                        </li>
                                    ))}
                            </ul>
                        </TabPanel>
                    ))
                }
            </TabPanels>
        </TabGroup>
    )
}