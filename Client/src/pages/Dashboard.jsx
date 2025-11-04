import { useEffect, useState } from "react";
import NewBlogDialog from "../components/ui/NewBlogDialog";
import BlogCard from "../components/ui/BlogCard";
import { BlogAPI } from "../lib/api";
import { Input } from "../components/ui/input";

export default function Dashboard({ frontendUserId }) {
  const [blog, setBlog] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  useEffect(()=> {
    loadBlogs(1);
  }, [frontendUserId]);

  async function loadBlogs(page = pagination.page) {
    try {
      setStatus("loading");
      const data = await BlogAPI.list(frontendUserId, page, pagination.limit);
      setBlog(data.blogs || data);
      if (data.pagination) {
        setPagination(data.pagination);
      }
      setStatus("success");
    } catch (e) { 
      setError(e.message); 
      setStatus("error"); 
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadBlogs(1);
      return;
    }

    try {
      setIsSearching(true);
      const results = await BlogAPI.search(searchQuery);
      setBlog(results);
      setPagination({ page: 1, limit: 10, total: results.length, pages: 1 });
    } catch (e) {
      setError(e.message);
    } finally {
      setIsSearching(false);
    }
  }

  async function createBlog(blogData) {
    try {
      const created = await BlogAPI.create({ 
          ...blogData, userId: frontendUserId 
      });
      setBlog(prev => [created, ...prev]);
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to create blog');
    }
  }
  
  async function saveBlog(id, blogData) {
    try {
      const updated = await BlogAPI.update(id, blogData);
      setBlog(prev => prev.map(n => n._id === id ? updated : n));
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to update blog');
    }
  }
  
  async function deleteBlog(id) {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await BlogAPI.remove(id);
      setBlog(prev => prev.filter(n => n._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete blog');
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Your Blog
        </h2>
        <NewBlogDialog onCreate={createBlog} />
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search blogs by title or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-md"
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={() => { setSearchQuery(''); loadBlogs(); }}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-md"
          >
            Clear
          </button>
        )}
      </form>

      {status === "loading" && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      )}
      {status === "error" && (
        <div className="border border-red-300 bg-red-50 text-red-800 px-4 py-3 rounded">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {status === "success" && blog.length === 0 && (
        <div className="text-center py-12 bg-slate-100 rounded-lg">
          <p className="text-slate-600 text-lg">No blogs yet. Create your first blog!</p>
        </div>
      )}

      <div className="grid gap-3">
        {blog.map(n => (
          <BlogCard key={n._id} blog={n} onSave={saveBlog} onDelete={deleteBlog} />
        ))}
      </div>

      {/* Pagination */}
      {!searchQuery && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => loadBlogs(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </span>
          <button
            onClick={() => loadBlogs(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}