const express = require('express');
const Web3 = require('web3');
const contractJSON = require('./../build/contracts/MoviesBlockbusterEvents.json');
const config = require('./../config');
const Razorpay = require('razorpay')
const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const instance = new Razorpay({
    key_id: config.key_id,
    key_secret: config.key_secret
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

app.get('/api/v1/rzp_capture/:payment_id/:amount', (req, res) => {
    const {payment_id } = req.params;
    const amount = Number(req.params.amount);
    instance.payments.capture(payment_id, amount).then((data) => {
      res.json(data);
    }).catch((error) => {
      res.json(error);
    });
});


app.get('/tx', (req,res) => {

    console.log(`/Received Transaction`);
    const sig = req.param('sig');
    const nonce = req.param('nonce');
    const hall = req.param('hall');
    const movieID = req.param('movieID');
    const ticket = req.param('ticket');
    const pid = req.param('pid');

    instance.payments.fetch(pid)
    .then(data => {
        if(data.status == 'captured'){
            console.log(`Payment Captured`)
            contractInstance.methods.hallMovieCollectionMapping(hall, movieID).call({from: accounts[0]})
            .then(mov => {
                contractInstance.methods.metaBuyTicket(
                    sig, 
                    nonce, 
                    hall, 
                    movieID, 
                    ticket
                ).send({from: accounts[4], value: mov.price * ticket, gas: 500000})
                .then(tx => {
                    console.log(`/Transaction Success: ${tx.transactionHash}`);
                    res.send(tx.transactionHash)
                })
                .catch(console.log)
            });
        }else{
            console.log(`Payment not Captured Yet.`)
        }
    })
    .catch(console.log)


    console.log(`/Received Signature: ${sig}`);
    
})

app.listen(1337, () => {
    console.log(`Server Started at port 1337`);
})