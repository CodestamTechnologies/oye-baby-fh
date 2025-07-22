// app/blogs/page.tsx (or wherever this component lives in the App Router)

import { Calendar } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

// Interface for a single blog post
interface BlogPost {
    title: string;
    excerpt: string;
    date: string;
    image: string;
    author: string;
    category: string;
}

// Interface for the API response
interface ApiPost {
    id: string;
    blogId: string;
    live: boolean;
    subdomain: string;
    createdAt: number;
    content: string;
    metadata: {
        format: string;
        additionalNotes: string;
        status: string;
        createdAt: {
            seconds: number;
            nanoseconds: number;
        };
        uploadBatch: {
            seconds: number;
            nanoseconds: number;
        };
        tone: string;
        uid: string;
        language: string;
        title: string;
        mainIdea: string;
        subdomain: string;
        keywords: string;
        targetAudience: string;
    };
    slug: string;
    uid: string;
    image?: string;
}

interface ApiResponse {
    posts: ApiPost[];
}

// Async Server Component
export default async function Blogs() {
    let blogPosts: BlogPost[] = [];
    let error: string | null = null;

    try {
        const response = await fetch('https://manyblogs.blog/api/get-blogs-from-subdomain?domain=florcent-hampers&limit=3', {
            cache: 'force-cache', // Cache for performance; adjust as needed
        });

        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }

        const data: ApiResponse = await response.json();

        // Transform API data to match BlogPost interface
        blogPosts = data.posts.map((post: ApiPost) => ({
            title: post.metadata.title,
            excerpt:
                post.content.split('\n').find((line: string) => line.trim().length > 50) ||
                'No excerpt available',
            date: new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            }),
            image: post.image || '/api/placeholder/360/240',
            author: 'Raghav Sharma', // Default author
            category: post.metadata.keywords.split(', ')[0] || 'DevOps',
        }));
    } catch (err: unknown) {
        error = err instanceof Error ? err.message : 'Unknown error occurred';
    }

    // If no posts or error, show "Blogs are coming soon!" message
    if (error || blogPosts.length === 0) {
        return (
            <section className="">
                {/* <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-serif font-medium mb-2">Blogs are coming soon!</h2>
                    {error && <p className="text-red-600">Error: {error}</p>}
                </div> */}
            </section>
        );
    }

    return (
        <section className="py-16 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-serif font-medium mb-2">Style Guide</h2>
                        <p className="text-gray-600">Inspiration, tips, and fashion advice</p>
                    </div>
                    <Button variant="outline" className="mt-4 md:mt-0">
                        Read All Articles
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {blogPosts.map((post: BlogPost, index: number) => (
                        <Card key={index} className="overflow-hidden h-full flex flex-col">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="flex justify-between items-center mb-2">
                                    <Badge className="bg-gray-100 text-gray-800 font-normal">{post.category}</Badge>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-3 w-3 mr-1" /> {post.date}
                                    </div>
                                </div>
                                <h3 className="font-medium text-lg mb-2">{post.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">
                                            {post.author.charAt(0)}
                                        </div>
                                        <span className="text-sm">{post.author}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                                        Read More
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
