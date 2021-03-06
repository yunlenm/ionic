import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Animation, AnimationBuilder, Config, OverlayDismissEventDetail } from '../../index';
import { createThemedClasses, getClassMap } from '../../utils/theme';
import { BACKDROP, OverlayInterface, dismiss, present } from '../../utils/overlays';

import iosEnterAnimation from './animations/ios.enter';
import iosLeaveAnimation from './animations/ios.leave';

import mdEnterAnimation from './animations/md.enter';
import mdLeaveAnimation from './animations/md.leave';

@Component({
  tag: 'ion-loading',
  styleUrls: {
    ios: 'loading.ios.scss',
    md: 'loading.md.scss'
  },
  host: {
    theme: 'loading'
  }
})

export class Loading implements OverlayInterface {

  private durationTimeout: any;

  presented = false;
  animation: Animation;
  color: string;
  mode: string;

  @Element() el: HTMLElement;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: HTMLIonAnimationControllerElement;
  @Prop({ context: 'config' }) config: Config;
  @Prop() overlayId: number;

  /**
   * Animation to use when the loading indicator is presented.
   */
  @Prop() enterAnimation: AnimationBuilder;

  /**
   * Animation to use when the loading indicator is dismissed.
   */
  @Prop() leaveAnimation: AnimationBuilder;

  /**
   * Optional text content to display in the loading indicator.
   */
  @Prop() content: string;

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass: string;

  /**
   * If true, the loading indicator will dismiss when the page changes. Defaults to `false`.
   */
  @Prop() dismissOnPageChange = false;

  /**
   * Number of milliseconds to wait before dismissing the loading indicator.
   */
  @Prop() duration: number;

  /**
   * If true, the loading indicator will be dismissed when the backdrop is clicked. Defaults to `false`.
   */
  @Prop() enableBackdropDismiss = false;

  /**
   * If true, a backdrop will be displayed behind the loading indicator. Defaults to `true`.
   */
  @Prop() showBackdrop = true;

  /**
   * The name of the spinner to display. Possible values are: `"lines"`, `"lines-sm"`, `"dots"`,
   * `"bubbles"`, `"circles"`, `"crescent"`.
   */
  @Prop() spinner: string;

  /**
   * If true, the loading indicator will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  /**
   * If true, the loading indicator will animate. Defaults to `true`.
   */
  @Prop() willAnimate = true;

  /**
   * Emitted after the loading has unloaded.
   */
  @Event() ionLoadingDidUnload: EventEmitter<void>;

  /**
   * Emitted after the loading has loaded.
   */
  @Event() ionLoadingDidLoad: EventEmitter<void>;

  /**
   * Emitted after the loading has presented.
   */
  @Event({eventName: 'ionLoadingDidPresent'}) didPresent: EventEmitter<void>;

  /**
   * Emitted before the loading has presented.
   */
  @Event({eventName: 'ionLoadingWillPresent'}) willPresent: EventEmitter<void>;

  /**
   * Emitted before the loading has dismissed.
   */
  @Event({eventName: 'ionLoadingWillDismiss'}) willDismiss: EventEmitter<OverlayDismissEventDetail>;

  /**
   * Emitted after the loading has dismissed.
   */
  @Event({eventName: 'ionLoadingDidDismiss'}) didDismiss: EventEmitter<OverlayDismissEventDetail>;

  componentWillLoad() {
    if (!this.spinner) {
      this.spinner = this.config.get('loadingSpinner', this.mode === 'ios' ? 'lines' : 'crescent');
    }
  }
  componentDidLoad() {
    this.ionLoadingDidLoad.emit();
  }

  componentDidUnload() {
    this.ionLoadingDidUnload.emit();
  }

  @Listen('ionBackdropTap')
  protected onBackdropTap() {
    this.dismiss(null, BACKDROP);
  }

  /**
   * Present the loading overlay after it has been created.
   */
  @Method()
  present(): Promise<void> {
    return present(this, 'loadingEnter', iosEnterAnimation, mdEnterAnimation, undefined).then(() => {
      if (this.duration > 0) {
        this.durationTimeout = setTimeout(() => this.dismiss(), this.duration + 10);
      }
    });
  }

  /**
   * Dismiss the loading overlay after it has been presented.
   */
  @Method()
  dismiss(data?: any, role?: string): Promise<void> {
    if (this.durationTimeout) {
      clearTimeout(this.durationTimeout);
    }
    return dismiss(this, data, role, 'loadingLeave', iosLeaveAnimation, mdLeaveAnimation, undefined);
  }

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'loading-translucent') : {};

    return {
      style: {
        zIndex: 20000 + this.overlayId,
      },
      class: {
        ...themedClasses,
        ...getClassMap(this.cssClass)
      }
    };
  }

  render() {
    return [
      <ion-backdrop visible={this.showBackdrop} tappable={false} />,
      <div class='loading-wrapper' role='dialog'>

        { this.spinner !== 'hide' &&
        <div class='loading-spinner'>
          <ion-spinner name={this.spinner}></ion-spinner>
        </div>}

        { this.content && <div class='loading-content'>{this.content}</div>}
      </div>
    ];
  }
}

export interface LoadingOptions {
  spinner?: string;
  content?: string;
  cssClass?: string;
  showBackdrop?: boolean;
  dismissOnPageChange?: boolean;
  duration?: number;
  translucent?: boolean;
}
