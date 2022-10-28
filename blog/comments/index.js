const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});


app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ commentId: commentId, content, status: 'pending' });

    commentsByPostId[req.params.id] = comments;

    axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
            postId: req.params.id,
            commentId, 
            content,
            status: 'pending'
        }
    });
    
    res.status(201).send(comments);

});

app.post('/events', async (req, res) => {
    console.log('Received Event', req.body);

    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        const { postId, commentId, status, content } = data;
        const comments = commentsByPostId[postId];
 
        const comment = comments.find(c => c.commentId === commentId)
  
        comment.status = status; 

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                postId,
                commentId,
                content,
                status
            }
        })
    }
});

app.listen(4001, () => {
    console.log("Comment service is listening on port 4001")
})