# TokenStub

TokenStub is the smart contract used to mock the most simple functionality of an ERC20 token - the
ability to transfer value and check balances.

## address: owner

`owner` is a publicly accessible `address` used to store the account with ownership privelege.

## mapping: balances

`balances` is a mapping of `address` to `uint` used to store the balances of accounts using
`TokenStub`.

## modifier: isOwner

`isOwner` is a modifier that only allows the `owner` of `TokenStub` to execute its modified
function.

## modifier: atLeast

`atLeast` is a modifier that takes as argument an `address` and `uint` and only executes its
modified function if the `balance` of the `address` argument is exceeds or equals the `uint`
argument.

## constructor: TokenStub [public]

`TokenStub` is a constructor takes as argument an `address` and sets its `owner` to it, and gives
the owner a balance of 1000000.

## function: getBalance [public view returns uint]

`getBalance` is a function that takes as argument an `address` and returns the balance of the
address from the `balances` mapping.

## function: executeTransfer [public *isOwner* returns bool]

`executeTransfer` is a function that is modified by the `isOwner` modifier. It takes as argument
a sender `address`, a recipient `address`, and a `uint`. It returns a call to the `transfer`
function called with those same arguments.

## function: transfer [private *atLeast* returns bool]

`transfer` is a function that is modified by the `atLeast` modifier. It takes as argument a sender
`address`, a recipient `address`, and a `uint`. If th balance of the sender allows, it transfers
balance from the sender to the recipient.
