const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// RENDER ALL POSTS ON DASHBOARD
router.get('/', withAuth, (req, res) => {
    try {
        const postData = await Post.findAll({
            where: {
                user_id: req.session.user_id
              },
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
                },
              ]
        })
        const posts = postData.map(post => post.get({ plain: true }));
        res.render('dashboard', { 
            posts, 
            loggedIn: true 
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// RENDER 1 POST BY ID TO EDIT IT
router.get('/edit/:id', withAuth, (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
              ],
              include: [
                {
                  model: Comment,
                  attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                  include: {
                    model: User,
                    attributes: ['username']
                  }
                },
                {
                  model: User,
                  attributes: ['username']
                }
              ]
        })
        if(postData){
            const post = postData.get({ plain: true });
            res.render('edit-post', {
                post,
                loggedIn: true
              });
        } else {
            res.status(404).end();
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// CREATE POST
// router.get('/create/', withAuth, (req, res) => {
//     try {
//         const postData = await Post.findAll({
//             where: {
//                 user_id: req.session.user_id
//             },
//             attributes: [
//                 'id',
//                 'title',
//                 'content',
//                 'created_at'
//             ],
//             included: [
//                 {
//                     model: User,
//                     attributes: ['username']
//                 },
//                 {
//                     model: Comment,
//                     attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
//                     include: {
//                         model: User,
//                         attributes: ['username']
//                     }
//                 }
//             ]
//         })
//         const posts = postData.map(post=>post.get({plain:true}))
//         res.render('create-post', {
//             posts,
//             loggedIn:true
//         });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

module.exports = router;