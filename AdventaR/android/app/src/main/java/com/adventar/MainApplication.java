package com.adventar;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.auth0.react.A0Auth0Package;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.viromedia.bridge.ReactViroPackage;
import com.facebook.soloader.SoLoader;
import com.RNFetchBlob.RNFetchBlobPackage; 

import java.util.Arrays;
import java.util.List;

import com.joshblour.reactnativeheading.ReactNativeHeadingPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new ReactNativeHeadingPackage(),
        new MainReactPackage(),
        new RNFetchBlobPackage(),
        new A0Auth0Package(),
        new ReactViroPackage(ReactViroPackage.ViroPlatform.valueOf(BuildConfig.VR_PLATFORM)),
        new ImageResizerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
