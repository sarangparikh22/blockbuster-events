pragma solidity ^0.5.0;

/// @title This a contract for Hosting Events on Blockchain with Staking
/// @author Sarang Parikh <sarangparikh22@gmail.com><www.github.com/sarangparikh22>
/// @notice The contract was created specially for the Consensys Developer Bootcamp 
/// @dev All the functions here are safely implemented with TDD

contract Ownable {
  address public owner;
  
  constructor() public {
      owner = msg.sender;
  }
  modifier onlyOwner() {
    if (msg.sender == owner)
      _;
  }

  function transferOwnership(address newOwner) public onlyOwner {
    if (newOwner != address(0)) owner = newOwner;
  }

}

contract EventsBlockbusterEvents is Ownable{
    
    // State Variables
    uint public eventCount;
    mapping(uint => Event)  eventMapping;
    mapping(address => uint) public balances;
    mapping(address => mapping(uint => bool)) stakesMapping;
    
    event Registered(uint eventId, string eventName, address buyer, string location);

    struct Event {
        uint eventID;
        address payable eventOwner;
        string eventName;
        string eventImg;
        string eventDesc;
        string eventLoc;
        uint eventDate;
        uint seats;
        uint stake;
        uint price;
        uint stakeRev;
        uint priceRev;
        bool active;
        bool finish;
        mapping(address => bool) attendees;
        address[] attended;
    }
    // Modifiers
    modifier eventOwnerOnly(uint _eventID) {
        Event storage e = eventMapping[_eventID];
        require(e.eventOwner == msg.sender);
        _;
    }
    // Event Manager Functions

    /// @notice Create Event for Hosting
    /// @dev It can be only called by anyone.
    /// @param _eventName Name of the Event
    /// @param _eventImg IPFS Hash of the Image
    /// @param _eventDesc Description of the Event
    /// @param _eventLoc Address of the Event
    /// @param _eventDate Date and Time of the Event in epoch format
    /// @param _eventSeats Total no. of Seats Allocated
    /// @param _stake Amount to be Staked for Registration
    /// @param _price Price per Ticket
    function createEvent(string memory _eventName, string memory _eventImg, string memory _eventDesc, string memory _eventLoc, uint _eventDate, uint _eventSeats,uint _stake, uint _price) public {
        eventCount++;
        Event storage e = eventMapping[eventCount];
        require((_stake > 0 && _price == 0) || (_price > 0 && _stake == 0) || (_stake == 0 && _price == 0));
        e.eventID = eventCount;
        e.eventOwner = msg.sender;
        e.eventName = _eventName;
        e.eventImg = _eventImg;
        e.eventLoc = _eventLoc;
        e.eventDate = _eventDate;
        e.seats = _eventSeats;
        e.eventDesc = _eventDesc;
        e.stake = _stake;
        e.price = _price;
        e.active = true;
    }
    
    /// @notice Get Details of the Event
    /// @dev It can be only called by the Registered Halls.
    /// @param _eventCount The Event ID whoose details has to be viewed
    /// @return Event ID
    /// @return Event Owner
    /// @return Event Owner
    /// @return Event Description
    /// @return Event Image IPFS Hash
    /// @return Event Location Physical Address
    /// @return Date and Time of the Event in epoch format
    /// @return Seats Left
    /// @return Stake Amount
    /// @return Price per Ticket
    function getEventDetails(uint _eventCount) public view returns(uint, address, string memory, string memory, string memory, string memory, uint, uint, uint, uint){
       Event storage e = eventMapping[_eventCount];
       return (e.eventID, e.eventOwner, e.eventName, e.eventDesc, e.eventImg, e.eventLoc, e.eventDate, e.seats, e.stake, e.price);
    }
    
    /// @notice Activate Event
    /// @dev It can be only called by the Event Owners.
    /// @param _eventID The Event ID
    function activateEvent(uint _eventID) public eventOwnerOnly(_eventID) {
        Event storage e = eventMapping[_eventID];
        e.active = true;
    }

    /// @notice Deactivate Event
    /// @dev It can be only called by the Event Owners.
    /// @param _eventID The Event ID
    function deactivateEvent(uint _eventID) public eventOwnerOnly(_eventID) {
        Event storage e = eventMapping[_eventID];
        e.active = false;
    }
    
    /// @notice Finish or End Event
    /// @dev It can be only called by the Event Owners.
    /// @param _eventID The Event ID
    function finishEvent(uint _eventID) public eventOwnerOnly(_eventID) {
        Event storage e = eventMapping[_eventID];
        require(e.finish == false);
        e.active = false;
        e.finish = true;
    }

    /// @notice Querying for Event Finished Status
    /// @dev It can be only called by anyone.
    /// @param _eventID The Event ID
    /// @return True for Event Finished and False for Event not Finished
    function isEventFinished(uint _eventID) public view returns(bool){
            Event memory e = eventMapping[_eventID];
            return e.finish;
    }

    /// @notice Querying for Event Active Status
    /// @dev It can be only called by anyone.
    /// @param _eventID The Event ID
    /// @return True for Event Active and False for Event not Active
    function isEventActive(uint _eventID) public view returns(bool){
            Event memory e = eventMapping[_eventID];
            return e.active;
    }

    /// @notice Mark Attendance of the Participants
    /// @dev It can be only called by Event Owners Only and Attendee should have bought ticket
    /// @param _eventID The Event ID
    /// @param _attendee Address of the Person who Attended the Meetup
    function eventAttendance(uint _eventID, address _attendee) public eventOwnerOnly(_eventID) {
        Event storage e = eventMapping[_eventID];
        require(e.finish == false);
        require(e.attendees[_attendee] == true);
        e.attended.push(_attendee);
    }

    /// @notice Withdraw Money from Event
    /// @dev It can be only called by Event Owner. The event should be finished before calling this.
    /// @param _eventID The Event ID
    function withdrawFromEvent(uint _eventID) public eventOwnerOnly(_eventID) {
        Event storage e = eventMapping[_eventID];
        require(e.finish == true);
        e.eventOwner.transfer(e.priceRev);
        e.priceRev = 0;
    }


    /// @notice Querying for Attendance
    /// @dev It can be only called by anyone.
    /// @param _eventID The Event ID
    /// @param _a Address of the Attendee
    /// @return True if they have ticket and False if they don't have ticket
    function verifyReg(uint _eventID, address _a) public view returns(bool){
      Event storage e = eventMapping[_eventID];
      return e.attendees[_a];
    }

    /// @notice Querying for Event Income
    /// @dev It can be only called by anyone.
    /// @param _eventID The Event ID
    /// @return Income of the event in wei
    function getEventIncome(uint _eventID) public view returns(uint) {
      Event storage e = eventMapping[_eventID];
      return e.priceRev;
    }

    /// @notice Register for Event with Price
    /// @dev It can be only called by anyone and is Payable
    /// @param _eventID The Event ID
    function register(uint _eventID) public payable {
        Event storage e = eventMapping[_eventID];
        require(e.finish == false);
        require(e.active == true);
        require(e.price <= msg.value);
        require(e.stake == 0);
        require(e.attendees[msg.sender] == false);
        require(e.seats >= 1);
        e.seats -= 1;
        e.priceRev += msg.value;
        e.attendees[msg.sender] = true;
        emit Registered(e.eventID, e.eventName, msg.sender, e.eventLoc);
    }

    /// @notice Register for Event with Stake
    /// @dev It can be only called by anyone and is Payable
    /// @param _eventID The Event ID
    function stakeAndRegister(uint _eventID) public payable {
        Event storage e = eventMapping[_eventID];
        require(e.finish == false);
        require(e.active == true);
        require(e.stake <= msg.value);
        require(e.price == 0);
        require(e.attendees[msg.sender] == false);
        require(e.seats >= 1);
        e.seats -= 1;
        e.stakeRev += msg.value;
        e.attendees[msg.sender] = true;
        emit Registered(e.eventID, e.eventName, msg.sender, e.eventLoc);
    }
    
    /// @notice Divide and Distribute Stakes
    /// @dev It can be only called by Event Owner after event is finished
    /// @param _eventID The Event ID
    function retStake(uint _eventID) public eventOwnerOnly(_eventID) {
        Event storage e = eventMapping[_eventID];
        require(e.finish == true);
        require(e.stakeRev > 0);
        uint toDistribute = (e.stakeRev - (e.stake * e.attended.length)) / e.attended.length;
        for(uint i = 0; i<e.attended.length;i++){
            balances[e.attended[i]] += e.stake + toDistribute;
        }
        e.stakeRev = 0;
    }
    
    /// @notice Withdraw Stake Money
    /// @dev It can be only called by anyone.
    function withdraw() public {
        msg.sender.transfer(balances[msg.sender]);
        balances[msg.sender] = 0;
    }
    
}