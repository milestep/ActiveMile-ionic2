#### Application apk: [master/platforms/android/build/outputs/apk](https://github.com/JARVIS-VOVA/ionic-ActiveMile/tree/master/platforms/android/build/outputs/apk)

#### build/run apk
```bash
$ ionic cordova platform add android

$ ionic cordova build android
$ ionic cordova build android --release

$ cd /opt/genymotion && ./genymotion
click on start....

$ ionic cordova run android
```

#### Settings
```bash
$ sudo subl ~/.bashrc
Write down
export JAVA_HOME=/usr/lib/jvm/default-java
export ANDROID_HOME=/home/jarvis/Android/Sdk
```

```bash
echo $JAVA_HOME
echo $ANDROID_HOME
echo $PATH

export PATH=$PATH:/opt/gradle/gradle-3.5/bin
gradle -v

PATH=$PATH:$ANDROID_HOME/tools
PATH=$PATH:$ANDROID_HOME/platform-tools
```