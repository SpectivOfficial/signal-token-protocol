# Demo

## Getting Started

See "Running the demo" in `README.md`.

## Behind the scenes

The demo webapp is made with a lightweight node.js webserver called `lite-server`. Once the `demo`
command is called, a new tab should open in your default browser to a splash screen called "Signal
Token Protocol Demo".

On load, the webapp will attempt to connect to a local Ethereum net at `localhost:9545` and deploy a
`SignalTokenProtocol` contract to it. It will also grant the first address in your local net
500000 SIG tokens.

Enter an "Amount per Referral". On submit, a campaign is created and stored in the
`SignalTokenProtocol` contract. The contract then queries the `TokenStub` contract and retrieves
 balances for the relevant accounts.

Click the "spectiv" banner. When you do, the campaign you created in the previous step will be
executed by the executor (in this case, the web application) and you should see the address
balances update as the advertiser sends the agreed upon sum of SIG tokens to the publisher.
