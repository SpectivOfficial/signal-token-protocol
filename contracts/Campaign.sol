pragma solidity ^0.4.4;

import './Spectiv.sol';


contract Campaign {
  address advertiser;
  address publisher;
  uint amount;

  function Campaign(address _publisher, uint _amount) {
    advertiser = msg.sender;
    publisher = _publisher;
    amount = _amount;
  }

  function execute() public {
    initializeTransfer();
  }

  function initializeTransfer() private {
    // Calls 'Spectiv.transfer'
  }
}
