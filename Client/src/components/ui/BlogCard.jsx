import { Button } from './button.jsx'
import { Card, CardContent,  CardHeader } from './card.jsx' 
import { useState } from 'react'
import { Input } from './input.jsx'
import { Textarea } from './textarea.jsx'
import { BlogAPI } from '../../lib/api'

export default function BlogCard({ blog, onSave, onUpdate, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState({ title: blog.title, content: blog.content });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState(blog.comments || []);

    async function handleSave(e) {
        e.preventDefault();
        
        // Validation
        const newErrors = {};
        if (!draft.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (draft.title.length > 100) {
            newErrors.title = 'Title must be 100 characters or less';
        }
        
        if (draft.content && draft.content.length > 5000) {
            newErrors.content = 'Content must be 5000 characters or less';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setIsSubmitting(true);
        try {
            await onSave(blog._id, draft);
            setErrors({});
            setEditing(false);
        } catch (error) {
            setErrors({ submit: error.message || 'Failed to save changes' });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleAddComment(e) {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const updatedPost = await BlogAPI.addComment(blog._id, {
                user: 'Anonymous',
                text: commentText
            });
            setComments(updatedPost.comments || []);
            setCommentText('');
        } catch (error) {
            alert('Failed to add comment');
        }
    }

    return (
        <Card className="overflow-hidden ">
            <CardHeader className="flex items-center justify-between">
                {!editing ? (
                    <>
                    <h3 className="text-lg font-semibold">{blog.title}</h3>
                    <div className="flex gap-2">
                        <Button className="bg-slate-700 hover:bg-slate-600" onClick={() => setEditing(true)}>Edit</Button>
                        <Button className="bg-red-700 hover:bg-red-600" onClick={() => onDelete(blog._id)}>Delete</Button>
                    </div>
                    </>
                ) : (
                    <h3 className="text-lg font-semibold">Edit Blog</h3>
                )}

            </CardHeader>
            <CardContent className="space-y-3">
                {!editing ? (
                  <p className="text-slate-700 whitespace-pre-wrap">{blog.content || <em>No content</em>}</p>
                ) : (
                    <form onSubmit={handleSave} className="space-y-2">
                        <div>
                            <Input 
                                value={draft.title} 
                                onChange={(e) => {
                                    setDraft({ ...draft, title: e.target.value });
                                    setErrors({ ...errors, title: '' });
                                }} 
                                placeholder="Title" 
                                className={`mb-2 w-full ${errors.title ? 'border-red-500' : ''}`}
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <Textarea 
                                value={draft.content} 
                                onChange={(e) => {
                                    setDraft({ ...draft, content: e.target.value });
                                    setErrors({ ...errors, content: '' });
                                }} 
                                placeholder="Content" 
                                className={`w-full h-40 mb-2 ${errors.content ? 'border-red-500' : ''}`}
                            />
                            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                        </div>
                        {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
                        <div className="flex gap-2">
                            <Button type="submit" className="bg-green-700 hover:bg-green-600" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </Button>
                            <Button type="button" className="bg-slate-700 hover:bg-slate-600" onClick={() => setEditing(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                        </div>
                    </form> 
                )}
                <p className="text-xs text-slate-500">Updated {new Date(blog.updatedAt).toLocaleString()}</p>
                
                {/* Comments Section */}
                <div className="border-t pt-3 mt-3">
                    <button 
                        onClick={() => setShowComments(!showComments)}
                        className="text-sm text-blue-700 hover:text-blue-600 font-medium"
                    >
                        {showComments ? 'Hide' : 'Show'} Comments ({comments.length})
                    </button>
                    
                    {showComments && (
                        <div className="mt-3 space-y-3">
                            {/* Add Comment Form */}
                            <form onSubmit={handleAddComment} className="flex gap-2">
                                <Input
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" className="bg-blue-700 hover:bg-blue-600">
                                    Comment
                                </Button>
                            </form>
                            
                            {/* Comments List */}
                            {comments.length > 0 ? (
                                <div className="space-y-2">
                                    {comments.map((comment, index) => (
                                        <div key={index} className="bg-slate-50 p-3 rounded">
                                            <p className="text-sm font-medium text-slate-700">{comment.user || 'Anonymous'}</p>
                                            <p className="text-sm text-slate-600 mt-1">{comment.text || comment.content}</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Just now'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No comments yet. Be the first to comment!</p>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}