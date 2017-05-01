module.exports = function(RED) {
    function GateNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {
			var context = this.context();
			this.controlTopic = config.controlTopic.toLowerCase();
			this.openCmd = config.openCmd.toLowerCase();
			this.closeCmd = config.closeCmd.toLowerCase();
			this.toggleCmd = config.toggleCmd.toLowerCase();
			this.defaultCmd = config.defaultCmd.toLowerCase();
			this.defaultState = config.defaultState.toLowerCase();
			var openStatus = {fill:"green",shape:"dot"};
			var closedStatus = {fill:"red",shape:"dot"};
			var state = context.get('state') || this.defaultState;
			var status;
			if (state == 'open') {
			    status = openStatus;
			} else {
			    status = closedStatus;
			}
			node.status(status);
			if (msg.topic.toLowerCase() == this.controlTopic) {
				switch (msg.payload.toLowerCase()) {
					case this.openCmd:
						state = 'open';
						status = openStatus;
						break;
					case this.closeCmd:
						state = 'closed';
						status = closedStatus;
						break;
					case this.toggleCmd:
						if (state == 'open') {
							state = 'closed';
							status = closedStatus;
						} else {
							state = 'open';
							status = openStatus;
						}
						break;
					case this.defaultCmd:
						state = this.defaultState;
						if (state == 'open') {
							status = openStatus;
						} else {
							status = closedStatus;
						}
						break;
					default:
						node.error('Invalid command');
						break;
				}
				context.set('state',state);
				node.status(status);
				node.send(null);
			}
			else if (state == 'open') {
					node.send(msg);
				} else {
					node.send(null);
			}
					});
				}
				RED.nodes.registerType("gate",GateNode);
			}
