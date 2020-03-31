const express = require('express');
const Web3 = require('web3');
const contractJSON = require('./../build/contracts/MoviesBlockbusterEvents.json');

const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let web3 = new Web3('http://localhost:8545');
let chainID;
let contractAddress;
let abi;
let contractInstance;
let accounts;
web3.eth.getAccounts()
.then((account) => {
    accounts = account;
})


web3.eth.net.getId()
.then(c =>  {
    chainID = c
    abi = contractJSON.abi;
    contractAddress = contractJSON.networks[chainID].address;
    contractInstance = new web3.eth.Contract(abi, contractAddress);
    contractInstance.methods.owner().call({from: accounts[0]})
    .then(r => console.log(`Contract Connected -> Owner: ${r}`));

})


app.get('/', (req,res) => {
    res.send('Relayer is Up and Running');
})

app.get('/tx', (req,res) => {

    console.log(`/Received Transaction`);
    const sig = req.param('sig');
    const nonce = req.param('nonce');
    const hall = req.param('hall');
    const movieID = req.param('movieID');
    const ticket = req.param('ticket');

    console.log(`/Received Signature: ${sig}`);
    contractInstance.methods.hallMovieCollectionMapping(hall, movieID).call({from: accounts[0]})
    .then(mov => {
        contractInstance.methods.metaBuyTicket(
            sig, 
            nonce, 
            hall, 
            movieID, 
            ticket
        ).send({from: accounts[4], value: mov.price * ticket, gas: 100000})
        .then(tx => {
            console.log(`/Transaction Success: ${tx.transactionHash}`);
            res.send(tx.transactionHash)
        })
        .catch(console.log)
    });
})

app.listen(1337, () => {
    console.log(`Server Started at port 1337`);
})