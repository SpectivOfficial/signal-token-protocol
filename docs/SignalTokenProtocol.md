# SignalTokenProtocol

SignalTokenProtocol is the smart contract used as an MVP for the Signal smart contract advertising
platform.

## Struct: Campaign

`Campaign` is a struct with an advertiser `address`, a publisher `address`, an executor `address`,
and a `uint` amount. It is used to store values relating to an advertising campaign.

## mapping: campaigns

`campaigns` is a `mapping` of `uint` to `Campaign` used to store campaigns created by users.

## uint: numberOfCampaigns

`numberOfCampaigns` is a `uint` used to store the current index and length of the `campaigns`
mapping.

## TokenStub: tokenStub

`tokenStub` a link to the `TokenStub` contract consumed by this protocol to execute transfers.

## modifier: isExecutor

`isExecutor` is a modifier that takes as argument a `uint` and only executes its modified function
if the function caller is the executor of the campaign with the id of the `uint` argument.

## contructor: SignalTokenProtocol [public]

`SignalTokenProtocol` is a contructor that takes no arguments, sets the `numberOfCmapaigns` to 0,
and creates a new `TokenStub` owned by the protocol contract..

## function: createCampaign [public returns uint]

`createCampaign` is a function that takes as argument an advertiser `address`, a publisher
`address`, an executor `address`, and a `uint`. It creates a new `Campaign` with those arguments and
stores it in the `campaigns` `mapping`.


## function: getCampaign [public view returns *complex*]

`getCampaign` is a function that takes as argument a `uint` campaignId and returns an
array of that campaign's contents.

## function: executeCampaign [public *isExecutor* returns bool]

`executeCampaign` is a function modified by `isExecutor` that takes as argument a `uint` campaignId
and calls `executeTransaction` with the campaign argument if the function caller is the executor of
the campaign.

## function: executeTransfer [private returns bool]

`executeTransfer` is a function that calls `executeTransfer` on `tokenStub`.
