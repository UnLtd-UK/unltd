import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import moment from "moment";

export default function TabComponent() {

    const types = ["news", "stories", "insights", "how to's"];
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('https://unltd.directus.app/items/posts?fields[]=*.*.*&filter[status][_eq]=published&limit=-1')
            .then(response => response.json())
            .then(data => setPosts(data.data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <TabGroup>
            <TabList>
                {
                    types.map((type, i) => (
                        <Tab as={Fragment} key={type}>
                            {({ hover, selected }) => (
                                <button className="text-violet-300 rounded-md px-3 py-2 text-sm font-medium data-[hover]:text-violet-200 data-[selected]:bg-violet-300 data-[selected]:px-3 data-[selected]:py-2 data-[selected]:text-indigo-700">{type}</button>
                            )}
                        </Tab>
                    ))
                }
            </TabList>

            <TabPanels>
                {
                    types.map((type, i) => (
                        <TabPanel key={i}>
                            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {posts.filter(post => post.tag === type).map((post) => (
                                    <li className="col-span-1 divide-y divide-gray-200 rounded-lg shadow-sm" key={post.id}>
                                        <a href={`/blog/${post.slug}`}>
                                            <article className="flex flex-col items-start justify-between transition hover:bg-violet-100 dark:hover:bg-violet-900 hover:outline-violet-200 hover:dark:outline-violet-800 p-6 rounded-2xl">
                                                <div className="relative w-full h-64">
                                                    {post.image !== null ? (
                                                        <img
                                                            src={`https://unltd.directus.app/assets/${post.image.id}`}
                                                            alt=""
                                                            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={`https://source.boringavatars.com/marble/128/${encodeURI(post.slug)}?colors=220353,3a0883,ce620c&square`}
                                                            alt=""
                                                            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                                                        />
                                                    )}
                                                </div>
                                                <div className="max-w-xl">
                                                    <div className="mt-8 flex items-center gap-x-4 text-xs">
                                                        <time
                                                            dateTime={post.date_time}
                                                            className="text-violet-600 dark:text-violet-400"
                                                        >
                                                            {moment(post.date_time).format("ddd hh:mm, DD MMM YYYY")}
                                                        </time>
                                                        <span className="relative z-10 rounded-full bg-violet-100 dark:bg-violet-900 px-3 py-1.5 font-medium text-violet-600 dark:text-violet-400">
                                                            {post.tag}
                                                        </span>
                                                    </div>
                                                    <div className="group relative">
                                                        <h3 className="mt-3 text-lg font-semibold leading-6 text-violet-700 dark:text-violet-300">
                                                            <span className="absolute inset-0" />
                                                            {post.title}
                                                        </h3>
                                                    </div>
                                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-violet-600 dark:text-violet-400">
                                                        {post.description}
                                                    </p>
                                                </div>
                                                <div className="relative mt-8 flex gap-x-4 text-sm leading-6 flex-col">
                                                    <p className="font-semibold text-violet-700 dark:text-violet-300">
                                                        <span className="absolute inset-0" />
                                                        {post.author_name}
                                                    </p>
                                                    <p className="text-violet-600 dark:text-violet-400">
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