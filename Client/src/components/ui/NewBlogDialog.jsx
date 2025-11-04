import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Textarea } from '../ui/textarea.jsx';
import { useState } from 'react';

export default function NewBlogDialog({ onCreate }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ title: '', content: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
     
    async function submit(e) {
        e.preventDefault();
        
        // Validation
        const newErrors = {};
        if (!form.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (form.title.length > 100) {
            newErrors.title = 'Title must be 100 characters or less';
        }
        
        if (form.content && form.content.length > 5000) {
            newErrors.content = 'Content must be 5000 characters or less';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setIsSubmitting(true);
        try {
            await onCreate(form);
            setForm({ title: '', content: '' });
            setErrors({});
            setOpen(false);
        } catch (error) {
            setErrors({ submit: error.message || 'Failed to create blog post' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button className="bg-blue-700 hover:bg-blue-600">New Blog Post</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none">
                    <Dialog.Title className="text-lg font-medium mb-4">Create New Blog Post</Dialog.Title>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Input 
                                placeholder="Title" 
                                value={form.title} 
                                onChange={(e) => {
                                    setForm({ ...form, title: e.target.value });
                                    setErrors({ ...errors, title: '' });
                                }} 
                                required 
                                className={`w-full ${errors.title ? 'border-red-500' : ''}`}
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <Textarea 
                                placeholder="Content" 
                                value={form.content} 
                                onChange={(e) => {
                                    setForm({ ...form, content: e.target.value });
                                    setErrors({ ...errors, content: '' });
                                }} 
                                className={`w-full h-40 ${errors.content ? 'border-red-500' : ''}`}
                            />
                            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                        </div>
                        {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
                        <div className="flex justify-end gap-2">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create'}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
    
