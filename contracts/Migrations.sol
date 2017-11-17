pragma solidity ^0.4.4;


contract Migrations {
  address public owner;
  uint public last_completed_migration;

  function Migrations() {
    owner = msg.sender;
  }

  modifier restricted() {
    if (msg.sender == owner) {
      _;
    }
  }

  function setCompleted(uint completed) restricted {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
