const express = require('express')

const app = express()

const port = 2026

app.use(express.json())

app.post('/', (req, res) => res.send('ok'))

app.post('/req', (req, res) => {
    console.log(`Request => ${JSON.stringify(req.body)}`)
    res.send('ok')
})

app.post('/res', (req, res) => {
    console.log(`Response => ${JSON.stringify(req.body)}`)
    res.send('ok')
})

app.listen(port, () => console.log(`js-hook-server ${port}!`))