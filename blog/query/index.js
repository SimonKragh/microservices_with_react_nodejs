const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };

    }

    if (type === 'CommentCreated') {
        const { commentId, content, postId, status } = data;
        const post = posts[postId];
        post.comments.push({ commentId, content, status });
    }

    if (type === 'CommentUpdated') { 
        const { commentId, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.commentId === commentId
        });

        comment.status = status;
        comment.content = content; 

    }
};

app.get('/posts', (req, res) => {
    res.send(posts)
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    var now = new Date();

    console.log(`[${now.toUTCString()}].Processing Event:`, type)
    handleEvent(type, data);


    res.send({});

});

app.listen(4002, async () => {
    console.log("Query service is listening on 4002")
    const res = await axios.get('http://localhost:4005/events'); 

    for (let event of res.data) {
        var now = new Date();
        console.log(`[${now.toUTCString()}].Processing Event:`, event.type)
        handleEvent(event.type, event.data);
    }
});