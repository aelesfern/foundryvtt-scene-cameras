// import { ReplaySubject, distinctUntilChanged, map } from 'rxjs';
// import { MODULE_ID } from './constants';
// import { MODULE_SETTINGS, ModuleSettings, ModuleSettingsKey } from './module-settings.types';

// class ModuleSettingsServiceClass {
// 	private get game(): Game {
// 		return game as Game;
// 	}

// 	private store$ = new ReplaySubject<ModuleSettings>(1);
// 	settings$ = this.store$.asObservable().pipe(distinctUntilChanged());
// 	active$ = this.settings$.pipe(
// 		map((settings) => settings.active),
// 		distinctUntilChanged()
// 	);

// 	constructor() {
// 		Hooks.once('ready', () => this.store$.next(this.getAll()));
// 		Hooks.on('updateSetting', (setting: Setting) => this.handleUpdateSetting(setting));
// 	}

// 	get<T extends ModuleSettingsKey>(key: T): ModuleSettings[T] {
// 		return this.game?.settings.get(MODULE_ID, key) as ModuleSettings[T];
// 	}

// 	getAll(): ModuleSettings {
// 		return {
// 			active: this.get(MODULE_SETTINGS.ACTIVE),
// 			gridLayoutSettings: this.get(MODULE_SETTINGS.GRID_LAYOUT_SETTINGS),
// 			leftLayoutSettings: this.get(MODULE_SETTINGS.LEFT_LAYOUT_SETTINGS),
// 			rightLayoutSettings: this.get(MODULE_SETTINGS.RIGHT_LAYOUT_SETTINGS),
// 		};
// 	}

// 	async set<T extends ModuleSettingsKey>(key: T, value: ModuleSettings[T]) {
// 		return await this.game.settings.set(MODULE_ID, key, value);
// 	}

// 	async toggle<T extends ModuleSettingsKey>(key: T) {
// 		const currentValue = this.get(key);
// 		return await this.game.settings.set(MODULE_ID, key, !currentValue);
// 	}

// 	private handleUpdateSetting(setting: Setting): void {
// 		if (!setting.key.startsWith(`${MODULE_ID}.`)) return;
// 		this.store$.next(this.getAll());
// 	}
// }

// export const ModuleSettingsService = new ModuleSettingsServiceClass();
