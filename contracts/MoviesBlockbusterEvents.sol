pragma solidity ^0.5.0;


/// @title This a contract for Hosting Movies on Blockchain for theaters
/// @author Sarang Parikh <sarangparikh22@gmail.com><www.github.com/sarangparikh22>
/// @notice The contract was created specially for the Consensys Developer Bootcamp 
/// @dev All the functions here are safely implemented with TDD

import "./SafeMath.sol";
import "./Pausable.sol";

contract MoviesBlockbusterEvents is Pausable{

    // State Variables
    using SafeMath for uint;
    address payable public owner;
    enum Format {TWOD, THREED}
    
    
    // Events
    event RegisterHall(address hall);
    event AddMovie(uint movieID, address hall, string movieName, string movieIMDB, Format format, uint time, uint seatsLeft, uint price, bool active, bool cancellation);
    event BuyTicket(address buyer, address hall, uint movieID, uint tickets);
    
    // Mappings
    mapping(address =>  bool) public hallMapping;
    mapping(address => uint) public hallMovieCountMapping;
    mapping(address => mapping(uint  => Movie)) public hallMovieCollectionMapping;
    mapping(address => uint) public totalRevenue;

    
    // Structures
    struct Movie{
        uint movieID;
        address hall;
        string movieName;
        string movieIMDB;
        string trailer;
        Format format;
        uint time;
        uint seatsLeft;
        uint price;
        bool active;
        bool cancellation;
        mapping(address => uint) viewers;
    }
    
    // Modifiers
    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }
    modifier onlyRegisteredHalls {
        require(hallMapping[msg.sender] == true);
        _;
    }
    
    modifier isActive(address _hall, uint _movieID) {
        require(hallMovieCollectionMapping[_hall][_movieID].active == true);
        _;
    }
    
    // Constructor
    constructor() public {
        owner = msg.sender;
    }
    
    // Platform Functions - Only Owner can Execute these

    /// @notice Registration of Hall
    /// @dev It can be only called by the owner of the Contract
    /// @param _hall  Address of the Hall
    function registerHall(address _hall) public onlyOwner{
        hallMapping[_hall] = true;
        emit RegisterHall(_hall);
    }
    
    /// @notice Unegistration of Hall
    /// @dev It can be only called by the owner of the Contract
    /// @param _hall  Address of the Hall
    function unregisterHall(address _hall) public onlyOwner{
        hallMapping[_hall]  = false;
    }
    
    // Hall Functions - Only Registered Hall can perform this

    /// @notice Adds Movie into the List
    /// @dev It can be only called by the Registered Halls.
    /// @param _movieName Name of the Movie
    /// @param _movieIMDB IMDB ID of the Movie for getting data
    /// @param _trailer Link of the Trailer of the Movie
    /// @param _format 0 for 2D and 1 for 3D
    /// @param _time Date and Time of the Movie in epoch format
    /// @param _totalSeats Total no. of Seats Allocated
    /// @param _price Price per Ticket
    /// @param _cancellation True for allow refund and False for not allow refund
    function addMovie(string memory _movieName, string memory _movieIMDB, string memory _trailer, uint _format, uint _time, uint _totalSeats, uint _price, bool _cancellation) public whenNotPaused onlyRegisteredHalls{
        hallMovieCountMapping[msg.sender] = hallMovieCountMapping[msg.sender].add(1);
        uint movieID = hallMovieCountMapping[msg.sender];
        Movie storage m = hallMovieCollectionMapping[msg.sender][movieID];
        m.movieID = movieID;
        m.hall = msg.sender;
        m.movieName = _movieName;
        m.movieIMDB = _movieIMDB;
        m.trailer = _trailer;
        m.format = Format(_format);
        m.time = _time;
        m.seatsLeft = _totalSeats;
        m.price = _price;
        m.active = true;
        m.cancellation = _cancellation;
        emit AddMovie(m.movieID, m.hall, m.movieName, m.movieIMDB, m.format, m.time, m.seatsLeft, m.price, m.active, m.cancellation);
    }

    /// @notice Halt booking for Movie
    /// @dev It can be only called by the Registered Halls.
    /// @param _movieID Movie ID by the Particular Hall
    function stopBooking(uint _movieID) public onlyRegisteredHalls {
        Movie storage m = hallMovieCollectionMapping[msg.sender][_movieID];
        m.active = false;
    }
    /// @notice Resume booking for Movie
    /// @dev It can be only called by the Registered Halls.
    /// @param _movieID Movie ID by the Particular Hall
    function startBooking(uint _movieID) public onlyRegisteredHalls {
        Movie storage m = hallMovieCollectionMapping[msg.sender][_movieID];
        m.active = true;
    }

    /// @notice Increase or Decrease the Seat quota
    /// @dev It can be only called by the Registered Halls.
    /// @param _movieID Movie ID by the Particular Hall
    /// @param _tickets No. of Tickets to be set
    function setSeats(uint _movieID, uint _tickets) public onlyRegisteredHalls {
        Movie storage m = hallMovieCollectionMapping[msg.sender][_movieID];
        m.seatsLeft = _tickets;
    }
    /// @notice Verify Viewer by the Theater Authorities
    /// @dev It can be only called by the Registered Halls.
    /// @param _movieID Movie ID by the Particular Hall
    /// @param _viewer Address of the Viewer to be verified
    /// @return number of tickets owned by the viewer
    function verifyViewerByHall(uint _movieID, address _viewer) public view onlyRegisteredHalls returns(uint){
        Movie storage m = hallMovieCollectionMapping[msg.sender][_movieID];
        return m.viewers[_viewer];
    }
    /// @notice Get Earning of the Hall from Bought Tickets
    /// @dev It can be only called by the Registered Halls.
    /// @return Total income they received
    function earning() public view onlyRegisteredHalls returns(uint) {
        return totalRevenue[msg.sender];
    }
    /// @notice Withdraw Money by the Hall
    /// @dev It can be only called by the Registered Halls.
    function withdraw() public whenNotPaused onlyRegisteredHalls {
        msg.sender.transfer(totalRevenue[msg.sender]);
        totalRevenue[msg.sender] = 0;
    }
    
    // User Functions - This can be called by anyone

    /// @notice Buy Ticket for the Movie
    /// @dev The contract should not be paused and Movie should be Active
    /// @param _hall Address of the Movie Hall
    /// @param _movieID Movie ID by the Particular Hall
    /// @param _tickets Number of tickets to be purchased
    function buyTicket(address _hall, uint _movieID, uint _tickets) public payable whenNotPaused isActive(_hall,_movieID) {
        Movie storage m = hallMovieCollectionMapping[_hall][_movieID];
        require(_tickets <= m.seatsLeft);
        require(_tickets * m.price <= msg.value);
        totalRevenue[_hall] = totalRevenue[_hall].add(_tickets.mul(m.price));
        m.seatsLeft = m.seatsLeft.sub(_tickets);
        m.viewers[msg.sender] = m.viewers[msg.sender].add(_tickets);
        emit BuyTicket(msg.sender, _hall, _movieID, _tickets);
    }
    
    /// @notice User Verify their Booking
    /// @dev It can be only called by any user.
    /// @param _hall Address of the Movie Hall
    /// @param _movieID Movie ID by the Particular Hall
    /// @return No. of Tickets the hold
    function verifyViewer(address _hall, uint _movieID) public view returns(uint){
        Movie storage m = hallMovieCollectionMapping[_hall][_movieID];
        return m.viewers[msg.sender];
    }
    
    /// @notice Request Refund
    /// @dev It can be called when contract is not Paused and within Cancellation Period of 5 Mins. Cancellation should also be available for the Movie
    /// @param _hall Address of the Movie Hall
    /// @param _movieID Movie ID by the Particular Hall
    function reqRefund(address _hall, uint _movieID) public whenNotPaused {
        Movie storage m = hallMovieCollectionMapping[_hall][_movieID];
        require(m.time - 5 minutes > now);
        require(m.cancellation == true);
        uint tickets = m.viewers[msg.sender];
        require(tickets > 0);
        m.viewers[msg.sender] = 0;
        msg.sender.transfer(tickets.mul(m.price));
        totalRevenue[_hall] =  totalRevenue[_hall].sub(tickets.mul(m.price));
        m.seatsLeft = m.seatsLeft.add(tickets);
    }
    
}
