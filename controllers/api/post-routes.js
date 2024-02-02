const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            attributes: [ 
                'id', 'title', 'content', 'created_at' 
            ],
            include: [{ 
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
            }]
        });
        
        return res.json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id', 'title', 'content', 'created_at'
            ],
            include: [{
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
            }]
        });
        if (!postData) {
            return res.status(404).json({error: 'No post found with this id'});
        }
        
        return res.json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/', withAuth, async (req, res) => {
    try {
        const postData = await Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id
        });

        return res.json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.update({
            title: req.body.title,
            content: req.body.content
         },
          {
            where: {
                id: req.params.id
            }
        });
        if (!postData) {
            return res.status(404).json({error: 'No post found with this id'});
        }

        return res.json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id
            }
        });
        if (!postData) {
            return res.status(404).json({error: 'No post found with this id'});
        }

        return res.json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
});

module.exports = router;