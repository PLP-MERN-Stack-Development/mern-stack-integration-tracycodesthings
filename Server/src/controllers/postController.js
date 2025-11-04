const Blog = require("../models/Blog.js");

const searchBlogs = async (req, res) => {
  try {
    const query = req.query.q; // e.g. /blogs/search?q=health
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Case-insensitive search on title and content
    const results = await Blog.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Add a comment to a post
const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      user: req.body.user,
      text: req.body.text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { searchBlogs, addComment };