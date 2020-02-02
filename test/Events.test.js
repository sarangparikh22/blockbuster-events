const Events = artifacts.require('./EventsBlockbusterEvents.sol')
const truffleAssert = require('truffle-assertions');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Events', (accounts) => {
    let contract;

    before(async () => {
        contract = await Events.deployed();
    })

    describe('deployment', async () => {
        // checking deployment
        it('deploys successfully', async () => {
            const address = contract.address;
            assert.notEqual(address, "")
        })

        // checking the owner of the contract
        it('owner should be correct', async () => {
            const owner = await contract.owner();
            assert.equal(owner, accounts[0])
        })
    })

    describe('create event', () => {

        // checking creation of paid event
        it('can create event successfully (Paid)', async () => {
            const cE = await contract.createEvent("Event 1", "img", "desc", "loc", 123, 10, 0, 10, {from: accounts[1]});
        })

        // checking creation of staking event
        it('can create event successfully (Stake)', async () => {
            const cE = await contract.createEvent("Event 2", "img", "desc", "loc", 123, 10, 10, 0, {from: accounts[1]});
        })

        // event should be paid, staked or free but cannot be paid and staked at the same time
        it('should not create event with both stake and price', async () => {
            await truffleAssert.reverts(contract.createEvent("Event 2", "img", "desc", "loc", 123, 10, 10, 10, {from: accounts[1]}));

        })

    })

    describe('register for event', async () => {

        // check registration for the event
        it('can register for event', async () => {
            await contract.register(1, {from: accounts[2], value: 10});
            const regC = await contract.verifyReg(1, accounts[2]);
            assert.equal(regC, true);
        })

        // should not register if it is paid less than the event requirement
        it('cannot register for event when paid less', async () => {
            await truffleAssert.reverts(contract.register(1, {from: accounts[3],value: 9}));
        })

        // stake and register for event
        it('can stake and register for event', async () => {
            await contract.stakeAndRegister(2, {from: accounts[2], value: 10});
            const regC = await contract.verifyReg(2, accounts[2]);
            assert.equal(regC, true);  
        })
    })

    describe('event attendance', async () => {
        
        // only event owner should mark event attendance
        it('should not mark event attendace by wrong event owner', async () => {
            await truffleAssert.reverts(contract.eventAttendance(1, accounts[2], {from: accounts[2]}));
        })

        // only attendess who bought tickets should be considered for stake reward
        it('should not mark non-attendee present', async () => {
            await truffleAssert.reverts(contract.eventAttendance(1, accounts[4], {from: accounts[1]}));
        })

        // checking attendance marking
        it('should mark event attendance', async () => {
            await contract.eventAttendance(1, accounts[2], {from: accounts[1]});
        })

        // checking the earning of the event
        it('should verify event earning', async () => {
            const eE = await contract.getEventIncome(1);
            assert.equal(eE.toNumber(), 10);
        })

    })

    describe('staking mechanism', async () => {
    
        // creating new staking event
        it('should register a new staking event', async () => {
            const cE = await contract.createEvent("Event 3", "img", "desc", "loc", 123, 10, 10, 0, {from: accounts[1]});
        })
        
        // adding participant 1
        it('should register attendee 1', async () => {
            await contract.stakeAndRegister(3, {from: accounts[2], value: 10});
        })

        // adding participant 2
        it('should register attendee 2', async () => {
            await contract.stakeAndRegister(3, {from: accounts[3], value: 10});
        })

        // adding participant 3
        it('should register attendee 3', async () => {
            await contract.stakeAndRegister(3, {from: accounts[4], value: 10});
        })

        // adding participant 4
        it('should register attendee 4', async () => {
            await contract.stakeAndRegister(3, {from: accounts[5], value: 10});
        })

        // marking 3 attendees present
        it('should mark attendees present', async () => {
            await contract.eventAttendance(3, accounts[2], {from: accounts[1]});
            await contract.eventAttendance(3, accounts[3], {from: accounts[1]});
            await contract.eventAttendance(3, accounts[4], {from: accounts[1]});
        })

        // finishing the event
        it('should finish', async () => {
            await contract.finishEvent(3, {from: accounts[1]});
        })

        // distributing the stakes
        it('should distribute the stakes', async () => {
            await contract.retStake(3, {from: accounts[1]});
        })

        // checking if the distribution is correct or not, registered but not attended will not recieve their stake back
        it('should verify balance', async () => {
            const b1 = await contract.balances(accounts[2]);
            const b2 = await contract.balances(accounts[3]);
            const b3 = await contract.balances(accounts[4]);
            const b4 = await contract.balances(accounts[5]);
            assert.equal(b1, 13)
            assert.equal(b2, 13)
            assert.equal(b3, 13)
            assert.equal(b4, 0)
        })

    })

    describe('withdraw balances', async () => {

        // cannot withdraw balance before event finishes
        it('cannot withdraw before event finishes', async () => {
            await truffleAssert.reverts(contract.withdrawFromEvent(1, {from: accounts[1]}));
        })

        // chekcing money withdrawal form the event
        it('should withdraw money from events', async () => {
            await contract.finishEvent(1, {from: accounts[1]});
            await contract.withdrawFromEvent(1, {from: accounts[1]});
        })

        // stakers withdrawing stakes
        it('should withdraw stakes from the staking events', async () => {
            await contract.withdraw({from: accounts[2]});
            await contract.withdraw({from: accounts[3]});
            await contract.withdraw({from: accounts[4]});
            await contract.withdraw({from: accounts[5]});
            const bal = await contract.balances(accounts[2]);
            assert.equal(bal.toNumber(), 0);
        })
        
    })
})