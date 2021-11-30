pragma solidity >=0.4.22 <0.9.0;


contract registryDID {

  struct repositoryVC {
      string nameVC;
      string genderVC;
      string ageVC;
  }

  struct  didInfo {
      uint countRepoVC;
      repositoryVC[] repoVC;
  }



  mapping (address => didInfo) ownerVC;

  function registerVC (string memory _nameVC, string memory _genderVC, string memory _ageVC) public {

    ownerVC[msg.sender].countRepoVC++;
    
    ownerVC[msg.sender].repoVC.push(repositoryVC(_nameVC, _genderVC, _ageVC));
  
  }


  function getVC (address _add, uint _num) public view returns(repositoryVC memory) {
   return ownerVC[_add].repoVC[_num];
}
  
}