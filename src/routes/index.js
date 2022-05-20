const router = require('express').Router()
const Post = require('../model/Post')
const bcrypt = require('bcrypt')

router.get('/', async(req, res) => {
  try {
    const posts = await Post.find();
    // console.log(posts)
    res.render("index", { model: posts })
  } catch (error) {
    console.log(error)
  }
})

router.get('/create', (req, res) => {
  res.render("create", {model: {}})
})

router.get('/update', (req, res) => {
  res.render("update", {model: {}})
})

module.exports = router;