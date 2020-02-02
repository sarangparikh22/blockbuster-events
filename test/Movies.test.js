const Movies = artifacts.require('./MoviesBlockbusterEvents.sol')
const truffleAssert = require('truffle-assertions');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Movies' , (accounts) => {
    let contract;
    // let currentTime = Math.round((new Date()).getTime() / 1000);
    let currentTime = 1585945160;

    let beforeRefund;

    before(async () => {
        contract = await Movies.deployed();
    })

    describe('deployment', async () => {
        //checking for deployment by checking contract address
        it('deploys successfully', async () => {
            const address = contract.address;
            assert.notEqual(address, "")
        })

        // checking that the owner of the contract should be conrrect
        it('owner should be correct', async () => {
            const owner = await contract.owner();
            assert.equal(owner, accounts[0])
        })
    })

    describe('platform admin roles',async () => {
        // checking if hall registration is done correctly
        it('should register hall 1', async () => {
            const reg = await contract.registerHall(accounts[1]);
            const hallMaping = await contract.hallMapping(accounts[1]);
            assert.equal(hallMaping, true);
        })
        // setting hall for unregister hall
        it('should register hall 2', async () => {
            const reg = await contract.registerHall(accounts[2]);
            const hallMaping = await contract.hallMapping(accounts[2]);
            assert.equal(hallMaping, true);
        })
        // checking the unregister function working
        it('should unregister hall 2', async () => {
            const reg = await contract.unregisterHall(accounts[2]);
            const hallMaping = await contract.hallMapping(accounts[2]);
            assert.equal(hallMaping, false);
        })
    })

    describe('hall roles', async () => {
        
        // As hall 2 is not registered this should fail checking only hall can host movies
        it('should not add movie 1 to hall 2', async () => {
            await truffleAssert.reverts(contract.addMovie("The Martian","desc","trailer",0, Math.round((new Date()).getTime() / 1000),5,10,true, {from: accounts[2]}))
        })

        // verifying that hall 2 did not host movie
        it('the count of movies for hall 2 should be 0', async () => {
            const hall2iCount = await contract.hallMovieCountMapping(accounts[2]);
            assert.equal(hall2iCount, 0);
        })
        
        // verify that hall 1 can host movie as it is a legit hall
        it('should add movie 1 to hall 1', async () => {
            await contract.addMovie("The Martian","desc","trailer",0,currentTime,5,10,true, {from: accounts[1]})
        })

        // verify that movie count was increased
        it('the count of movies for hall 1 should be 1', async () => {
            const hall1iCount = await contract.hallMovieCountMapping(accounts[1]);
            assert.equal(hall1iCount, 1);
        })

        // checking the details of the movie that was hosted
        it('should return correct details of Movie added', async () => {
            const movieDetails = await contract.hallMovieCollectionMapping(accounts[1], 1)
            assert.equal(movieDetails.movieID.toNumber(), 1);
            assert.equal(movieDetails.hall, accounts[1]);
            assert.equal(movieDetails.movieName, "The Martian");
            assert.equal(movieDetails.format, 0);
            assert.equal(movieDetails.time.toNumber(), currentTime);
            assert.equal(movieDetails.seatsLeft.toNumber(), 5);
            assert.equal(movieDetails.price.toNumber(), 10);
            assert.equal(movieDetails.active, true);
            assert.equal(movieDetails.cancellation, true);
        })

        // adding one more movie to the list
        it('should add movie 2 to hall 1', async () => {
            await contract.addMovie("3 Idiots","desc","trailer",1,currentTime,5,10,false, {from: accounts[1]})
        })

        // verify the movie count increment
        it('the count of movies for hall 1 should be 2', async () => {
            const hall1iCount = await contract.hallMovieCountMapping(accounts[1]);
            assert.equal(hall1iCount, 2);
        })

        // checking the details of new movie added
        it('should return correct details of Movie 2 added', async () => {
            const movieDetails = await contract.hallMovieCollectionMapping(accounts[1], 2)
            assert.equal(movieDetails.movieID.toNumber(), 2);
            assert.equal(movieDetails.hall, accounts[1]);
            assert.equal(movieDetails.movieName, "3 Idiots");
            assert.equal(movieDetails.format, 1);
            assert.equal(movieDetails.time.toNumber(), currentTime);
            assert.equal(movieDetails.seatsLeft.toNumber(), 5);
            assert.equal(movieDetails.price.toNumber(), 10);
            assert.equal(movieDetails.active, true);
            assert.equal(movieDetails.cancellation, false);
        })
    })

    describe('buy ticket', async () => {

        // verify the buy ticket functionality
        it('buy single ticket from account 3', async () => {
            await contract.buyTicket(accounts[1], 1, 1, {from: accounts[3], value: 10})
        })
        
        // verify the ticket was purchased successfully
        it('verify ticket purchase', async () => {
            const numTickets = await contract.verifyViewer(accounts[1], 1, {from: accounts[3]})
            assert.equal(numTickets, 1);
        })
        
        // checking the revenue of the hall
        it('verify total revenue', async () => {
            const rev = await contract.totalRevenue(accounts[1])
            assert.equal(rev.toNumber(), 10);
        })

        // seat count should decrement after the purchase 
        it('verify seat left after purchase', async () => {
            const movieDetails = await contract.hallMovieCollectionMapping(accounts[1], 1)
            assert.equal(movieDetails.seatsLeft.toNumber(), 4);
        })

        // verify that buy cannot be possible if it exceeds the remaining amount of tickets
        it(`can't buy more tickets than available`, async () => {
            await truffleAssert.reverts(contract.buyTicket(accounts[1], 1, 5, {from: accounts[3], value: 50}))
        })

        // verify that buy only works with correct price
        it(`can't buy tickets with less money than required`, async () => {
            await truffleAssert.reverts(contract.buyTicket(accounts[1], 1, 2, {from: accounts[3], value: 10}))
        })
        
        // can buy more tickets
        it('should be able to buy more tickets', async () => {
            await contract.buyTicket(accounts[1], 1, 3, {from: accounts[3], value: 30})
        })
        
        // verify the adding of tickets
        it('verify ticket purchase 2', async () => {
            const numTickets = await contract.verifyViewer(accounts[1], 1, {from: accounts[3]})
            assert.equal(numTickets, 4);
        })

        // verify if the revenue was added
        it('verify total revenue 2', async () => {
            const rev = await contract.totalRevenue(accounts[1])
            assert.equal(rev.toNumber(), 40);
        })

        //  verify if the seat is added or not
        it('verify seat left after purchase 2', async () => {
            const movieDetails = await contract.hallMovieCollectionMapping(accounts[1], 1)
            assert.equal(movieDetails.seatsLeft.toNumber(), 1);
        })
    })
    
    describe('hall booking control', async () => {
        
        // halting booking
        it('stop booking', async () => {
            await contract.stopBooking(1, {from: accounts[1]});
        })
        
        // check if booking has stopped
        it('verify booking stopped', async () => {
            const movieDetails = await contract.hallMovieCollectionMapping(accounts[1], 1)
            assert.equal(movieDetails.active, false);
        })

        // buy not allowed after booking is stopped
        it('should not allow to buy', async () => {
            await truffleAssert.reverts(contract.buyTicket(accounts[1], 1, 1, {from: accounts[3], value: 10}))
        })

        // start boooking
        it('should start booking again', async () => {
            await contract.startBooking(1, {from: accounts[1]});
        })

        // verify booking started
        it('verify booking started again', async () => {
            const movieDetails = await contract.hallMovieCollectionMapping(accounts[1], 1)
            assert.equal(movieDetails.active, true);
        })

        // check booking open or not
        it('should allow to buy', async () => {
            await contract.buyTicket(accounts[1], 1, 1, {from: accounts[3], value: 10})
        })

        // buy tickets after open booking
        it('verify ticket purchase 3', async () => {
            const numTickets = await contract.verifyViewer(accounts[1], 1, {from: accounts[3]})
            assert.equal(numTickets, 5);
        })

        // verify the hall revenue
        it('verify total revenue 3', async () => {
            const rev = await contract.totalRevenue(accounts[1])
            assert.equal(rev.toNumber(), 50);
        })

        // verify seat left after allocation
        it('verify seat left after purchase 3', async () => {
            const movieDetails = await contract.hallMovieCollectionMapping(accounts[1], 1)
            assert.equal(movieDetails.seatsLeft.toNumber(), 0);
        })
    })
    
    describe('refund policy', async () => {

        // booking movie at hall 2 for refund
        it('should book ticket for Movie 2 in hall 1', async () => {
            await contract.buyTicket(accounts[1], 2, 1, {from: accounts[3], value: 10})
        })
        
        
        it('verify user ticket purchase', async () => {
            const numTickets = await contract.verifyViewer(accounts[1], 2, {from: accounts[3]})
            assert.equal(numTickets, 1);
        })

        // as movie 2 does not have refund enabled it should fail
        it('should not be able to request refund from movie 2', async () => {
            await truffleAssert.reverts(contract.reqRefund(accounts[1], 2, {from: accounts[3]}))
        })

        // get refund from movie 1
        it('should be able to get refund from movie 1', async () => {
            beforeRefund = await web3.eth.getBalance(accounts[3]);
            await contract.reqRefund(accounts[1], 1, {from: accounts[3]});
        })

        it('verify ticket purchase 4', async () => {
            const numTickets = await contract.verifyViewer(accounts[1], 1, {from: accounts[3]})
            assert.equal(numTickets, 0);
        })

        it('verify total revenue 4', async () => {
            const rev = await contract.totalRevenue(accounts[1])
            assert.equal(rev.toNumber(), 10);
        })

        it('verify seat left after purchase 4', async () => {
            const movieDetails = await contract.hallMovieCollectionMapping(accounts[1], 1)
            assert.equal(movieDetails.seatsLeft.toNumber(), 5);
        })

        // should update the seat count
       it('should new set seat count', async () => {
           await contract.setSeats(1, 10, {from: accounts[1]});
       })

       // check if seat is changed or not
       it('should verify seat count change', async () => {
           const movieDetails = await contract.hallMovieCollectionMapping(accounts[1], 1)
           assert.equal(movieDetails.seatsLeft.toNumber(), 10);
        })
        
    })

    
    describe('earning and withdraws for hall', async () => {

        // get accurate hall earning
        it('should show earning of the hall', async () => {
            let earning = await contract.earning({from: accounts[1]})
            assert.equal(earning, 10);
        })

        // verify withdraw
        it('should be able to withdraw', async () => {
            await contract.withdraw({from: accounts[1]})
            assert.equal(await contract.earning({from: accounts[1]}), 0);
        })

        // pause contract in case of dispute
        it('should pause contract', async() => {
            await contract.pause({from: accounts[0]})
        })

        // do not let movie hosting
        it('should not add movie when paused', async() => {
            await truffleAssert.reverts(contract.addMovie("The Martian","desc","trailer",0, Math.round((new Date()).getTime() / 1000),5,10,true, {from: accounts[1]}))
        })

        // unpause after resolution
        it('should unpause', async() => {
            await contract.unpause({from: accounts[0]})
        })

        // normal functionality resumes
        it('should  add movie when unpaused', async() => {
            await contract.addMovie("The Martian","desc","trailer",0, Math.round((new Date()).getTime() / 1000),5,10,true, {from: accounts[1]})
        })
    })

})