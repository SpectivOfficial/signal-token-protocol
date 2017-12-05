pragma solidity ^0.4.18;

import './zeppelin/token/MintableToken.sol';


contract SignalToken is MintableToken {
  string public constant name = "Signal Token";
  string public constant symbol = "SIG";
  string public version = "1.0";
  uint8 public constant decimals = 18;

  function SignalToken(address _address) public {
    owner = _address;
  }
}
