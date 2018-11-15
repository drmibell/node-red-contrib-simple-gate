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
        // Copy configuration items
        this.controlTopic = config.controlTopic.toLowerCase();
        this.openCmd = config.openCmd.toLowerCase();
        this.closeCmd = config.closeCmd.toLowerCase();
        this.toggleCmd = config.toggleCmd.toLowerCase();
        this.defaultCmd = config.defaultCmd.toLowerCase();
        this.defaultState = config.defaultState.toLowerCase();
        // Save "this" object
        var node = this
        // Display gate status
        var state = node.defaultState;
        if (state === 'open') {
            node.status (openStatus);
        } else {
            node.status (closedStatus);
        }
        // Process inputs
        node.on('input', function(msg) {
            var context = node.context();
            // Copy configuration items (moved)
            var state = context.get('state') || node.defaultState;
           // Change state
            if (msg.topic !== undefined && msg.topic.toLowerCase() === node.controlTopic) {
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
                if (state === 'open') {
                    node.status (openStatus);
                } else {
                    node.status (closedStatus);
                }
                node.send(null);
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
