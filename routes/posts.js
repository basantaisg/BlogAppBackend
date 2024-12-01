const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const router = express.Router();
router.use();

// Middleware to verify token..

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ err: 'Access Denied!' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified.id;
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Create post

router.post('/', verifyToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    const post = new Post({ title, content, author: req.user });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Post

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
