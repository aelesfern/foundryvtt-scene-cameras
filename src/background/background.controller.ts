import { merge, throttleTime } from 'rxjs';
import { MODULE_ID } from '../core/constants';
import { HooksStore } from '../core/hooks.store';
import { SceneSettingsService } from '../core/scene-settings.service';
import './background.controller.scss';

export class BackgroundController extends Application {
	private static DEFAULT_BACKGROUND = `modules/${MODULE_ID}/templates/background.controller.hbs`;

	static init() {
		let lastBackground: any;
		merge(HooksStore.onRenderSceneNavigation$, SceneSettingsService.currentSceneFlags$)
			.pipe(throttleTime(100))
			.subscribe(() => {
				if (!!lastBackground) {
					lastBackground.close();
				}
				lastBackground = new BackgroundController();
				lastBackground.render(true);
				this.addCustomStyles();
			});
	}

	static override get defaultOptions() {
		const options = super.defaultOptions;
		options.template = SceneSettingsService.getCurrentLayout()?.customBackground || this.DEFAULT_BACKGROUND;
		options.popOut = false;
		return options;
	}

	override getData(_options?: Partial<ApplicationOptions> | undefined): object | Promise<object> {
		const currentLayout = SceneSettingsService.getCurrentLayout();
		const data: any = {};
		if (currentLayout?.backgroundImage) {
			data.backgroundImg = currentLayout?.backgroundImage;
			if (!data.backgroundImg.startsWith('http:') && !data.backgroundImg.startsWith('https:')) {
				data.backgroundImg = `/${data.backgroundImg}`;
			}
		} else {
			data.backgroundImg = '/modules/narrative-ui/assets/sample-background-1.png';
		}
		return data;
	}

	static addCustomStyles() {
		const customStyles = SceneSettingsService.getCurrentLayout()?.customStyles;
		document.getElementById(`${MODULE_ID}-custom-styles`)?.remove();
		if (!customStyles) return;
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.id = `${MODULE_ID}-custom-styles`;
		link.href = customStyles;
		document.head.appendChild(link);
	}
}
