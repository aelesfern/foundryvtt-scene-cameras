import { MODULE_ID } from './constants';

class LoggerServiceClass {
	private isActive = false;

	// TODO: Get from app config
	config(config: { active: boolean }) {
		this.isActive = config.active;
	}

	log(...args: any[]) {
		if (!this.isActive) return;
		console.log(MODULE_ID, '|', ...args);
	}
}

export const LoggerService = new LoggerServiceClass();
