import { filter } from 'rxjs';
import { MODULE_ID } from '../core/constants';
import { HooksStore } from '../core/hooks.store';
import { SceneSettingsService } from '../core/scene-settings.service';
import { DefaultLayoutSettings, SCENE_SETTINGS, SceneSettings } from '../core/scene-settings.types';
import './scene.config.scss';

// TODO: Hay una clase de Foundry llamada SceneConfig, asi que estaria bien cambiar el nombre de esta
export class SceneConfig {
	init() {
		HooksStore.onRenderSceneConfig$.pipe(filter(({ scene }) => !!scene.document.id)).subscribe(async ({ html, sceneConfig, scene }) => {
			this.initializeLayouts(scene.document);
			this.addSceneConfigTab(html);
			await this.addSceneConfigTabContent(html, SceneSettingsService.getAll(scene.document.id!));
			this.activateListeners(html);
			sceneConfig.activateListeners(html);
		});
	}

	activateListeners(html: JQuery<HTMLElement>) {
		this.listenActivateLayoyut(html);
		this.listenNameChange(html);
		this.listenIconChange(html);
		this.listenActiveChange(html);
		html.on('click', '.layouts-settings-form__customBackground-picker', (event) => {
			event.preventDefault();
			const options: any = {};
			options.button = event.currentTarget;
			options.target = options.button.dataset.target;
			options.field = options.button.form[options.target] || null;
			options.wildCard = true;
			options.type = 'html';
			options.render = false;
			options.current = options.field.value;
			const fp = new FilePicker(options);
			fp.extensions = ['.html'];
			return fp.browse('');
		});
		html.on('click', '.layouts-settings-form__customStyles-picker', (event) => {
			event.preventDefault();
			const options: any = {};
			options.button = event.currentTarget;
			options.target = options.button.dataset.target;
			options.field = options.button.form[options.target] || null;
			options.wildCard = true;
			options.type = 'css';
			options.render = false;
			options.current = options.field.value;
			const fp = new FilePicker(options);
			fp.extensions = ['.css'];
			return fp.browse('');
		});
	}

	private initializeLayouts(scene: Scene) {
		const layouts = SceneSettingsService.getAll(scene.id!).layouts;
		if (!!layouts) return;
		SceneSettingsService.set(SCENE_SETTINGS.LAYOUTS, DefaultLayoutSettings, scene.id!);
	}

	private addSceneConfigTab(html: JQuery<HTMLElement>) {
		html.find('nav a:last').after(`<a class="item" data-tab="${MODULE_ID}"><i class="fas fa-camera"></i>Narrative UI</a>`);
	}

	private async addSceneConfigTabContent(html: JQuery<HTMLElement>, sceneSettings: SceneSettings) {
		const mchtml = await renderTemplate(`modules/${MODULE_ID}/templates/scene.config.hbs`, {
			sceneSettings,
			sceneFlags: `flags.${MODULE_ID}`,
		});
		html.find('button>i.fa-save').parent().before(mchtml);
	}

	private listenActivateLayoyut(html: JQuery<HTMLElement>) {
		html.on('click', 'button[data-action="display-layout-settings"]', (event) => {
			event.stopPropagation();
			const selectedIndex = this.getElementIndex(event.target);

			html.find('.layouts-settings-form').each((index, elem) => {
				const selected = index === selectedIndex;
				if (!selected) {
					elem.classList.remove('active');
					return;
				}
				elem.classList.contains('active') ? elem.classList.remove('active') : elem.classList.add('active');
			});
		});

		// html.find('button[data-action="display-layout-settings"]').on('click', (event) => {
		// 	const selectedIndex = this.getElementIndex(event.currentTarget);

		// 	html.find('.layouts-settings-form').each((index, elem) => {
		// 		const selected = index === selectedIndex;
		// 		if (!selected) {
		// 			elem.classList.remove('active');
		// 			return;
		// 		}
		// 		elem.classList.contains('active') ? elem.classList.remove('active') : elem.classList.add('active');
		// 	});
		// });
	}

	private listenNameChange(html: JQuery<HTMLElement>) {
		html.on('input', '.layouts-settings-form__name', (event) => {
			event.stopPropagation();
			const selectedIndex = this.getElementIndex(event.target);
			const button = html.find('button[data-action="display-layout-settings"]').get(selectedIndex);
			const span = button?.querySelector('span');
			if (span) span.textContent = (event.currentTarget as HTMLInputElement).value;
		});
	}

	private listenIconChange(html: JQuery<HTMLElement>) {
		html.on('input', '.layouts-settings-form__icon', (event) => {
			event.stopPropagation();
			const selectedIndex = this.getElementIndex(event.target);
			const videoIcons = html.find('.layouts-settings-accordion__name i');
			const selectedIcon = videoIcons.get(selectedIndex);
			selectedIcon?.setAttribute('class', `fas ${(event.currentTarget as HTMLInputElement).value}`);
		});
	}

	private listenActiveChange(html: JQuery<HTMLElement>) {
		html.on('change', '.layouts-settings-form__active', (event) => {
			event.stopPropagation();
			const selectedIndex = this.getElementIndex(event.target);
			const active = (event.currentTarget as HTMLInputElement).checked;
			const button = html.find('button[data-action="display-layout-settings"]').get(selectedIndex);
			if (active) {
				button?.classList.remove('layouts-settings-accordion__name--inactive');
			} else {
				button?.classList.add('layouts-settings-accordion__name--inactive');
			}
		});
	}

	private getElementIndex(elem: HTMLElement): number {
		return $(elem).parents('.layouts-settings-item').index();
	}
}
