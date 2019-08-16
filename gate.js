/**
 * Copyright 2017 M. I. Bell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
module.exports = function(RED) {
    function GateNode(config) {
        RED.nodes.createNode(this,config);
        const openStatus = {fill:"green",shape:"dot",text:"open"};
        const closedStatus = {fill:'red',shape:'ring',text:'closed'};
        var status;
        // Copy configuration items
        this.controlTopic = config.controlTopic.toLowerCase();
        this.openCmd = config.openCmd.toLowerCase();
        this.closeCmd = config.closeCmd.toLowerCase();
        this.toggleCmd = config.toggleCmd.toLowerCase();
        this.defaultCmd = config.defaultCmd.toLowerCase();
        this.defaultState = config.defaultState.toLowerCase();
        this.persist = config.persist;
        // Save "this" object
        var node = this;
        var context = node.context();
        var persist = node.persist;
        var state = context.get('state');
        if (!persist || typeof state === 'undefined') {
            state = node.defaultState;
        }
        context.set('state',state);
        // Initialize status display
        status = (state === 'open') ? openStatus:closedStatus;
        node.status(status);
        // Process inputs
        node.on('input', function(msg) {
            state = context.get('state');
           // Change state
            if (typeof msg.topic === 'string' && msg.topic.toLowerCase() === node.controlTopic) {
                if (typeof msg.payload != 'string'){
                    node.error('Command must be a string');
                    } else {
                    switch (msg.payload.toLowerCase()) {
                        case node.openCmd:
                            state = 'open';
                            break;
                        case node.closeCmd:
                            state = 'closed';
                            break;
                        case node.toggleCmd:
                            if (state === 'open') {
                                state = 'closed';
                            } else {
                                state = 'open';
                            }
                            break;
                        case node.defaultCmd:
                            state = node.defaultState;
                            break;
                        default:
                            node.error('Invalid command');
                            break;
                    }
                    // Save state
                    context.set('state',state);
                    // Show status
                    status = (state === 'open') ? openStatus:closedStatus;
                    node.status(status);
                    node.send(null);
                }
            }
            // Transmit message
            else if (state === 'open') {
                    node.send(msg);
                } else {
                    node.send(null);
            }
        });
    }
    RED.nodes.registerType("gate",GateNode);
}
