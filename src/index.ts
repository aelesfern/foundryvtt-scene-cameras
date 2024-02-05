import { BackgroundController } from './background/background.controller';
import { SceneConfig } from './config/scene.config';
import './core/handlebars.utils';
import { LoggerService } from './core/logger.service';
import { CameraViewsOverride } from './overrides/camera-views.override';
import { CanvasOverride } from './overrides/canvas.override';
import { UiControlsOverride } from './overrides/ui-controls.override';

LoggerService.config({ active: true });
new SceneConfig().init();
new CameraViewsOverride().init();
new UiControlsOverride().init();
new CanvasOverride().init();
BackgroundController.init();
