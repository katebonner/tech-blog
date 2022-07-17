const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Vote } = require('../models');

// RENDER ALL POSTS ON HOMEPAGE
router.get('/', (req, res) => {
    try {
        const postData = await Post.findAll({
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
              ],
              include: [
                  {
                      model: User,
                      attributes: ['username']
                  },
                  {
                      model: Comment,
                      attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                      include: {
                          model: User,
                          attributes: ['username']
                      }
                  }
              ]
        })
        const posts = postData.map(post=>post.get({plain:true}));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });

    } catch (err) {
        res.status(500).json(err);
    }
});

// RENDER SINGLE POST
router.get('/post/:id', (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {id: req.params.id},
            attributes: [
                'id',
                'title',
                'content',
                'created_at',
            ],
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                      model: User,
                      attributes: ['username']
                    }
                }
            ]
        });
        if(!postData){
            res.status(404).json({message: 'no post found with this id'});
            return;
        }
        const post = postData.get({plain:true});
        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn
        });

    } catch (err) {
        res.status(500).json(err);
    }
});

// RENDER LOGIN PAGE
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

module.exports = router;
