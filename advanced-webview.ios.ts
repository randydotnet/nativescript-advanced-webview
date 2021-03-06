/**********************************************************************************
* (c) 2016, Brad Martin.
* Licensed under the MIT license.
*
* Version 1.0.0                                           bradwaynemartin@gmail.com
**********************************************************************************/
("use strict");

import { Color } from "tns-core-modules/color";
import * as utils from "tns-core-modules/utils/utils";

class SFSafariViewControllerDelegateImpl extends NSObject
  implements SFSafariViewControllerDelegate {
  public static ObjCProtocols = [SFSafariViewControllerDelegate];

  private _owner: WeakRef<any>;

  public static initWithOwner(
    owner: WeakRef<any>
  ): SFSafariViewControllerDelegateImpl {
    let delegate = <SFSafariViewControllerDelegateImpl>SFSafariViewControllerDelegateImpl.new();
    delegate._owner = owner;
    return delegate;
  }

  safariViewControllerDidCompleteInitialLoad(
    controller: SFSafariViewController,
    didLoadSuccessfully: boolean
  ): void {
    console.log(
      "Delegate, safariViewControllerDidCompleteInitialLoad: " +
        didLoadSuccessfully
    );
  }

  safariViewControllerDidFinish(controller: SFSafariViewController): void {
    console.log("Delegate, safariViewControllerDidFinish");
  }
}

export function openAdvancedUrl(options: AdvancedWebViewOptions) {
  if (!options.url) {
    throw new Error("No url set in the Advanced WebView Options object.");
  }

  let sfc = SFSafariViewController.alloc().initWithURL(
    NSURL.URLWithString(options.url)
  );

  if (options.toolbarColor) {
    sfc.preferredBarTintColor = new Color(options.toolbarColor).ios;
  }

  if (options.toolbarControlsColor) {
    sfc.preferredControlTintColor = new Color(options.toolbarControlsColor).ios;
  }

  sfc.delegate = SFSafariViewControllerDelegateImpl.initWithOwner(
    new WeakRef(this)
  );

  let app = utils.ios.getter(UIApplication, UIApplication.sharedApplication);

  const animated = true;
  const completionHandler = null;
  app.keyWindow.rootViewController.presentViewControllerAnimatedCompletion(
    sfc,
    animated,
    completionHandler
  );
}

export interface AdvancedWebViewOptions {
  url: string;
  showTitle?: boolean;
  toolbarColor?: string;
  toolbarControlsColor?: string;
}
