const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/authentication');

// GET ALL COMMENTS
router.get('/', async (req, res) => {
    try{
        const commentData = await Comment.findAll();
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST COMMENT
router.post('/', withAuth, async (req, res) => {
  // expects => {comment_text: "This is the comment", user_id: 1, post_id: 2}
  try {
    const commentData = await Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.session.user_id,
        post_id: req.body.post_id
    })
    res.status(200).json(commentData);
  } catch (err) {
        res.status(500).json(err);
  }
});

// DELETE COMMENT
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {id: req.params.id}
        })
        if(!commentData){
            res.status(404).json({message: 'no comment found with this id'});
            return;
        }
        res.json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
