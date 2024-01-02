const express = require('express')
const fs = require('fs')
const status = require('express-status-monitor')
const zlib = require('zlib')

const app = express()
const PORT = 5000
app.use(status())

// Now we want to create a zip of the txt file
// ---> fs readStream text file ----->  Zipper(zlib) -----> fs writeStream 
fs.createReadStream('sample.txt').pipe(zlib.createGzip().pipe(fs.createWriteStream('sample.zip')))

app.get('/', (req, res)=>{
    // ====== Reading the text 1st in our local which takes up memory 
    // fs.readFile('sample.txt', (err, data)=>{
    //     res.send(data)
    // })

    // -------USING STREAMS--------
    const streams = fs.createReadStream('sample.txt', 'utf-8') // utf-8 b'coz my file is text file
    // whenever data comes we send the data in chunks
    streams.on('data', (chunk)=> res.write(chunk))
    // once data ends we need to end the res as well
    streams.on('end', ()=> res.end())
})

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})