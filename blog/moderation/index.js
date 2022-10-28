const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json())



app.post('/events', (req, res) => {

    const { type, data } = req.body;
    console.log("Received event", data);


    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        const eventStructure = {
            type: 'CommentModerated',
            data: {
                commentId: data.commentId,
                postId: data.postId,
                status,
                content: data.content
            }
        };

        axios.post(`http://event-bus-srv:4005/events`, eventStructure );
        console.log("Created Moderation:", eventStructure)
    };


});


app.listen(4003, () => {
    console.log("Modeation Service listening on 4003")
})