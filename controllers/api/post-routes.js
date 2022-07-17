const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET ALL POSTS
router.get('/', (req, res) => {
  try {
      const postData = await Post.findAll({
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
      })
      res.status(200).json(postData);
  } catch (err) {
      res.status(500).json(err);
  }
});

// GET POST AND ITS COMMENTS AND USER NAME BY ID
router.get('/:id', (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
                id: req.params.id
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
                    attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                  }
                }
              ]
        })
        if(!postData){
            res.status(404).json({message: 'no post found with this id'});
            return;
        }
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST POST DATA TO CREATE A POST
router.post('/', withAuth, (req, res) => {
  // expects {title: 'blah blah blah', content: 'blah blah blah', user_id: 1}
  try {
      const postData = await Post.create({
          title: req.body.title,
          content: req.body.content,
          user_id: req.session.user_id
      });
      res.status(200).json(postData);

  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT POST DATA TO UPDATE A POST
router.put('/:id', withAuth, (req, res) => {
    try {
        const postData = await Post.update(
            {
                title: req.body.title,
                content: req.body.content
            },
            {
                where: {
                    id: req.params.id
                }
            })
        if(!postData){
            res.status(404).json({message:'no post found with this id'})
        }
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE POST BY ID
router.delete('/:id', withAuth, (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {id: req.params.id}
        })
        if(!postData){
            res.status(404).json({message:'no post found with this id'});
            return;
        }
        res.json(postData)
    } catch {
        res.status(500).json(err);
    }
});

module.exports = router;
