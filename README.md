# node-red-contrib-gate
A Node-RED node for controlling message flow.

## Install

Run the following command in your node-RED user directory (typically `~/.node-red`):

    npm install node-red-contrib-gate

## Usage

The `gate` node will transmit the input message to its output when in the `open` state and block it when `closed`.

Messages with the user-defined topic `Control Topic` (set when the node is deployed) are not passed through but are used to control the state of the gate.

Control messages can have values representing commands for `open`, `close`, `toggle`, and `default`. The (case-insensitive) strings representing these commands are set by the user when the node is deployed. If a control message is received but not recognized, there is no output or change of state, and the node reports an error.

When first deployed or after a `default` command, the gate is in the user-selected state defined by `Default State`.


## Node status
The state of the gate is indicated by a status object (dot) and text, either green/`open` or red/`closed`.
