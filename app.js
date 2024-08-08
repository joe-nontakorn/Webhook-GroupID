const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// ใช้ body-parser เพื่อจัดการกับ JSON payload
app.use(bodyParser.json());

// ตั้งค่า Webhook endpoint
app.post('/webhook', (req, res) => {
    const events = req.body.events;

    events.forEach(event => {
        if (event.source.type === 'group') {
            const groupId = event.source.groupId;
            console.log(`Group ID: ${groupId}`);
            // ส่งข้อความกลับไปยังกลุ่มเพื่อยืนยันว่าได้รับ Group ID แล้ว
            replyMessage(event.replyToken, `Group ID ของคุณคือ: ${groupId}`);
        }
    });

    res.sendStatus(200);
});

// ฟังก์ชันสำหรับส่งข้อความกลับไปยังกลุ่ม
const replyMessage = (replyToken, message) => {
    const axios = require('axios');
    const CHANNEL_ACCESS_TOKEN = 'YOUR_CHANNEL_ACCESS_TOKEN';

    axios.post('https://api.line.me/v2/bot/message/reply', {
        replyToken: replyToken,
        messages: [
            {
                type: 'text',
                text: message
            }
        ]
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
        }
    }).then(response => {
        console.log('Message sent successfully');
    }).catch(error => {
        console.error('Error sending message:', error);
    });
};

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
