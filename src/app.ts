import express from 'express'
import multer from 'multer'

const app = express()
const upload = multer()

app.post('/api/v1/jobs', upload.single('file'), (req, res) => {
    // No processing, just return a fixed response
    res.json({
        url: 'https://drive.google.com/file/d/1h3zXjYfZs9WXsFcFKANNH2rsz8kTStXc/view?usp=drive_link'
    })
})

export default app