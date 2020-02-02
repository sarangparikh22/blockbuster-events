# Avoiding Common Attacks
The Smart Contracts have developed with Security First in mind.

## Integer Overflow and Underflows
We have used the Safe Math Library by the OpenZeppelin to potentially remove any kind of airthmetic flow based attacks.

## Unstructured Storage Upgradability
We are inclined towards using this strategy as it makes the implementation agnostic. However, we cannot do this with plain truffle and we manually have to change the abi.

## Reentrancy Bug Avoidance
We have used the .transfer() method to transfer ether in and out from the contract and making the subraction first . We have also used Pull Withdrawal Scheme to make it much more robust and secure. We have also implied the Check-Effect-Interaction Scheme.

## Avoiding Loops - DOS Attacks
We have embraced techniques to avoid loop as much as we can and make the contract less vulnerable to DOS Attacks

## Circuit Breaker Pattern
We have used Open Zeppelin Pausable Contract to ensure the Pausability in our contract. Mitigating the impact during an attack on the Smart Contract.

## Tool Based Security Audits
We have used tool like Mythril and MythX to identify and clean vulnerabilities in our Contract. The results were good and no potential threat was revealed thus pointing that contract is safe for usage.

## Verified Code on Rinkeby
We have made our code open sourced and verified on Rinkeby so that people can identify bugs and report to us.
