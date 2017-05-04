# node-red-contrib-gate
A Node-RED node for controlling message flow.

## How it works

This node will transmit the input message to its output when in the "open" state and block it when "closed." 

The state of the gate is controlled by messages with the user-defined topic <code>Control Topic</code>, which is set when the node is deployed.

When first deployed or after a default command, the gate is in the user-selected state defined by <code>Default State</code>.

Control messages can have values representing commands for open, close, toggle, and default. The (case-insensitive) strings representing these commands can be set by the user when the node is deployed. If a control message is received but not recognized, there is no output or change of state, and the node reports an error.

## Node status
The state of the gate is indicated by a status object (dot), with green = open, red = closed.
