# Blockbuster.Events 

Video: https://vimeo.com/388820946 

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
This will start http://localhost:3000
Unlock the Metamask by entering your password and select the localhost:8545 network and Refresh the page.

## Project Specifications

- [x] A README.md that explains the project
  - [x] What does it do?
  - [x] How to set it up.
    - [x] How to run a local development server.
- [x] It should be a [Truffle project](https://truffleframework.com/docs/truffle/getting-started/creating-a-project).
  - [x] All contracts should be in a `contracts` directory.
    - [x] `truffle compile` should successfully compile contracts.
  - [x] Migration contract and migration scripts should work.
    - [x] `truffle migrate` should successfully migrate contracts to a locally running `ganache-cli` test blockchain on port `8454`.
  - [x] All tests should be in a `tests` directory.
    - [x] `truffle test` should migrate contracts and run the tests.
- [x] Smart contract code should be commented according to the [specs in the documentation](https://solidity.readthedocs.io/en/v0.5.2/layout-of-source-files.html#comments).
- [x] Create at least 5 tests for each smart contract.
  - [x] Write a sentence or two explaining what the tests are covering, and explain why those tests were written.
- [x] A development server to serve the front-end interface of the application.
  - [x] It can be something as simple as the [lite-server](https://www.npmjs.com/package/lite-server) used in the [Truffle Pet Shop tutorial](https://truffleframework.com/tutorials/pet-shop).
- [x] A document [design_pattern_decisions.md](design_pattern_decisions.md) that explains the design patterns chosen.
- [x] A document [avoiding_common_attacks.md](avoiding_common_attacks.md) that explains what measures were taken to ensure that the contracts are not susceptible to common attacks.
- [x] Implement/use a library or an EthPM package.
- [x] Develop your application and run the other projects during evaluation in a VirtualBox VM running Ubuntu 16.04 to reduce the chances of runtime environment variables.

---

## Project Requirements

### User Interface

- [x] Run the dapp on a development server locally for testing and grading.
- [x] You should be able to visit a URL and interact with the application:
  - [x] App recognizes current account;
  - [x] Sign transactions using MetaMask or uPort;
  - [x] Contract state is updated;
  - [x] Update reflected in UI.

### Testing

- [x] Write 5 tests for each contract you wrote;
  - [x] Solidity **or** JavaScript.
- [x] Explain why you wrote those tests;
  - [x] Tests run with `truffle test`.

### Design Patterns

- [x] Implement a circuit breaker (emergency stop) pattern.
- [x] What other design patterns have you used / not used?
  - [x] Why did you choose the patterns that you did?


### Security Tools / Common Attacks

- [x] Explain what measures you have taken to ensure that your contracts are not susceptible to common attacks.

### Use a Library or Extend a Contract

- [x] Via EthPM or write your own.

### Deployment

- [x] Deploy your application onto one of the test networks.
- [x] Include a document called [deployed_addresses.txt](deployed_addresses.txt) that describes where your contracts live (which testnet and address).
- [x] Students can verify their source code using Etherscan https://etherscan.io/verifyContract for the appropriate testnet.
- [x] Evaluators can check by getting the provided contract ABI and calling a function on the deployed contract at https://www.myetherwallet.com/#contracts or checking the verification on Etherscan.

### Stretch

- [x] Implement an upgradable design pattern.
- [ ] Write a smart contract in LLL or Vyper.
- [x] Integrate with an additional service. For example:
  - [x] IPFS - users can dynamically upload documents to IPFS that are referenced via their smart contract.
  - [ ] uPort
  - [ ] Ethereum Name Service - a name registered on the ENS resolves to the contract, verifiable on `https://rinkeby.etherscan.io/<contract_name>`
  - [ ] Oracle
