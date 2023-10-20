const express = require('express')
const app = express()
const port = 3000
const qrcode = require("qrcode-terminal");
const fs= require("fs");

// const{Client} = require("whatsapp-web.js");
const { Client, Location, Poll, List, Buttons, LocalAuth ,LegacySessionAuth} = require("whatsapp-web.js");
const { log } = require('console');

// const SESSION_FILE_PATH = "./session.json";
// let sessionCfg;
// let sessionData;
// if(fs.existsSync(SESSION_FILE_PATH)){
//     sessionCfg = require(SESSION_FILE_PATH);
// }

const client = new Client({
    // authStrategy: new LocalAuth(),
    // authStrategy: new LegacySessionAuth({
    //     session: sessionData
    // }),
    authStrategy: new LocalAuth({
        clientId: "client-one"
        }),
    // proxyAuthentication: { username: 'username', password: 'password' },
    puppeteer: { 
        // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
        headless: true
    },
    // session:sessionCfg,
});

client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    // console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small:true});
});

client.on('authenticated', (session) => {
    console.log('AUTHENTICATED',session);
    // sessionCfg = session;
    // fs.writeFile(SESSION_FILE_PATH,JSON.stringify(session), function(err){
    //     if(err){
    //         console.error(err);
    //     }
    // })
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api', (req, res) => {
    let tujuan = req.query.tujuan;
    let pesan = req.query.pesan;
    let num = req.query.num;
    let tujuan2;

    tujuan = tujuan.substring(1);
    tujuan = `62${tujuan}@c.us`;
    tujuan2 = `62${tujuan}@c.us`;

    for (let i = 0; i < num; i++) {
        client.sendMessage(tujuan, pesan+i); 
        client.sendMessage(tujuan2, pesan+i); 
    }

    res.json({status:false});

  })
  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})