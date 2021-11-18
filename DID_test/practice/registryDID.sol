pragma solidity >=0.4.22 <0.9.0;

contract registryDID {

  address owner;
  uint owner_id;

  address[] public dids;

  mapping(address => getDID) public registeredDid;

  // get enhashed data
  struct getDID {
      bytes32 encryptName;
      bytes32 encryptAge;
      bytes32 encryptMender;
      bytes32 encryptMarried;  
  }
  
  function setAddress (address _address) public {      
        dids.push(_address);
        owner_id = dids.length;
  }



}