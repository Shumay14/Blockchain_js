pragma solidity 0.5.6;   // (required) 버전 pragma

import "filename";        // (optional) 다른 소스 파일을 임포트

// (optional) 스마트 컨트랙트 정의
contract UserStorage {
   mapping(address => uint) userData;  // 상태 변수

   function set(uint x) public {
      userData[msg.sender] = x;
   function get() public view returns (uint) {
      return userData[msg.sender];
   }
   function getUserData(address user) public view returns (uint) {
      return userData[user];
   }

   bytes32 public hashedValue;
   function hashData(uint value1, bytes32 password) public {
      hashedValue = keccak256(abi.encodePacked(value1, password));
   }
}