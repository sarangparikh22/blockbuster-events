pragma solidity ^0.5.0;

contract Util{
    function uintToString(uint v) public pure returns (string memory) {
        string memory str;
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = byte(uint8(48 + remainder));
        }
        bytes memory s = new bytes(i);
        for (uint j = 0; j < i; j++) {
            s[j] = reversed[i - 1 - j];
        }
        str = string(s);
        if(keccak256(abi.encodePacked(str)) == keccak256("")){
            return "0";
        }
        return str;
    }
    function strConcat(string memory _a, string memory _b, string memory _c, string memory _d) pure public  returns (string memory){
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    bytes memory _bc = bytes(_c);
    bytes memory _bd = bytes(_d);

    string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length);
    bytes memory babcde = bytes(abcde);
    uint k = 0;
    for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
    for (uint i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
    for (uint i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
    for (uint i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
    return string(babcde);
}

function recover(bytes32 hash, bytes memory signature)
        public
        pure
        returns (address)
      {
        bytes32 r;
        bytes32 s;
        uint8 v;
    
        if (signature.length != 65) {
          return (address(0));
        }
    
        assembly {
          r := mload(add(signature, 0x20))
          s := mload(add(signature, 0x40))
          v := byte(0, mload(add(signature, 0x60)))
        }
    
        if (v < 27) {
          v += 27;
        }
    
        if (v != 27 && v != 28) {
          return (address(0));
        } else {
          return ecrecover(hash, v, r, s);
        }
    }
    
    function hash(string memory message) public pure returns(bytes32){
    
        string memory header = "\x19Ethereum Signed Message:\n000000";
    
        uint256 lengthOffset;
        uint256 length;
        assembly {
          // The first word of a string is its length
          length := mload(message)
    
          // The beginning of the base-10 message length in the prefix
          lengthOffset := add(header, 57)
        }
    
        // Maximum length we support
        require(length <= 999999);
    
        // The length of the message's length in base-10
        uint256 lengthLength = 0;
    
        // The divisor to get the next left-most message length digit
        uint256 divisor = 100000;
    
        // Move one digit of the message length to the right at a time
        while (divisor != 0) {
    
          // The place value at the divisor
          uint256 digit = length / divisor;
    
          if (digit == 0) {
            // Skip leading zeros
            if (lengthLength == 0) {
              divisor /= 10;
              continue;
            }
          }
    
          // Found a non-zero digit or non-leading zero digit
          lengthLength++;
    
          // Remove this digit from the message length's current value
          length -= digit * divisor;
    
          // Shift our base-10 divisor over
          divisor /= 10;
          
          // Convert the digit to its ASCII representation (man ascii)
          digit += 0x30;
    
          // Move to the next character and write the digit
          lengthOffset++;
          assembly {
            mstore8(lengthOffset, digit)
          }
        }
    
        // The null string requires exactly 1 zero (unskip 1 leading 0)
        if (lengthLength == 0) {
          lengthLength = 1 + 0x19 + 1;
    
        } else {
          lengthLength += 1 + 0x19;
        }
    
        // Truncate the tailing zeros from the header
        assembly {
          mstore(header, lengthLength)
        }
    
        // Perform the elliptic curve recover operation
        bytes32 check = keccak256(abi.encodePacked(header, message));
        return check;
    }
    function toString(address _addr) public pure returns (string memory) {
      bytes32 value = bytes32(uint256(_addr));
      bytes memory alphabet = "0123456789abcdef";

      bytes memory str = new bytes(42);
      str[0] = '0';
      str[1] = 'x';
      for (uint i = 0; i < 20; i++) {
          str[2+i*2] = alphabet[uint(uint8(value[i + 12] >> 4))];
          str[3+i*2] = alphabet[uint(uint8(value[i + 12] & 0x0f))];
      }
      return string(str);
    }

}