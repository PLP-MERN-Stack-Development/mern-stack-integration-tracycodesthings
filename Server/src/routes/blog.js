const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();
const { addComment } = require("../controllers/postController.js");
const { searchBlogs } = require("../controllers/postController.js");
const{ body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Category = require('../models/category');


// Search blogs
router.get("/search", searchBlogs);

// Add a comment to a post
router.post("/:id/comments", addComment);


// GET 
router.get('/', async (req, res) => {
    const { userId, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = userId ? { userId } : {};
    const blogs = await Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    
    const total = await Blog.countDocuments(filter);
    
    res.json({
        blogs,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

//get by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
        return res.status(404).json({ message: 'Blog Not Found' });
    } 
    res.json(blog);
});

// POST
router.post('/', async (req, res) => {
    const { userId, title, content } = req.body;
    if (!userId || !title) {
        return res.status(400).json({ message: 'userId and title PLEASE :)' });
        
    }
    const blog = await Blog.create({ userId, title, content });
    res.status(201).json(blog);
});

//PUT
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(id, {$set:{ title, content }}, { new: true});
    if (!updatedBlog) {
        return res.status(404).json({ message: 'Wah Pole your Blog was not found' });
    }
    res.json(updatedBlog);
});

// DELETE
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const result =await Blog.deleteOne({ _id: id });
    if (result.deletedOne === 0) return res.status(404).json({ message: 'Cant Delete...There was Nothing there' });
    res.json({ok: true});


});

// GET all categories (distinct titles)
router.get('/categories/distinct', async (req, res) => {
    const categories = await Blog.distinct('title');
    res.json(categories);
});

//POST api categories
router.post('/categories', async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    const existingCategory = await Blog
        .findOne({ title });
    if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists' });
    }   
    const category = await Blog.create({ title });
    res.status(201).json(category);
});

module.exports = router;
