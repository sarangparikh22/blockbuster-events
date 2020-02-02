# Blockbuster.Events 

## Description
Blockbuster.Events is a decentralized Event and Movie Booking platform created on the Blockchain. The main goal is to democratized the Booking industry and increase revenue for the creators and reduce prices for the consumers. Blockbuster.Event allows anyone to host Event for Free and Movies can be hosted by the Theter Halls approved by the Blockbuster.Events team. There is no additional or hidden charge taken by Blockbuster.Events team. This would help stop the monopoly in the Event Management industry.

Movies can be hosted by the Halls and viewers can buy tickets and also do advanced operations such as Refund.
It also has Staking option for Events - If the user has signed up for an Event they have to stake some amount and if they do not turn up at an Event their stake will be distributed with the rest. This way you probably might earn in going in free Meetups :)

The project was inspired by reading the [Article](https://www.thenewsminute.com/article/case-against-bookmyshow-pvr-levying-internet-handling-fee-customers-98257) that talks about how Event Management Companies levy high charges on users.
    
The following project has been created as per the requirements of [Consensys Developer Bootcamp](https://learn.consensys.net/catalog/info/id:141)

## Get it up and running locally!
### Setting up the code base
```sh
$ git clone https://github.com/sarangparikh22/blockbuster-events
$ cd blockbuster-events
$ npm install
$ cd client
$ npm install
```
Aforementioned steps require you to have Node.js installed.

### Setup Blockchain Development Environment
```sh
$ npm install truffle ganache-cli -g
$ ganache-cli -d
$ truffle migrate --reset
```
If all goes good, the contracts will compile and deploy successfully.

### Running Truffle Tests
```sh
$ truffle test
```

### Starting Development Server and UI
```sh
$ cd client
$ npm start
```
Unlock the Metamask by entering your password and select the localhost:8545 network and Refresh the page.
