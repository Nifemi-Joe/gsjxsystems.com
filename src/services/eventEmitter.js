// src/services/eventEmitter.js

class EventEmitter {
	constructor() {
		this.events = {};
	}

	// Subscribe to an event
	on(event, listener) {
		if (typeof this.events[event] !== 'object') {
			this.events[event] = [];
		}
		this.events[event].push(listener);
		// Return a function to remove the listener
		return () => this.removeListener(event, listener);
	}

	// Remove a listener
	removeListener(event, listener) {
		if (typeof this.events[event] === 'object') {
			const idx = this.events[event].indexOf(listener);
			if (idx > -1) this.events[event].splice(idx, 1);
		}
	}

	// Emit an event
	emit(event, ...args) {
		if (typeof this.events[event] === 'object') {
			// Create a copy of listeners to prevent mutation during iteration
			[...this.events[event]].forEach(listener => listener.apply(this, args));
		}
	}

	// Subscribe to an event only once
	once(event, listener) {
		const remove = this.on(event, (...args) => {
			remove();
			listener.apply(this, args);
		});
	}
}

const eventEmitter = new EventEmitter();
export default eventEmitter;
