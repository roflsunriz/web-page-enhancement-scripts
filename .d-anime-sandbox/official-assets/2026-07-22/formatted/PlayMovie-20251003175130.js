/** 視聴ボタン押下フラグ(二重押下抑止用) */
var viewBtnFlag = false;

/** CFアプリ,iOSアプリ用Chromecast接続状態 */
var isCastAvailable = false;

/** 途中から再生用再生開始位置(～h～m～s～ms) */
var startPosition = null;

/** リクエストパラメータ 途中から再生用話ID */
var paramPartId = null;

/** リクエストパラメータ 途中から再生用再生開始位置(～h～m～s～ms) */
var paramStartPosition = null;

/**
 * 再生ボタン押下処理
 */
$(function () {
  $(".AS_StartPlay").on("click", function () {
    // 話ID
    var partId = $(this).data("partid");
    // 再生画質
    var defaultPlay = $(this).data("defaultplay");
    // 再生区分
    var viewType = $(this).data("viewtype");
    // 途中から再生用再生開始位置
    var position = $(this).data("position");

    // PCの場合ポップアップで再生を開始する
    if (getCookieParam("navi_device") == "61") {
      // 途中から再生用再生開始位置
      startPosition = position;

      playMovie(defaultPlay, partId);
      return;

      // Phoneの場合動画再生処理を開始する
    } else {
      contentPlay(partId, defaultPlay, viewType, position);
    }
  });
});

/**
 * 動画再生処理
 */
function contentPlay(partId, defaultPlay, viewType, position) {
  // 動画再生共通処理を実行
  playExec(partId, defaultPlay, viewType, position, null, null, false); // 新いちおし用フラグ追加 (false)
}

/**
 * プレイリスト再生処理
 */
function playlistPlay(playlistId, partId, playlistIndex, defaultPlay) {
  // 動画再生共通処理を実行
  playExec(partId, defaultPlay, "2", null, playlistId, playlistIndex, false); // 新いちおし用フラグ追加 (false)
}

/**
 * 新いちおし用動画再生処理
 */
function contentPlayIchioshi(partId, defaultPlay, viewType, position) {
  // 動画再生共通処理を実行
  // 新いちおし用フラグを true で呼び出し
  playExec(partId, defaultPlay, viewType, position, null, null, true);
}

function playExec(
  partId,
  defaultPlay,
  viewType,
  position,
  playlistId,
  playlistIndex,
  ichioshiFlg,
) {
  // 途中から再生用再生開始位置
  startPosition = position;

  // PCの場合ポップアップで再生を開始する
  if (!ichioshiFlg && getCookieParam("navi_device") == "61") {
    playMovie(defaultPlay, partId, playlistId, playlistIndex);
    return;

    // Phoneの場合動画再生パラメータを取得して再生を開始する
  } else {
    // 二重押下抑止(DL以外)
    if (viewType !== "1" && !checkView()) {
      return false;
    }

    // 端末情報取得
    var termInfo = getTermInfo();
    // 端末コード
    var termCode = "";
    // 端末名
    var termName = "";
    if (termInfo != null) {
      termCode = termInfo.termCode;
      termName = termInfo.termName;
    }

    // いちおしかつPhoneブラウザの場合
    if (
      ichioshiFlg &&
      (termCode === "11" || termCode === "21" || termCode === "31")
    ) {
      // いちおし再生
      playMovieIchioshi(defaultPlay, partId, playlistId, playlistIndex);
      return;
    }

    // 再生画質が未指定の場合空文字とする(APIで画質を決定する)
    if (defaultPlay == null) {
      defaultPlay = "";
    }

    // 再生区分が未指定の場合ストリーミング再生とする
    if (viewType == null || viewType == "") {
      viewType = "2";
    }

    // メディアプレーヤーのバージョン
    var mpVersion = "";

    // dマーケットアプリの場合メディアプレーヤーのバージョンを取得
    if (termCode == "12" || termCode == "42") {
      mpVersion = getMPVersion(termCode, termName);
    }

    // CFアプリか？
    if (termCode == "22") {
      try {
        // Chromecast接続状態確認
        var deviceId = dAnimeStoreJk.isCastAvailable();
        if (deviceId != null && deviceId != "" && deviceId != "NULL") {
          isCastAvailable = true;
        }
      } catch (ex) {}
    }

    // 限定話以外(通常話)か？
    var goodsCd = null;
    if (!isLimitedContents(partId)) {
      // アニメストア配下へのアクセス、かつ、スゴ得会員か？
      if (
        location.pathname.indexOf("/animestore/") === 0 &&
        getCookieParam("sugotoku_member_status") === "1"
      ) {
        // 販売条件Cを取得
        goodsCd = getGoodsCd(partId);
        // 通常無料話以外か？
        if (goodsCd !== "2" && goodsCd !== "3") {
          // アップセルページへ
          location.href = "/sugotoku/reg";
          return;
        }
      }
    }

    // ストリーミング再生かつChromecast接続中の場合再生区分を置き換える
    if (viewType == "2" && isCastAvailable) {
      viewType = "4";
    }

    // dAnimeStoreQualitySettingオブジェクトが存在しない場合は処理を終了する
    if (typeof dAnimeStoreQualitySetting === "undefined") {
      return;
    } else {
      // アプリの場合は画質が設定されているかチェックする
      if (
        getCookieParam("navi_device") == "22" ||
        getCookieParam("navi_device") == "32"
      ) {
        // downloadとstreaming両方とも画質が設定されていない場合は処理を終了する
        if (
          dAnimeStoreQualitySetting.download == null ||
          dAnimeStoreQualitySetting.streaming == null
        ) {
          console.log(
            "streaming:" +
              dAnimeStoreQualitySetting.streaming +
              " download:" +
              dAnimeStoreQualitySetting.download,
          );
          return;
        }
      }

      // 再生区分が1:ダウンロード再生の場合はdAnimeStoreQualitySetting.downloadを再生要求画質として設定する
      if (viewType == "1") {
        if (
          typeof dAnimeStoreQualitySetting.download !== "undefined" &&
          dAnimeStoreQualitySetting.download != null
        ) {
          defaultPlay = dAnimeStoreQualitySetting.download;
        }
        // 上記以外はdAnimeStoreQualitySetting.streamingを再生要求画質として設定する
      } else {
        if (
          typeof dAnimeStoreQualitySetting.streaming !== "undefined" &&
          dAnimeStoreQualitySetting.streaming != null
        ) {
          defaultPlay = dAnimeStoreQualitySetting.streaming;
        }
      }
    }

    // 動画再生用パラメータ取得
    var playParam = getPlayParam(
      partId,
      defaultPlay,
      viewType,
      mpVersion,
      playlistId,
      playlistIndex,
    );

    // 再生不可
    if (playParam == null || playParam.resultCd != "00") {
      resultError(playParam, partId, {
        playlistId: playlistId,
        partId: partId,
        playlistIndex: playlistIndex,
        bitrate: defaultPlay,
        viewType: viewType,
        position: position,
      });
      return;
    }

    // 正常の場合
    var data = playParam.data;
    var appType = data.appType;

    // ストアログを送信する
    sendStoreLog(data.partId, goodsCd);

    // 視聴済み表示し、再生を開始する
    $("#episodePartId" + data.partId).addClass("watched");

    // 途中から再生用再生開始位置書き換え
    // Phoneでフリーページから作品個別へ遷移し途中から再生の場合、作品個別の初期処理(contentDetail.js)でパラメータの値を設定済み
    if (paramStartPosition != null) {
      startPosition = paramStartPosition;
    }
    // 途中から再生用再生開始位置が設定されている場合ミリ秒に変換
    if (startPosition != null) {
      startPosition = changeStartPositionToMillisecond(startPosition);
    }

    // dマーケットアプリ(ドングル,TVBoxを含む)
    if (appType == "01" || appType == "02" || appType == "03") {
      // 端末のマルチデバイス設定をtrueに設定
      settingMultiDeviceEnabled(data.serviceId);

      // ダウンロード再生(ドングル,TVBoxはダウンロード再生なし)
      if (viewType == "1") {
        playDMarket_DL(data);
        // ストリーミング再生
      } else {
        playDMarket_ST(data, appType);
      }
      // CFアプリ
    } else if (appType == "04") {
      // ダウンロード再生
      if (viewType == "1") {
        playCF_DL(data);
        // ストリーミング再生
      } else {
        playCF_ST(data);
      }
      // iOSアプリ
    } else if (appType == "05" || appType == "06" || appType == "07") {
      // ダウンロード再生
      if (viewType == "1") {
        playIOS_DL(data);
        // ストリーミング再生
      } else {
        // アプリバージョンによって異なる
        // iOSアプリ
        if (appType == "05") {
          playIOS_ST(data);
          // iOSアプリ(旧)
          // 2015/11/11現在 当アプリは存在しない
        } else if (appType == "06") {
          playIOS_ST_old(data);
          // iOSアプリ(デモ)
        } else {
          playIOS_ST_demo(data);
        }
      }
      // CFアプリ(AndroidDash対応)
    } else if (appType == "11" || appType == "12") {
      // ダウンロード再生
      if (viewType == "1") {
        playCF_DL_DASH(data);
        // ストリーミング再生
      } else {
        playCF_ST_DASH(data);
      }
      // iOSアプリ(FairPalay対応)
    } else if (appType == "13") {
      // ダウンロード再生
      if (viewType == "1") {
        playIOS_DL_FairPlay(data);
        // ストリーミング再生
      } else {
        playIOS_ST_FairPlay(data);
      }
      // Android(FullHD対応)
    } else if (appType == "14") {
      // ダウンロード再生
      if (viewType == "1") {
        playCF_DL_FullHd(data);
        // ストリーミング再生
      } else {
        playCF_ST_FullHd(data);
      }
      // iOS(FullHD対応)
    } else if (appType == "15") {
      // ダウンロード再生
      if (viewType == "1") {
        playIOS_DL_FullHd(data);
        // ストリーミング再生
      } else {
        playIOS_ST_FullHd(data);
      }
      // Android(マンガ対応)
    } else if (appType == "16") {
      // ダウンロード再生
      if (viewType == "1") {
        playCF_DL_Comic(data);
        // ストリーミング再生
      } else {
        playCF_ST_Comic(data);
      }
      // iOS(マンガ対応)
    } else if (appType == "17") {
      // ダウンロード再生
      if (viewType == "1") {
        playIOS_DL_Comic(data);
        // ストリーミング再生
      } else {
        playIOS_ST_Comic(data);
      }
    } else {
      window.COMMON.showToast("動画再生に失敗しました");
      return;
    }

    // ストリーミング再生の場合
    if (viewType != "1") {
      // 途中から再生用再生開始位置を初期化
      startPosition = null;
      paramStartPosition = null;
    }
  }
}

/**
 * dマーケットアプリ用ダウンロード再生処理
 * ドングル,TVBoxはダウンロード再生なし
 */
function playDMarket_DL(data) {
  // defaultPlay
  var defaultPlay = data.defaultPlay;
  // HD画質の場合1とする
  if (defaultPlay == 4) {
    defaultPlay = 1;
  }

  var parentTypes = ["MOVIE"];
  var subDirs = ["animestore"];
  var fileNames = [data.movieFilename];
  var licenseChecks = [false];

  /* ファイル存在有無判定を利用してファイルパスを取得 */
  if (
    typeof storeJk !== "undefined" &&
    typeof storeJk.checkLocalFile === "function"
  ) {
    var jsonResult = storeJk.checkLocalFile(
      parentTypes,
      subDirs,
      fileNames,
      licenseChecks,
    );
  } else {
    return;
  }

  if (jsonResult == null) {
    return;
  }
  var obj = eval("(" + jsonResult + ")");
  var filePath = obj.results[0].filePath;

  // resumeFlagが1の時のみレジューム情報の保存を行なう。
  if (data.resumeFlag == "1") {
    /* レジューム情報保存 */
    registResumeInfo(filePath, data);
  }

  var jsonParam = {
    group: {
      title: data.title,
      saveType: "FORCE",
      toastFlag: true,
      content: [
        {
          iconType: "MOVIE",
          license: {
            webInitiatorUri: data.webInitiatorUri,
          },
          download: {
            saveParentType: "MOVIE",
            saveSubDir: "animestore",
            fileName: data.movieFilename,
            contentUri:
              data.contentUri[defaultPlay - 1] +
              "?usr_token=" +
              data.viewOneTimeToken,
            contentUrls: data.contentUrls,
            contentLength: parseInt(data.movieFileSize),
            scanFlag: true,
          },
          successNotifyType: "INTENT",
          successNotifyAction: "com.nttdocomo.android.mediaplayer.PLAY_VIEW",
          successNotifyParam:
            "LAUNCH_TYPE=PLAY&PATH=" + filePath + "&START_STATUS=RESUME",
          detailNotifyType: "NONE",
          packageName: "com.nttdocomo.android.mediaplayer",
          className: "com.nttdocomo.android.mediaplayer.OneshotStarter",
        },
      ],
    },
  };
  var strJson = JSON.stringify(jsonParam);
  if (typeof storeJk !== "undefined" && typeof storeJk.enqueue === "function") {
    storeJk.enqueue(strJson, "queue_list");
  }
}

/**
 * dマーケットアプリ用ストリーミング再生処理
 */
function playDMarket_ST(data, appType) {
  var mpPackageName;
  var className;
  var actionName;
  var stbContentTitle;
  // dマーケットアプリまたはdマーケットアプリ(TVBox)か？
  if (appType == "01" || appType == "03") {
    mpPackageName = "com.nttdocomo.android.mediaplayer";
    className = "com.nttdocomo.android.mediaplayer.OneshotStarter";
    actionName = "com.nttdocomo.android.mediaplayer.PLAY_VIEW";
    stbContentTitle = "";
    // dマーケットアプリ(ドングル)か？
  } else {
    mpPackageName = "com.nttdocomo.android.store";
    className = "com.nttdocomo.android.store.player.VideoPlayerActivity";
    actionName = "com.nttdocomo.android.store.player.PLAY_VIEW";
    stbContentTitle =
      "&STB_CONTENT_TITLE=" + encodeURIComponent(data.partTitle);
  }

  // マルチURLパラメータ生成
  var multiUrlParam = generateMultiUrlParam(data);

  // defaultPlay
  var defaultPlay = data.defaultPlay;
  // HD画質の場合1とする
  if (defaultPlay == 4) {
    defaultPlay = 1;
  }

  // ダウンロードキュー成功時の明示的インテントパラメータ設定
  // 途中から再生用再生開始位置が設定されている場合「resumePoint」「resumePointLastupdate」を上書きする
  var successNotifyParam =
    "LAUNCH_TYPE=PLAY_STM" +
    "&CONTENT_ID=" +
    data.serviceId +
    data.partId +
    "&URL=" +
    data.contentUri[defaultPlay - 1] +
    "?usr_token%3D" +
    data.viewOneTimeToken +
    multiUrlParam[0] + // URL1～3
    multiUrlParam[1] + // LABEL1～3
    multiUrlParam[2] + // DESC1～3
    multiUrlParam[3] + // DEFAULT_PLAY
    "&START_STATUS=RESUME" +
    "&SERVICE_ID=" +
    data.serviceId +
    "&RESUME_POINT=" +
    parseInt(startPosition != null ? startPosition : data.resumePoint) +
    "&RESUME_POINT_LASTUPDATE=" +
    parseInt(
      startPosition != null
        ? new Date().getTime() / 1000
        : data.resumePointLastUpdate,
    ) +
    "&RESUME_INFO_URL=" +
    data.resumeInfoUrl +
    "&RESUME_INFO_URL_EXPIRATION=" +
    parseInt(data.resumeInfoUrlExpiration) +
    "&KEEP_ALIVE_INTERVAL=" +
    parseInt(data.keepAliveInterval) +
    "&RESUME_INFO_SEND_MODE=" +
    data.resumeInfoSendMode +
    stbContentTitle +
    "&CUSTOM_DATA=" +
    data.oneTimeKey;

  var jsonParam = {
    group: {
      title: data.title,
      content: [
        {
          iconType: "MOVIE",
          license: {
            webInitiatorUri: data.webInitiatorUri,
          },
          streaming: {
            contentUri:
              data.contentUri[defaultPlay - 1] +
              "?usr_token=" +
              data.viewOneTimeToken,
            contentUrls: data.contentUrls,
          },
          successNotifyType: "INTENT",
          successNotifyAction: actionName,
          successNotifyParam: successNotifyParam,
          detailNotifyType: "NONE",
          packageName: mpPackageName,
          className: className,
        },
      ],
    },
  };
  var strJson = JSON.stringify(jsonParam);
  if (typeof storeJk !== "undefined" && typeof storeJk.enqueue === "function") {
    storeJk.enqueue(strJson, "none");
  }
}

/**
 * CFアプリ用ダウンロード再生処理
 */
function playCF_DL(data) {
  // defaultPlay
  var defaultPlay = data.defaultPlay;

  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    webInitiatorUri: data.webInitiatorUri,
    contentUri: data.contentUri[defaultPlay - 1],
    contentUrls: data.contentUrls,
    contentLength: parseInt(data.movieFileSize),
    quality: parseInt(defaultPlay),
    startStatus: data.startStatus,
    resumePoint: parseInt(data.resumePoint),
    resumePointLastupdate: parseInt(data.resumePointLastUpdate),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    multideviceState: data.multideviceState,
  };
  var strJson = JSON.stringify(jsonParam);
  if (
    typeof dAnimeStoreJk !== "undefined" &&
    typeof dAnimeStoreJk.launchDownloader === "function"
  ) {
    dAnimeStoreJk.launchDownloader(encodeURIComponent(strJson));
  }
}

/**
 * CFアプリ用ストリーミング再生処理
 */
function playCF_ST(data) {
  // defaultPlay
  var defaultPlay = data.defaultPlay;

  // 広告動画を取得できた場合はWebInitiatorのURLに広告話IDを追加する
  var webInitiatorUri = data.webInitiatorUri;
  if (data.adPartId != null && data.adPartId != "") {
    webInitiatorUri += "&adPartId=" + data.adPartId;
  }

  // 途中から再生用再生開始位置が設定されている場合「startStatus」「resumePoint」「resumePointLastupdate」「multideviceState」を上書きする
  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    webInitiatorUri: webInitiatorUri,
    contentUri: data.contentUri,
    defaultPlay: parseInt(defaultPlay),
    cid: data.oneTimeKey,
    laUrl: data.laUrl,
    castCustomDataUrl: data.castCustomDataUrl,
    castOneTimeKey: data.castOneTimeKey,
    castContentUri: data.castContentUri,
    contentUrls: data.contentUrls,
    imageUrl: [data.mainScenePath, data.mainScenePath, data.mainScenePath],
    startStatus: startPosition != null ? "RESUME" : data.startStatus,
    resumePoint: parseInt(
      startPosition != null ? startPosition : data.resumePoint,
    ),
    resumePointLastupdate: parseInt(
      startPosition != null
        ? new Date().getTime() / 1000
        : data.resumePointLastUpdate,
    ),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    keepAliveInterval: parseInt(data.keepAliveInterval),
    multideviceState: startPosition != null ? 1 : data.multideviceState,
    prevTitle: data.prevTitle,
    prevContentInfoUri: data.prevContentInfoUri,
    nextTitle: data.nextTitle,
    nextContentInfoUri: data.nextContentInfoUri,
    previousWebViewUrl: data.previousWebViewUrl,
    adContentUri: data.adContentUri,
    advertiser: data.advertiser,
    adClickUri: data.adClickUri,
    adNotifyUri: data.adNotifyUri,
    adSkipCount: data.adSkipCount,
    recommendContentInfo: data.recommendContentInfo,
  };
  var strJson = JSON.stringify(jsonParam);
  if (
    typeof dAnimeStoreJk !== "undefined" &&
    typeof dAnimeStoreJk.launchStmPlayer === "function"
  ) {
    dAnimeStoreJk.launchStmPlayer(encodeURIComponent(strJson));
  }
}

/**
 * CFアプリ(AndroidDash対応)用ダウンロード再生処理
 */
function playCF_DL_DASH(data) {
  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    seriesName: data.workTitle,
    seriesKana: data.workTitleKana,
    keyVisualUrl: data.mainKeyVisualPath,
    episodeName: data.partTitle,
    episodeNumber: data.partDispNumber,
    episodeMeasure: parseInt(data.partMeasureSecond),
    episodeVisualUrl: data.mainScenePath,
    episodeSortOrder: parseInt(data.partIndex),
    mpdUrl: data.mpdUrl,
    contentUrls: data.contentUrls,
    licenseUrl: data.licenseUrl,
    customDataUrl: data.customDataUrl,
    oneTimeKey: data.oneTimeKey,
    contentLength: parseInt(data.movieFileSize),
    quality: parseInt(data.defaultPlay),
    startStatus: data.startStatus,
    resumePoint: parseInt(data.resumePoint),
    resumePointLastupdate: parseInt(data.resumePointLastUpdate),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    multideviceState: data.multideviceState,
  };
  var strJson = JSON.stringify(jsonParam);
  if (
    typeof dAnimeStoreJk !== "undefined" &&
    typeof dAnimeStoreJk.launchDownloader === "function"
  ) {
    dAnimeStoreJk.launchDownloader(encodeURIComponent(strJson));
  }
}

/**
 * CFアプリ(AndroidDash対応)用ストリーミング再生処理
 */
function playCF_ST_DASH(data) {
  // 途中から再生用再生開始位置が設定されている場合「startStatus」「resumePoint」「resumePointLastupdate」「multideviceState」を上書きする
  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    mpdUrl: data.mpdUrl,
    contentUrls: data.contentUrls,
    licenseUrl: data.licenseUrl,
    customDataUrl: data.customDataUrl,
    oneTimeKey: data.oneTimeKey,
    availableQuality: data.availableQuality,
    defaultPlay: parseInt(data.defaultPlay),
    cid: data.oneTimeKey,
    laUrl: data.laUrl,
    castCustomDataUrl: data.castCustomDataUrl,
    castOneTimeKey: data.castOneTimeKey,
    castContentUri: data.castContentUri,
    imageUrl: [data.mainScenePath, data.mainScenePath, data.mainScenePath],
    startStatus: startPosition != null ? "RESUME" : data.startStatus,
    resumePoint: parseInt(
      startPosition != null ? startPosition : data.resumePoint,
    ),
    resumePointLastupdate: parseInt(
      startPosition != null
        ? new Date().getTime() / 1000
        : data.resumePointLastUpdate,
    ),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    keepAliveInterval: parseInt(data.keepAliveInterval),
    multideviceState: startPosition != null ? 1 : data.multideviceState,
    prevTitle: data.prevTitle,
    prevContentInfoUri: data.prevContentInfoUri,
    nextTitle: data.nextTitle,
    nextContentInfoUri: data.nextContentInfoUri,
    previousWebViewUrl: data.previousWebViewUrl,
    adContentUri: data.adContentUri,
    advertiser: data.advertiser,
    adClickUri: data.adClickUri,
    adNotifyUri: data.adNotifyUri,
    adSkipCount: data.adSkipCount,
    recommendContentInfo: data.recommendContentInfo,
  };
  var strJson = JSON.stringify(jsonParam);
  if (
    typeof dAnimeStoreJk !== "undefined" &&
    typeof dAnimeStoreJk.launchStmPlayer === "function"
  ) {
    dAnimeStoreJk.launchStmPlayer(encodeURIComponent(strJson));
  }
}

/**
 * CFアプリ(FullHD対応)用ダウンロード再生処理
 */
function playCF_DL_FullHd(data) {
  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    seriesName: data.workTitle,
    seriesKana: data.workTitleKana,
    keyVisualUrl: data.mainKeyVisualPath,
    episodeName: data.partTitle,
    episodeNumber: data.partDispNumber,
    episodeMeasure: parseInt(data.partMeasureSecond),
    episodeVisualUrl: data.mainScenePath,
    episodeSortOrder: parseInt(data.partIndex),
    mpdUrl: data.mpdUrl,
    contentUrls: data.contentUrls,
    licenseUrl: data.licenseUrl,
    customDataUrl: data.customDataUrl,
    oneTimeKey: data.oneTimeKey,
    contentLength: parseInt(data.movieFileSize),
    contentLengths: data.movieFileSizeList,
    startStatus: data.startStatus,
    resumePoint: parseInt(data.resumePoint),
    resumePointLastupdate: parseInt(data.resumePointLastUpdate),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    multideviceState: data.multideviceState,
  };
  var strJson = JSON.stringify(jsonParam);
  if (
    typeof dAnimeStoreJk !== "undefined" &&
    typeof dAnimeStoreJk.launchDownloader === "function"
  ) {
    dAnimeStoreJk.launchDownloader(encodeURIComponent(strJson));
  }
}

/**
 * CFアプリ(FullHd対応)用ストリーミング再生処理
 */
function playCF_ST_FullHd(data) {
  // 途中から再生用再生開始位置が設定されている場合「startStatus」「resumePoint」「resumePointLastupdate」「multideviceState」を上書きする
  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    mpdUrl: data.mpdUrl,
    licenseUrl: data.licenseUrl,
    customDataUrl: data.customDataUrl,
    oneTimeKey: data.oneTimeKey,
    cid: data.oneTimeKey,
    laUrl: data.laUrl,
    castCustomDataUrl: data.castCustomDataUrl,
    castOneTimeKey: data.castOneTimeKey,
    castContentUri: data.castContentUri,
    contentUrls: data.contentUrls,
    imageUrl: [data.mainScenePath, data.mainScenePath, data.mainScenePath],
    startStatus: startPosition != null ? "RESUME" : data.startStatus,
    resumePoint: parseInt(
      startPosition != null ? startPosition : data.resumePoint,
    ),
    resumePointLastupdate: parseInt(
      startPosition != null
        ? new Date().getTime() / 1000
        : data.resumePointLastUpdate,
    ),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    keepAliveInterval: parseInt(data.keepAliveInterval),
    multideviceState: startPosition != null ? 1 : data.multideviceState,
    prevTitle: data.prevTitle,
    prevContentInfoUri: data.prevContentInfoUri,
    nextTitle: data.nextTitle,
    nextContentInfoUri: data.nextContentInfoUri,
    previousWebViewUrl: data.previousWebViewUrl,
    recommendContentInfo: data.recommendContentInfo,
  };
  var strJson = JSON.stringify(jsonParam);
  if (
    typeof dAnimeStoreJk !== "undefined" &&
    typeof dAnimeStoreJk.launchStmPlayer === "function"
  ) {
    dAnimeStoreJk.launchStmPlayer(encodeURIComponent(strJson));
  }
}

/**
 * CFアプリ(マンガ対応)用ダウンロード再生処理
 */
function playCF_DL_Comic(data) {
  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    seriesName: data.workTitle,
    seriesKana: data.workTitleKana,
    keyVisualUrl: data.mainKeyVisualPath,
    episodeName: data.partTitle,
    episodeNumber: data.partDispNumber,
    episodeMeasure: parseInt(data.partMeasureSecond),
    episodeVisualUrl: data.mainScenePath,
    episodeSortOrder: parseInt(data.partIndex),
    mpdUrl: data.mpdUrl,
    contentUrls: data.contentUrls,
    licenseUrl: data.licenseUrl,
    customDataUrl: data.customDataUrl,
    oneTimeKey: data.oneTimeKey,
    contentLength: parseInt(data.movieFileSize),
    contentLengths: data.movieFileSizeList,
    startStatus: data.startStatus,
    resumePoint: parseInt(data.resumePoint),
    resumePointLastupdate: parseInt(data.resumePointLastUpdate),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    multideviceState: data.multideviceState,
    animeRecommendInfoTitle: data.animeRecommendInfoTitle,
    animeNextContentInfoTitle: data.animeNextContentInfoTitle,
    bookWorkInfoTitle: data.bookWorkInfoTitle,
    bookRecommendInfoTitle: data.bookRecommendInfoTitle,
    bookRecommendInfoUri: data.bookRecommendInfoUri,
    productsRecommendInfoTitle: data.productsRecommendInfoTitle,
    productsRecommendInfoUri: data.productsRecommendInfoUri,
    goodsProductsDetailInfoUri: data.goodsProductsDetailInfoUri,
    bookSpecifiedVolumeInfoTitle: data.bookSpecifiedVolumeInfoTitle,
    bookSpecifiedVolumeInfoUri: data.bookSpecifiedVolumeInfoUri,
    chapters: data.chapters,
    skipWaitTime: parseInt(data.skipWaitTime),
    minTimeToSkip: parseInt(data.minTimeToSkip),
  };
  var strJson = JSON.stringify(jsonParam);
  if (
    typeof dAnimeStoreJk !== "undefined" &&
    typeof dAnimeStoreJk.launchDownloader === "function"
  ) {
    dAnimeStoreJk.launchDownloader(encodeURIComponent(strJson));
  }
}

/**
 * CFアプリ(マンガ対応)用ストリーミング再生処理
 */
function playCF_ST_Comic(data) {
  // 途中から再生用再生開始位置が設定されている場合「startStatus」「resumePoint」「resumePointLastupdate」「multideviceState」を上書きする
  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    mpdUrl: data.mpdUrl,
    licenseUrl: data.licenseUrl,
    customDataUrl: data.customDataUrl,
    oneTimeKey: data.oneTimeKey,
    cid: data.oneTimeKey,
    laUrl: data.laUrl,
    castCustomDataUrl: data.castCustomDataUrl,
    castOneTimeKey: data.castOneTimeKey,
    castContentUri: data.castContentUri,
    contentUrls: data.contentUrls,
    imageUrl: [data.mainScenePath, data.mainScenePath, data.mainScenePath],
    startStatus: startPosition != null ? "RESUME" : data.startStatus,
    resumePoint: parseInt(
      startPosition != null ? startPosition : data.resumePoint,
    ),
    resumePointLastupdate: parseInt(
      startPosition != null
        ? new Date().getTime() / 1000
        : data.resumePointLastUpdate,
    ),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    keepAliveInterval: parseInt(data.keepAliveInterval),
    multideviceState: startPosition != null ? 1 : data.multideviceState,
    prevTitle: data.prevTitle,
    prevContentInfoUri: data.prevContentInfoUri,
    nextTitle: data.nextTitle,
    nextContentInfoUri: data.nextContentInfoUri,
    previousWebViewUrl: data.previousWebViewUrl,
    recommendContentInfo: data.recommendContentInfo,
    nextMainScenePath: data.nextMainScenePath,
    nextPartDispNumber: data.nextPartDispNumber,
    nextPartTitle: data.nextPartTitle,
    nextPartExp: data.nextPartExp,
    animeRecommendInfoTitle: data.animeRecommendInfoTitle,
    animeNextContentInfoTitle: data.animeNextContentInfoTitle,
    bookWorkInfoTitle: data.bookWorkInfoTitle,
    bookRecommendInfoTitle: data.bookRecommendInfoTitle,
    bookRecommendInfoUri: data.bookRecommendInfoUri,
    productsRecommendInfoTitle: data.productsRecommendInfoTitle,
    productsRecommendInfoUri: data.productsRecommendInfoUri,
    goodsProductsDetailInfoUri: data.goodsProductsDetailInfoUri,
    bookSpecifiedVolumeInfoTitle: data.bookSpecifiedVolumeInfoTitle,
    bookSpecifiedVolumeInfoUri: data.bookSpecifiedVolumeInfoUri,
    chapters: data.chapters,
    skipWaitTime: parseInt(data.skipWaitTime),
    minTimeToSkip: parseInt(data.minTimeToSkip),
  };
  var strJson = JSON.stringify(jsonParam);
  if (
    typeof dAnimeStoreJk !== "undefined" &&
    typeof dAnimeStoreJk.launchStmPlayer === "function"
  ) {
    dAnimeStoreJk.launchStmPlayer(encodeURIComponent(strJson));
  }
}

/**
 * iOSアプリ用ダウンロード再生処理
 */
function playIOS_DL(data) {
  // defaultPlay
  var defaultPlay = data.defaultPlay;
  // HD画質の場合1とする
  if (defaultPlay == 4) {
    defaultPlay = 1;
  }

  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    seriesName: data.workTitle,
    seriesKana: data.workTitleKana,
    keyVisualUrl: data.mainKeyVisualPath,
    episodeName: data.partTitle,
    episodeNumber: data.partDispNumber,
    episodeMeasure: parseInt(data.partMeasureSecond),
    episodeVisualUrl: data.mainScenePath,
    episodeSortOrder: parseInt(data.partIndex),
    webInitiatorUri: data.webInitiatorUri,
    contentUri: data.contentUri[defaultPlay - 1],
    contentUrls: data.contentUrls,
    contentLength: parseInt(data.movieFileSize),
    quality: parseInt(defaultPlay),
    startStatus: data.startStatus,
    resumePoint: parseInt(data.resumePoint),
    resumePointLastupdate: parseInt(data.resumePointLastUpdate),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    multideviceState: data.multideviceState,
  };
  var strJson = JSON.stringify(jsonParam);
  var appUrl =
    "jp.co.nttdocomo.animestore.download://?jsonParam=" +
    encodeURIComponent(strJson);

  location.href = appUrl;
}

/**
 * iOSアプリ用ストリーミング再生処理
 */
function playIOS_ST(data) {
  // defaultPlay
  var defaultPlay = data.defaultPlay;
  // HD画質の場合1とする
  if (defaultPlay == 4) {
    defaultPlay = 1;
  }

  var webInitiatorUri = data.webInitiatorUri;
  // 広告動画を取得できた場合はWebInitiatorのURLに広告話IDを追加する
  if (data.adPartId != null && data.adPartId != "") {
    webInitiatorUri += "&adPartId=" + data.adPartId;
  }

  // 途中から再生用再生開始位置が設定されている場合「startStatus」「resumePoint」「resumePointLastupdate」「multideviceState」を上書きする
  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    webInitiatorUri: webInitiatorUri,
    contentUri: data.contentUri[defaultPlay - 1],
    cid: data.oneTimeKey,
    laUrl: data.laUrl,
    castCustomDataUrl: data.castCustomDataUrl,
    castOneTimeKey: data.castOneTimeKey,
    castContentUri: data.castContentUri,
    contentUrls: data.contentUrls,
    imageUrl: [data.mainScenePath, data.mainScenePath],
    startStatus: startPosition != null ? "RESUME" : data.startStatus,
    resumePoint: parseInt(
      startPosition != null ? startPosition : data.resumePoint,
    ),
    resumePointLastupdate: parseInt(
      startPosition != null
        ? new Date().getTime() / 1000
        : data.resumePointLastUpdate,
    ),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    keepAliveInterval: parseInt(data.keepAliveInterval),
    multideviceState: startPosition != null ? 1 : data.multideviceState,
    prevTitle: data.prevTitle,
    prevContentInfoUri: data.prevContentInfoUri,
    nextTitle: data.nextTitle,
    nextContentInfoUri: data.nextContentInfoUri,
    previousWebViewUrl: data.previousWebViewUrl,
    adContentUri: data.adContentUri,
    advertiser: data.advertiser,
    adClickUri: data.adClickUri,
    adNotifyUri: data.adNotifyUri,
    adSkipCount: data.adSkipCount,
    recommendContentInfo: data.recommendContentInfo,
  };
  var strJson = JSON.stringify(jsonParam);
  var appUrl =
    "jp.co.nttdocomo.animestore.launchStmPlayer://?jsonParam=" +
    encodeURIComponent(strJson);

  location.href = appUrl;
}

/**
 * iOS(FullHd対応)アプリ用ダウンロード再生処理
 */
function playIOS_DL_FullHd(data) {
  // defaultPlay
  var defaultPlay = data.defaultPlay;

  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    seriesName: data.workTitle,
    seriesKana: data.workTitleKana,
    keyVisualUrl: data.mainKeyVisualPath,
    episodeName: data.partTitle,
    episodeNumber: data.partDispNumber,
    episodeMeasure: parseInt(data.partMeasureSecond),
    episodeVisualUrl: data.mainScenePath,
    episodeSortOrder: parseInt(data.partIndex),
    webInitiatorUri: data.webInitiatorUri,
    contentUri: data.contentUri[defaultPlay - 1],
    contentUris: data.contentUri,
    contentUrls: data.contentUrls,
    contentLength: parseInt(data.movieFileSize),
    contentLengths: data.movieFileSizeList,
    startStatus: data.startStatus,
    resumePoint: parseInt(data.resumePoint),
    resumePointLastupdate: parseInt(data.resumePointLastUpdate),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    multideviceState: data.multideviceState,
  };
  var strJson = JSON.stringify(jsonParam);
  var appUrl =
    "jp.co.nttdocomo.animestore.download://?jsonParam=" +
    encodeURIComponent(strJson);

  location.href = appUrl;
}

/**
 * iOS(FullHd)アプリ用ストリーミング再生処理
 */
function playIOS_ST_FullHd(data) {
  // defaultPlay
  var defaultPlay = data.defaultPlay;

  var webInitiatorUri = data.webInitiatorUri;
  // 広告動画を取得できた場合はWebInitiatorのURLに広告話IDを追加する
  if (data.adPartId != null && data.adPartId != "") {
    webInitiatorUri += "&adPartId=" + data.adPartId;
  }

  // 途中から再生用再生開始位置が設定されている場合「startStatus」「resumePoint」「resumePointLastupdate」「multideviceState」を上書きする
  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    webInitiatorUri: webInitiatorUri,
    contentUri: data.contentUri[defaultPlay - 1],
    cid: data.oneTimeKey,
    laUrl: data.laUrl,
    castCustomDataUrl: data.castCustomDataUrl,
    castOneTimeKey: data.castOneTimeKey,
    castContentUri: data.castContentUri,
    contentUrls: data.contentUrls,
    imageUrl: [data.mainScenePath, data.mainScenePath],
    startStatus: startPosition != null ? "RESUME" : data.startStatus,
    resumePoint: parseInt(
      startPosition != null ? startPosition : data.resumePoint,
    ),
    resumePointLastupdate: parseInt(
      startPosition != null
        ? new Date().getTime() / 1000
        : data.resumePointLastUpdate,
    ),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    keepAliveInterval: parseInt(data.keepAliveInterval),
    multideviceState: startPosition != null ? 1 : data.multideviceState,
    prevTitle: data.prevTitle,
    prevContentInfoUri: data.prevContentInfoUri,
    nextTitle: data.nextTitle,
    nextContentInfoUri: data.nextContentInfoUri,
    previousWebViewUrl: data.previousWebViewUrl,
    recommendContentInfo: data.recommendContentInfo,
  };
  var strJson = JSON.stringify(jsonParam);
  var appUrl =
    "jp.co.nttdocomo.animestore.launchStmPlayer://?jsonParam=" +
    encodeURIComponent(strJson);

  location.href = appUrl;
}

/**
 * iOS(マンガ対応)アプリ用ダウンロード再生処理
 */
function playIOS_DL_Comic(data) {
  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    seriesName: data.workTitle,
    seriesKana: data.workTitleKana,
    keyVisualUrl: data.mainKeyVisualPath,
    episodeName: data.partTitle,
    episodeNumber: data.partDispNumber,
    episodeMeasure: parseInt(data.partMeasureSecond),
    episodeVisualUrl: data.mainScenePath,
    episodeSortOrder: parseInt(data.partIndex),
    contentUri: data.mpdUrl,
    contentUrls: data.contentUrls,
    licenseUrl: data.licenseUrl,
    customDataUrl: data.customDataUrl,
    oneTimeKey: data.oneTimeKey,
    contentLength: parseInt(data.movieFileSize),
    contentLengths: data.movieFileSizeList,
    startStatus: data.startStatus,
    resumePoint: parseInt(data.resumePoint),
    resumePointLastupdate: parseInt(data.resumePointLastUpdate),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    multideviceState: data.multideviceState,
    animeRecommendInfoTitle: data.animeRecommendInfoTitle,
    animeNextContentInfoTitle: data.animeNextContentInfoTitle,
    bookWorkInfoTitle: data.bookWorkInfoTitle,
    bookRecommendInfoTitle: data.bookRecommendInfoTitle,
    bookRecommendInfoUri: data.bookRecommendInfoUri,
    productsRecommendInfoTitle: data.productsRecommendInfoTitle,
    productsRecommendInfoUri: data.productsRecommendInfoUri,
    goodsProductsDetailInfoUri: data.goodsProductsDetailInfoUri,
    bookSpecifiedVolumeInfoTitle: data.bookSpecifiedVolumeInfoTitle,
    bookSpecifiedVolumeInfoUri: data.bookSpecifiedVolumeInfoUri,
    chapters: data.chapters,
    skipWaitTime: parseInt(data.skipWaitTime),
    minTimeToSkip: parseInt(data.minTimeToSkip),
  };
  var strJson = JSON.stringify(jsonParam);
  var appUrl =
    "jp.co.nttdocomo.animestore.download://?jsonParam=" +
    encodeURIComponent(strJson);

  location.href = appUrl;
}

/**
 * iOS(マンガ)アプリ用ストリーミング再生処理
 */
function playIOS_ST_Comic(data) {
  // 途中から再生用再生開始位置が設定されている場合「startStatus」「resumePoint」「resumePointLastupdate」「multideviceState」を上書きする
  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    contentUri: data.mpdUrl,
    licenseUrl: data.licenseUrl,
    customDataUrl: data.customDataUrl,
    oneTimeKey: data.oneTimeKey,
    cid: data.oneTimeKey,
    laUrl: data.laUrl,
    castCustomDataUrl: data.castCustomDataUrl,
    castOneTimeKey: data.castOneTimeKey,
    castContentUri: data.castContentUri,
    contentUrls: data.contentUrls,
    imageUrl: [data.mainScenePath, data.mainScenePath],
    startStatus: startPosition != null ? "RESUME" : data.startStatus,
    resumePoint: parseInt(
      startPosition != null ? startPosition : data.resumePoint,
    ),
    resumePointLastupdate: parseInt(
      startPosition != null
        ? new Date().getTime() / 1000
        : data.resumePointLastUpdate,
    ),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    keepAliveInterval: parseInt(data.keepAliveInterval),
    multideviceState: startPosition != null ? 1 : data.multideviceState,
    prevTitle: data.prevTitle,
    prevContentInfoUri: data.prevContentInfoUri,
    nextTitle: data.nextTitle,
    nextContentInfoUri: data.nextContentInfoUri,
    previousWebViewUrl: data.previousWebViewUrl,
    recommendContentInfo: data.recommendContentInfo,
    nextMainScenePath: data.nextMainScenePath,
    nextPartDispNumber: data.nextPartDispNumber,
    nextPartTitle: data.nextPartTitle,
    nextPartExp: data.nextPartExp,
    animeRecommendInfoTitle: data.animeRecommendInfoTitle,
    animeNextContentInfoTitle: data.animeNextContentInfoTitle,
    bookWorkInfoTitle: data.bookWorkInfoTitle,
    bookRecommendInfoTitle: data.bookRecommendInfoTitle,
    bookRecommendInfoUri: data.bookRecommendInfoUri,
    productsRecommendInfoTitle: data.productsRecommendInfoTitle,
    productsRecommendInfoUri: data.productsRecommendInfoUri,
    goodsProductsDetailInfoUri: data.goodsProductsDetailInfoUri,
    bookSpecifiedVolumeInfoTitle: data.bookSpecifiedVolumeInfoTitle,
    bookSpecifiedVolumeInfoUri: data.bookSpecifiedVolumeInfoUri,
    chapters: data.chapters,
    skipWaitTime: parseInt(data.skipWaitTime),
    minTimeToSkip: parseInt(data.minTimeToSkip),
  };
  var strJson = JSON.stringify(jsonParam);
  var appUrl =
    "jp.co.nttdocomo.animestore.launchStmPlayer://?jsonParam=" +
    encodeURIComponent(strJson);

  location.href = appUrl;
}

/**
 * iOS(FairPlay対応)アプリ用ダウンロード再生処理
 */
function playIOS_DL_FairPlay(data) {
  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    seriesName: data.workTitle,
    seriesKana: data.workTitleKana,
    keyVisualUrl: data.mainKeyVisualPath,
    episodeName: data.partTitle,
    episodeNumber: data.partDispNumber,
    episodeMeasure: parseInt(data.partMeasureSecond),
    episodeVisualUrl: data.mainScenePath,
    episodeSortOrder: parseInt(data.partIndex),
    contentUri: data.mpdUrl,
    contentUrls: data.contentUrls,
    licenseUrl: data.licenseUrl,
    customDataUrl: data.customDataUrl,
    oneTimeKey: data.oneTimeKey,
    contentLength: parseInt(data.movieFileSize),
    contentLengths: data.movieFileSizeList,
    startStatus: data.startStatus,
    resumePoint: parseInt(data.resumePoint),
    resumePointLastupdate: parseInt(data.resumePointLastUpdate),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    multideviceState: data.multideviceState,
  };
  var strJson = JSON.stringify(jsonParam);
  var appUrl =
    "jp.co.nttdocomo.animestore.download://?jsonParam=" +
    encodeURIComponent(strJson);

  location.href = appUrl;
}

/**
 * iOS(FairPlay)アプリ用ストリーミング再生処理
 */
function playIOS_ST_FairPlay(data) {
  // 途中から再生用再生開始位置が設定されている場合「startStatus」「resumePoint」「resumePointLastupdate」「multideviceState」を上書きする
  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    contentUri: data.mpdUrl,
    licenseUrl: data.licenseUrl,
    customDataUrl: data.customDataUrl,
    oneTimeKey: data.oneTimeKey,
    cid: data.oneTimeKey,
    laUrl: data.laUrl,
    castCustomDataUrl: data.castCustomDataUrl,
    castOneTimeKey: data.castOneTimeKey,
    castContentUri: data.castContentUri,
    contentUrls: data.contentUrls,
    imageUrl: [data.mainScenePath, data.mainScenePath],
    startStatus: startPosition != null ? "RESUME" : data.startStatus,
    resumePoint: parseInt(
      startPosition != null ? startPosition : data.resumePoint,
    ),
    resumePointLastupdate: parseInt(
      startPosition != null
        ? new Date().getTime() / 1000
        : data.resumePointLastUpdate,
    ),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    keepAliveInterval: parseInt(data.keepAliveInterval),
    multideviceState: startPosition != null ? 1 : data.multideviceState,
    prevTitle: data.prevTitle,
    prevContentInfoUri: data.prevContentInfoUri,
    nextTitle: data.nextTitle,
    nextContentInfoUri: data.nextContentInfoUri,
    previousWebViewUrl: data.previousWebViewUrl,
    recommendContentInfo: data.recommendContentInfo,
  };
  var strJson = JSON.stringify(jsonParam);
  var appUrl =
    "jp.co.nttdocomo.animestore.launchStmPlayer://?jsonParam=" +
    encodeURIComponent(strJson);

  location.href = appUrl;
}

/**
 * iOSアプリ(旧)用ストリーミング再生処理
 * 連続再生・広告再生・レコメンド表示非対応
 */
// 2015/11/11現在 当アプリは存在しない
function playIOS_ST_old(data) {
  // defaultPlay
  var defaultPlay = data.defaultPlay;
  // HD画質の場合1とする
  if (defaultPlay == 4) {
    defaultPlay = 1;
  }

  // 途中から再生用再生開始位置が設定されている場合「startStatus」「resumePoint」「resumePointLastupdate」「multideviceState」を上書きする
  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    webInitiatorUri: data.webInitiatorUri,
    contentUri: data.contentUri[defaultPlay - 1],
    cid: data.oneTimeKey,
    laUrl: data.laUrl,
    castContentUri: data.castContentUri,
    contentUrls: data.contentUrls,
    imageUrl: [data.mainScenePath, data.mainScenePath],
    startStatus: startPosition != null ? "RESUME" : data.startStatus,
    resumePoint: parseInt(
      startPosition != null ? startPosition : data.resumePoint,
    ),
    resumePointLastupdate: parseInt(
      startPosition != null
        ? new Date().getTime() / 1000
        : data.resumePointLastUpdate,
    ),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    keepAliveInterval: parseInt(data.keepAliveInterval),
    multideviceState: startPosition != null ? 1 : data.multideviceState,
  };
  var strJson = JSON.stringify(jsonParam);
  var appUrl =
    "jp.co.nttdocomo.animestore.launchStmPlayer://?jsonParam=" +
    encodeURIComponent(strJson);

  var iframe = document.createElement("iframe");
  iframe.style.visibility = "hidden";
  iframe.src = appUrl;

  document.body.appendChild(iframe);
}

/**
 * iOSアプリ(デモ)用ストリーミング再生処理
 * ChromeCast・連続再生・広告再生・レコメンド表示非対応
 */
function playIOS_ST_demo(data) {
  // defaultPlay
  var defaultPlay = data.defaultPlay;
  // HD画質の場合1とする
  if (defaultPlay == 4) {
    defaultPlay = 1;
  }

  // 途中から再生用再生開始位置が設定されている場合「startStatus」「resumePoint」「resumePointLastupdate」「multideviceState」を上書きする
  var jsonParam = {
    contentId: data.partId,
    title: data.title,
    webInitiatorUri: data.webInitiatorUri,
    contentUri: data.contentUri[defaultPlay - 1],
    contentUrls: data.contentUrls,
    startStatus: startPosition != null ? "RESUME" : data.startStatus,
    resumePoint: parseInt(
      startPosition != null ? startPosition : data.resumePoint,
    ),
    resumePointLastupdate: parseInt(
      startPosition != null
        ? new Date().getTime() / 1000
        : data.resumePointLastUpdate,
    ),
    resumeInfoUrl: data.resumeInfoUrl,
    resumeInfoUrlExpiration: parseInt(data.resumeInfoUrlExpiration),
    keepAliveInterval: parseInt(data.keepAliveInterval),
    multideviceState: startPosition != null ? 1 : data.multideviceState,
  };
  var strJson = JSON.stringify(jsonParam);
  var appUrl =
    "jp.co.nttdocomo.animestore.launchStmPlayer://?jsonParam=" +
    encodeURIComponent(strJson);

  var iframe = document.createElement("iframe");
  iframe.style.visibility = "hidden";
  iframe.src = appUrl;

  document.body.appendChild(iframe);
}

/**
 * PC用ポップアップ再生処理
 */
function playMovie(
  defaultPlay,
  contentId,
  playlistId,
  playlistIndex,
  partType,
  serial,
) {
  // 二重押下抑止
  if (!checkView()) {
    return false;
  }

  // ダイレクト再生フラグ(画質や画面サイズの設定方法が異なる)
  // 再生画質が未指定の場合ダイレクト再生と判断
  var directFlag;
  if (defaultPlay != null && defaultPlay != "") {
    directFlag = false;
    // 画質指定の場合基準画質Cookieを更新
    updateStandardBitrateCdCookie(defaultPlay);
  } else {
    directFlag = true;
  }

  // ダイレクト再生の場合Cookieから基準画質を取得する
  if (directFlag) {
    defaultPlay = getCookieParam("standard_bitrate_cd");
  }

  // 端末情報取得
  var termInfo = getTermInfo();
  // 端末コード
  var termCode = "";
  if (termInfo != null) {
    termCode = termInfo.termCode;
  }

  if (termCode == "") {
    window.COMMON.showToast("動画再生に失敗しました");
    return false;
  }

  if (termCode == "62" && getCookieParam("renewal_pc_layout") === "1") {
    if (playlistId != null && playlistId != "") {
      location.href = "/animestore/renewal/playlists/" + playlistId;
    } else {
      location.href =
        "/animestore/renewal/works/" +
        contentId.substr(0, 5) +
        "/parts/" +
        contentId.substr(5, 3) +
        "/play";
    }
    return false;
  }

  // ログイン要否判定
  var needLogin = true;
  var loginParams = null;

  // ログインが不要な販売条件C/限定種別C or 会員認証済 or シリアルがALL向けか？(作品個別再生時)
  if (
    partType === "01" ||
    partType === "04" ||
    partType === "2" ||
    getCookieParam("member_status") === "1" ||
    getCookieParam("entame_member_status") === "1" ||
    serial === "0"
  ) {
    // ログイン不要
    needLogin = false;
  }

  // 話種別指定なし、かつ (限定コンテンツでない or 会員以外)か？(ダイレクト再生/プレイリスト再生時)
  if (
    !partType &&
    ((contentId && contentId.indexOf("C") === 0) ||
      getCookieParam("member_status") === "1" ||
      getCookieParam("entame_member_status") === "1")
  ) {
    // ログイン不要
    needLogin = false;
  }

  // 要ログインか？
  if (needLogin) {
    // ログイン用パラメータを設定
    loginParams = {
      popupFlag: 1,
      noParentReload: 0,
    };
    // シリアル判定を実施
    if (serial === "2") {
      loginParams.notNeedReg = 1;
    }
  }

  // DASH対応UAか？
  if (termCode == "62") {
    playDashMovie(
      defaultPlay,
      contentId,
      playlistId,
      playlistIndex,
      loginParams,
    );
    return true;
  }

  var features =
    "location=no, menubar=no, status=yes, scrollbars=yes, resizable=yes, toolbar=no";

  var width = 0;
  var height = 0;

  // パラメータ設定
  var url;
  if (isLimitedContents(contentId)) {
    url = "/animestore/sc_pc_l";
  } else {
    url = "/animestore/sc_pc";
  }
  var param;
  var partId;

  // playlistIdが設定されていた場合プレイリスト再生
  if (playlistId != null && playlistId != "") {
    param = "?playlistId=" + playlistId;
    if (contentId != null && contentId != "") {
      // contentIdが10桁の場合話IDを切り出す
      if (contentId.length == 10) {
        partId = contentId.toString().substr(0, 8);
      } else {
        partId = contentId;
      }
      param += "&partId=" + partId;
    }
    if (playlistIndex != null && playlistIndex != "") {
      param += "&playlistIndex=" + playlistIndex;
    }
  } else {
    // contentIdが10桁の場合動画IDと判定し画質固定で再生
    if (contentId.length == 10) {
      partId = contentId.toString().substr(0, 8);
      param = "?movieId=" + contentId;
      // contentIdが10桁以外の場合話IDと判定する
    } else {
      partId = contentId;
      // ダイレクト再生の場合話ID指定で再生
      // 基準画質以下で最大画質を再生対象とする
      if (directFlag) {
        param = "?partId=" + contentId;
        // 直接playMovieを話ID指定で呼び出した場合画質固定で再生
      } else {
        param = "?movieId=" + contentId + "1" + defaultPlay;
      }
    }
  }

  // 途中から再生用再生開始位置(PCでフリーページから途中から再生の場合、作品indexの初期処理(contentIndex_pc.js)で設定済み)
  // 対象の話IDと一致した場合再生開始位置を更新
  if (
    paramPartId != null &&
    paramPartId == partId &&
    paramStartPosition != null
  ) {
    startPosition = paramStartPosition;
  }
  // 途中から再生用再生開始位置が設定されている場合
  if (startPosition != null && startPosition != "") {
    param += "&startPosition=" + startPosition;
  }
  url += param;

  // 画面サイズ設定
  // 「HD」の場合
  if (defaultPlay == "4") {
    // ダイレクト再生の場合「すごくきれい」と同じサイズを設定
    if (directFlag) {
      width = 854;
      height = 480;
    } else {
      width = 1280;
      height = 720;
    }
    // 「すごくきれい」の場合
  } else if (defaultPlay == "3") {
    width = 854;
    height = 480;
    // 「きれい」の場合
  } else if (defaultPlay == "2") {
    width = 720;
    height = 404;
    // 「普通」の場合(上記以外の場合「普通」とする)
  } else {
    defaultPlay = "1";
    width = 720;
    height = 404;
  }

  // 要ログインかを判定
  if (!loginParams) {
    if (width) {
      features += ", width=" + width;
    }

    if (height) {
      features += ", height=" + height;
    }
    var windowname = "popupwindow";
    window.open(url, windowname, features);
  } else {
    // 画面サイズをCookieに保存
    window.COMMON.setCookie("PC030010_window_width", width, "/");
    window.COMMON.setCookie("PC030010_window_height", height, "/");

    // 有料話で非会員の場合はログイン画面を表示する
    loginParams.nextUrlC = url;
    window.popupLogin(loginParams, null, true); // forcePopup=trueでポップアップする
  }

  // 途中から再生用再生開始位置を初期化
  startPosition = null;
  paramStartPosition = null;
}

/**
 * PC(DASH)用ポップアップ再生処理
 */
function playDashMovie(
  defaultPlay,
  contentId,
  playlistId,
  playlistIndex,
  loginParams,
) {
  var features =
    "location=no, menubar=no, status=yes, scrollbars=yes, resizable=yes, toolbar=no";

  var width = 0;
  var height = 0;

  // パラメータ設定
  var url = "/animestore/sc_pc?";
  var initParamFlag = true;
  var partId = contentId;

  if (contentId != null && contentId != "") {
    // contentIdが10桁の場合話IDを切り出す
    if (contentId.length == 10) {
      partId = contentId.toString().substr(0, 8);
    }
    url += "partId=" + partId;
    initParamFlag = false;
  }
  // playlistIdが設定されていた場合プレイリスト再生
  if (playlistId != null && playlistId != "") {
    if (!initParamFlag) {
      url += "&";
    }
    url += "playlistId=" + playlistId;
    if (playlistIndex != null && playlistIndex != "") {
      url += "&playlistIndex=" + playlistIndex;
    }
  }

  // 途中から再生用再生開始位置(PCでフリーページから途中から再生の場合、作品indexの初期処理(contentIndex_pc.js)で設定済み)
  // 対象の話IDと一致した場合再生開始位置を更新
  if (
    paramPartId != null &&
    paramPartId == partId &&
    paramStartPosition != null
  ) {
    startPosition = paramStartPosition;
  }

  // 途中から再生用再生開始位置が設定されている場合
  if (startPosition != null && startPosition != "") {
    url += "&startPosition=" + startPosition;
  }

  // 画面サイズ設定
  // Cookieから取得
  var widthCookie = getCookieParam("PC030011_window_width");
  if (widthCookie != "") {
    width = parseInt(widthCookie, 10);
  }
  var heightCookie = getCookieParam("PC030011_window_height");
  if (heightCookie != "") {
    height = parseInt(heightCookie, 10);
  }

  // Cookieで取得できなかった場合
  if (width <= 0 || height <= 0) {
    // 「HD」の場合
    if (defaultPlay == "4") {
      width = 1280;
      height = 720;
    } else {
      // HD以外(=SD)は854×486
      defaultPlay = "3";
      width = 854;
      height = 486;
    }
  }

  // 要ログインかを判定
  if (!loginParams) {
    if (width) {
      features += ", width=" + width;
    }

    if (height) {
      features += ", height=" + height;
    }
    var windowname = "popupwindow";
    window.open(url, windowname, features);
  } else {
    // 画面サイズをCookieに保存
    window.COMMON.setCookie("PC030011_window_width", width, "/");
    window.COMMON.setCookie("PC030011_window_height", height, "/");

    // 有料話で非会員の場合はログイン画面を表示する
    loginParams.nextUrlC = url;
    window.popupLogin(loginParams, null, true); // forcePopup=trueでポップアップする
  }

  // 途中から再生用再生開始位置を初期化
  startPosition = null;
  paramStartPosition = null;
}

/**
 * 新いちおし用再生処理
 * PCブラウザ以外対象
 */
function playMovieIchioshi(
  defaultPlay,
  contentId,
  playlistId,
  playlistIndex,
  partType,
  serial,
) {
  // パラメータ設定
  var url = "/animestore/sc_d_pc";
  var param;
  var partId;

  // playlistIdが設定されていた場合プレイリスト再生
  if (playlistId != null && playlistId != "") {
    param = "?playlistId=" + playlistId;
    if (contentId != null && contentId != "") {
      // contentIdが10桁の場合話IDを切り出す
      if (contentId.length == 10) {
        partId = contentId.toString().substr(0, 8);
      } else {
        partId = contentId;
      }
      param += "&partId=" + partId;
    }
    if (playlistIndex != null && playlistIndex != "") {
      param += "&playlistIndex=" + playlistIndex;
    }
  } else {
    partId = contentId;
    // ダイレクト再生の場合話ID指定で再生
    // 基準画質以下で最大画質を再生対象とする
    param = "?partId=" + contentId;
  }

  // 途中から再生用再生開始位置(PCでフリーページから途中から再生の場合、作品indexの初期処理(contentIndex_pc.js)で設定済み)
  // 対象の話IDと一致した場合再生開始位置を更新
  if (
    paramPartId != null &&
    paramPartId == partId &&
    paramStartPosition != null
  ) {
    startPosition = paramStartPosition;
  }
  // 途中から再生用再生開始位置が設定されている場合
  if (startPosition != null && startPosition != "") {
    param += "&startPosition=" + startPosition;
  }
  url += param;
  location.href = url;

  // 途中から再生用再生開始位置を初期化
  startPosition = null;
  paramStartPosition = null;
}

/**
 * エラー処理
 */
function resultError(playParam, partId, playArgs) {
  // 動画再生IF呼び出しで重大なエラーとなった場合（通信不可など）
  if (playParam == null) {
    window.COMMON.showToast("動画再生に失敗しました");
    return;
  }

  // 取得結果コード
  var resultCd = playParam.resultCd;

  // 商品情報なし
  if (resultCd == "22") {
    window.COMMON.showToast("この話は現在公開されておりません");
    // 動画情報なし
  } else if (resultCd == "23") {
    window.COMMON.showToast("このコンテンツは現在視聴できません");
    // iOS非対応またはドングル非対応
  } else if (resultCd == "24" || resultCd == "25") {
    window.COMMON.showToast("この作品はご利用の端末で現在視聴いただけません");
    // 同時視聴中
  } else if (resultCd == "26") {
    window.COMMON.showToast(
      "同一dアカウントによる複数端末での動画視聴はできません",
    );
    // 要レンタル
  } else if (resultCd == "27") {
    if (partId != null && partId != "") {
      window.COMMON.showDialog({
        text: "この作品はレンタル作品です。レンタル後にお楽しみいただけます",
        button1Text: "キャンセル",
        button1Callback: function () {},
        button2Text: "OK",
        button2Callback: function () {
          // 該当話の作品個別へ遷移
          var nextUrl;
          if (isLimitedContents(partId)) {
            nextUrl = "/animestore/cd_l?partId=" + partId;
          } else {
            nextUrl = "/animestore/cd?partId=" + partId;
          }
          location.href = nextUrl;
        },
      });
    } else {
      window.COMMON.showToast(
        "この作品はレンタル作品です。レンタル後にお楽しみいただけます",
      );
    }
    // 要レンタル（レンタル不可端末）
  } else if (resultCd == "28") {
    window.COMMON.showToast(
      "この作品はレンタル作品です。ご利用の端末からのレンタルはできません",
    );
    // 視聴数上限（先着締切り後）
  } else if (resultCd == "29") {
    window.COMMON.showToast("視聴数が上限に達しているため、視聴できません");
    // 事前エントリ無し
  } else if (resultCd == "30") {
    window.COMMON.showToast("このコンテンツは当選者のみ視聴可能です");
    // シリアルナンバー入力無し
  } else if (resultCd == "31") {
    window.COMMON.showToast(
      "このコンテンツはキャンペーンコード入力後にご視聴頂けます",
    );
    // 別シリアルナンバー入力あり
  } else if (resultCd == "32") {
    window.COMMON.showToast(
      "入力されたキャンペーンコードではこの動画を視聴できません",
    );
    // 習熟IDの先着限定コンテンツエラー
  } else if (resultCd == "33") {
    window.COMMON.showToast("習熟IDのため視聴できません");
    // 要年齢認証
  } else if (resultCd == "34") {
    if (typeof playArgs.playlistId === "string" && playArgs.playlistId.length) {
      showAgeCheckDialog("1", resultCd, null, null);
    } else {
      window.saveAuthActionData({
        type: "play_movie",
        data: playArgs,
        timing: "load pageshow",
        delay: 1000,
      });
      location.href =
        "/animestore/age_check?nextUrl=" + encodeURIComponent(location.href);
    }
    // 要年齢確認または年齢認証NGまたは年齢認証不同意または年齢認証拒否または年齢認証IFエラー
  } else if (
    resultCd == "35" ||
    resultCd == "36" ||
    resultCd == "37" ||
    resultCd == "38" ||
    resultCd == "39"
  ) {
    if (typeof playArgs.playlistId === "string" && playArgs.playlistId.length) {
      showAgeCheckDialog("1", "34", null, null);
    } else {
      var registFunc = function (d) {
        viewBtnFlag = false;
        contentPlay(d.partId, d.bitrate, d.viewType, d.position);
      };
      showAgeCheckDialog("1", resultCd, registFunc.bind(null, playArgs), null);
    }
    // 海外IP
  } else if (resultCd == "81") {
    // 海外からアクセスした方へ画面へ遷移
    location.href = "/nonaccessible.html";
    // 要アプリバージョンアップ
  } else if (resultCd == "82") {
    // アプリをアップデートしてください画面へ遷移
    location.href = "/animestore/iosapp_ver_warn";
    // 非対応機種
  } else if (resultCd == "83") {
    // 非対応の方へ画面へ遷移
    location.href = "/animestore/uncov_m";
    // 要アプリ起動
  } else if (resultCd == "84") {
    // dマーケット以外からアクセスした方へ画面へ遷移
    location.href =
      "/animestore/dapp_warn?next_url=" + encodeURIComponent(location.href);
    // 海外UA
  } else if (resultCd == "85") {
    // 海外からアクセスした方へ画面へ遷移
    location.href = "/animestore/os_warn";
    // 未認証または非会員
  } else if (resultCd == "86" || resultCd == "87") {
    window.doLogin(null, {
      type:
        typeof playArgs.playlistId === "string" && playArgs.playlistId.length
          ? "play_list"
          : "play_movie", // playlistIdが設定されていた場合プレイリスト再生
      data: playArgs,
      timing: "load pageshow",
      delay: 1000,
    });
    // スゴ得未ログイン
  } else if (resultCd == "90") {
    // /sugotoku配下の場合
    if (window.location.pathname.indexOf("/sugotoku/") === 0) {
      // 戻り先としてリクエストパラメータに渡すため、現在のURLを取得
      var nextUrl = location.href;
      // スゴ得認証へ遷移
      location.href = "/sugotoku/auth?nextUrl=" + encodeURIComponent(nextUrl);

      // /sugotoku配下でない場合
    } else {
      // 会員登録ページへ
      location.href = "/sugotoku/reg";
    }
    // 上記以外（パラメータ不良:21,ステージング不正アクセス:88,システムエラー:99を含む）
  } else {
    window.COMMON.showToast("動画再生に失敗しました");
  }
}

/**
 * 端末情報取得
 */
function getTermInfo() {
  var termInfo;
  var getTermRelationInfo_api_url = "/animestore/rest/WS020101";
  $.ajax({
    type: "GET",
    url: getTermRelationInfo_api_url,
    datatype: "json",
    cache: false,
    async: false,
    success: function (json) {
      termInfo = json;
    },

    error: function (xhr, textStatus, errorThrown) {
      termInfo = null;
    },
  });
  return termInfo;
}

/**
 * 動画再生パラメータ取得
 */
function getPlayParam(
  partId,
  defaultPlay,
  viewType,
  mpVersion,
  playlistId,
  playlistIndex,
) {
  var playParam;
  var getPlayParam_api_url =
    "/animestore/rest/WS010105?defaultPlay=" +
    defaultPlay +
    "&viewType=" +
    viewType +
    "&mpVersion=" +
    mpVersion;
  if (partId != null && partId != "") {
    getPlayParam_api_url += "&partId=" + partId;
  }
  if (playlistId != null && playlistId != "") {
    getPlayParam_api_url += "&playlistId=" + playlistId;
    if (playlistIndex != null && playlistIndex != "") {
      getPlayParam_api_url += "&playlistIndex=" + playlistIndex;
    }
  }
  if (isContentsDetailUrl() == true) {
    getPlayParam_api_url += "&needWebViewUrl=1";
  }

  $.ajax({
    type: "GET",
    url: getPlayParam_api_url,
    cache: false,
    async: false,
    success: function (json) {
      playParam = json;
    },

    error: function (xhr, textStatus, errorThrown) {
      playParam = null;
    },
  });
  return playParam;
}

/**
 * 作品個別URL判定処理
 */
function isContentsDetailUrl() {
  var cd = "/animestore/cd";
  var cd_l = "/animestore/cd_l";
  var mcd = "/animestore/mcd";
  var mcd_l = "/animestore/mcd_l";
  var sugo_cd = "/sugotoku/cd";
  var launch_player = "/animestore/CF/launch_player";

  if (
    location.pathname == cd ||
    location.pathname == cd_l ||
    location.pathname == mcd ||
    location.pathname == mcd_l ||
    location.pathname == sugo_cd ||
    location.pathname == launch_player
  ) {
    return true;
  }
  return false;
}

/**
 * dマーケットアプリ用メディアプレーヤーのバージョンを取得
 */
function getMPVersion(termCode, termName) {
  // （Ph5.0 追加）サブデバス情報を基にメディアプレーヤーのバージョンを取得し、画面パラメータにセットする
  var mediaPlayerVersion = "";
  var mediaPlayerInfo = "";
  var mpPackageName = "";

  // dマーケットアプリまたはdマーケットアプリ(TVBox)か？
  if (termCode == "12" || termName == "TB01") {
    mpPackageName = "com.nttdocomo.android.mediaplayer";
    // dマーケットアプリ(ドングル)か？
  } else {
    mpPackageName = "com.nttdocomo.android.store";
  }

  // パッケージ名を基に、メディアプレイヤーのバージョン情報を取得
  try {
    mediaPlayerInfo = commonJk.getPackageInfo(mpPackageName);
    // JSON の構文解析(文字列を JavaScript objects に変換)
    var obj = eval("(" + mediaPlayerInfo + ")");
    // API実行結果よりバージョン名を取得
    mediaPlayerVersion = obj.VersionName;
  } catch (e) {
    // ストアアプリがAPI未実装の場合は、ブランクを設定する。
    mediaPlayerVersion = "";
  }
  return mediaPlayerVersion;
}

/**
 * dマーケットアプリ用マルチデバイス設定
 */
function settingMultiDeviceEnabled(serviceId) {
  var callbackId = "3";
  var send_setting = true;
  var settingMultiDeviceEnabledResult = null;

  try {
    settingMultiDeviceEnabledResult = commonJk.settingMultiDeviceEnabled(
      callbackId,
      serviceId,
      send_setting,
    );
  } catch (e) {
    /* 古いバージョンは、commonJk.settingMultiDeviceEnabledが存在しないエラーとなる為、無視する。 */
  }

  /* パラメータチェックの結果を返却（注意：実行結果ではない） */
  return settingMultiDeviceEnabledResult;
}

/**
 * dマーケットアプリダウンロード再生用レジューム情報保存
 */
function registResumeInfo(filePath, data) {
  var jsonParam;
  if (parseInt(data.resumePointLastUpdate) != 0) {
    jsonParam = [
      {
        content_id: data.serviceId + data.partId,
        service_id: data.serviceId,
        uri: filePath,
        resume_point: parseInt(data.resumePoint),
        resume_point_lastupdate: parseInt(data.resumePointLastUpdate),
        resume_info_url: data.resumeInfoUrl,
        resume_info_url_expiration: parseInt(data.resumeInfoUrlExpiration),
      },
    ];
    // 中断情報取得に失敗した場合
  } else {
    jsonParam = [
      {
        content_id: data.serviceId + data.partId,
        service_id: data.serviceId,
        uri: filePath,
        resume_info_url: data.resumeInfoUrl,
        resume_info_url_expiration: parseInt(data.resumeInfoUrlExpiration),
      },
    ];
  }

  var callbackId = "1";

  var registerResumeInfoResult = null;

  try {
    var strJson = JSON.stringify(jsonParam);
    registerResumeInfoResult = commonJk.registerResumeInfo(callbackId, strJson);
  } catch (e) {
    /* 古いバージョンは、commonJk.registerResumeInfoが存在しないエラーとなる為、無視する。 */
  }

  /* パラメータチェックの結果を返却（注意：実行結果ではない） */
  return registerResumeInfoResult;
}

/**
 * dマーケットアプリストリーミング再生用マルチURLパラメータ生成
 */
function generateMultiUrlParam(data) {
  //  multiUrlParam = [URL, LABEL, DESC, DEFALT_PLAY]
  var multiUrlParam = ["", "", "", ""];
  var multiUrlId = 0;

  // defaultPlay
  var defaultPlay = data.defaultPlay;

  // HD画質以外の場合
  if (defaultPlay != 4) {
    // 普通画質はあるか？
    if (data.contentUri[0] != null && data.contentUri[0] != "") {
      multiUrlId++;
      multiUrlParam[0] =
        multiUrlParam[0] +
        "&URL" +
        multiUrlId +
        "=" +
        data.contentUri[0] +
        "?usr_token%3D" +
        data.viewOneTimeToken;
      multiUrlParam[1] =
        multiUrlParam[1] + "&LABEL" + multiUrlId + "=" + "普通";
      multiUrlParam[2] = multiUrlParam[2] + "&DESC" + multiUrlId + "=" + "";
      if (defaultPlay == 1) {
        multiUrlParam[3] = "&DEFAULT_PLAY=" + multiUrlId;
      }
    }

    // きれい画質はあるか？
    if (data.contentUri[1] != null && data.contentUri[1] != "") {
      multiUrlId++;
      multiUrlParam[0] =
        multiUrlParam[0] +
        "&URL" +
        multiUrlId +
        "=" +
        data.contentUri[1] +
        "?usr_token%3D" +
        data.viewOneTimeToken;
      multiUrlParam[1] =
        multiUrlParam[1] + "&LABEL" + multiUrlId + "=" + "きれい";
      multiUrlParam[2] = multiUrlParam[2] + "&DESC" + multiUrlId + "=" + "";
      if (defaultPlay == 2) {
        multiUrlParam[3] = "&DEFAULT_PLAY=" + multiUrlId;
      }
    }

    // すごくきれい画質はあるか？
    if (data.contentUri[2] != null && data.contentUri[2] != "") {
      multiUrlId++;
      multiUrlParam[0] =
        multiUrlParam[0] +
        "&URL" +
        multiUrlId +
        "=" +
        data.contentUri[2] +
        "?usr_token%3D" +
        data.viewOneTimeToken;
      multiUrlParam[1] =
        multiUrlParam[1] + "&LABEL" + multiUrlId + "=" + "すごくきれい";
      multiUrlParam[2] =
        multiUrlParam[2] + "&DESC" + multiUrlId + "=" + "(Wi-Fi/Xi)";
      if (defaultPlay == 3) {
        multiUrlParam[3] = "&DEFAULT_PLAY=" + multiUrlId;
      }
    }
    // HD画質の場合
  } else {
    multiUrlId = 1;
    multiUrlParam[0] =
      "&URL" +
      multiUrlId +
      "=" +
      data.contentUri[0] +
      "?usr_token%3D" +
      data.viewOneTimeToken;
    multiUrlParam[1] = "&LABEL" + multiUrlId + "=" + "HD";
    multiUrlParam[2] = "&DESC" + multiUrlId + "=" + "(Wi-Fi推奨)";
    multiUrlParam[3] = "&DEFAULT_PLAY=" + multiUrlId;
  }

  return multiUrlParam;
}

/**
 * CFアプリ用バージョン判定関数
 * XX.YY.ZZZZZのXX部分がtargetVersion以上かを判定する
 */
function checkCfAppVersion(targetVersion) {
  if (getCookieParam("navi_device") !== "22") {
    return false;
  }

  var match = navigator.userAgent.match(/AS(\s2\.0)?\;([\d\.]+);/);
  if (match && match.length === 2 && parseFloat(match[1]) >= targetVersion) {
    return true;
  } else if (
    match &&
    match.length === 3 &&
    parseFloat(match[2]) >= targetVersion
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * CFアプリ用Chromecast接続状態変更コールバック
 */
function castAvailable(availability) {
  if (availability != null && availability != "" && availability != "NULL") {
    isCastAvailable = true;
    // 他のjsで接続状態を取得したい場合changeCastStatusを定義して処理を行う
    if (typeof changeCastStatus == "function") {
      changeCastStatus(true);
    }
  } else {
    isCastAvailable = false;
    // 他のjsで接続状態を取得したい場合changeCastStatusを定義して処理を行う
    if (typeof changeCastStatus == "function") {
      changeCastStatus(false);
    }
  }
}

/**
 * iOSアプリ用Chromecast接続状態変更コールバック
 */
$(function () {
  if (getCookieParam("navi_device") == "32" || checkCfAppVersion(16)) {
    // 17R1以前のCFアプリで評価されないようscriptタグを読み込み時に追加する
    var isCastAvailableScript = document.createElement("script");
    isCastAvailableScript.innerHTML =
      "window.dAnimeStoreJk = window.dAnimeStoreJk || {};" +
      "dAnimeStoreJk.castAvailable = function(deviceId) {" +
      "if (deviceId != null && deviceId != '' && deviceId != 'NULL') {" +
      "isCastAvailable = true;" +
      "if (typeof changeCastStatus == 'function') {" +
      "changeCastStatus(true);" +
      "}" +
      "} else {" +
      "isCastAvailable = false;" +
      "if (typeof changeCastStatus == 'function') {" +
      "changeCastStatus(false);" +
      "}" +
      "}" +
      "};";

    if (getCookieParam("navi_device") == "32") {
      var queryParams = getQueryString();
      var notRunIfFlag = isnotRunIf(queryParams);

      if (!notRunIfFlag) {
        isCastAvailableScript.innerHTML =
          isCastAvailableScript.innerHTML +
          "$(function(){" +
          "location.href = 'jp.co.nttdocomo.animestore.isCastAvailable://';" +
          "});";
      }
    }

    document.body.appendChild(isCastAvailableScript);
  }
});

/**
 * 二重押下抑止
 */
function checkView() {
  if (viewBtnFlag) {
    return false;
  } else {
    viewBtnFlag = true;
    // 3秒後に二重押下抑止を解除する
    setTimeout(function () {
      viewBtnFlag = false;
    }, 3000);
    return true;
  }
}

function getQueryString() {
  var queryParams = {};

  if (1 < window.location.search.length) {
    var query = window.location.search.substring(1);

    var parameters = query.split("&");
    for (var i = 0; i < parameters.length; i++) {
      var element = parameters[i].split("=");

      var paramKey = decodeURIComponent(element[0]);
      var paramValue = decodeURIComponent(element[1]);

      queryParams[paramKey] = paramValue;
    }
  }
  return queryParams;
}

function isnotRunIf(queryParams) {
  if (!("notRunIfFlag" in queryParams)) {
    return false;
  }

  var notRunIfFlag = queryParams["notRunIfFlag"];

  if (notRunIfFlag != "1") {
    return false;
  }

  return true;
}

/**
 * cookie取得
 */
function getCookieParam(cookieKey) {
  var cookies = document.cookie.split(";");
  var targetValue = "";
  for (var i = 0; i < cookies.length; i++) {
    cookies[i] = cookies[i].replace(/^\s+|\s+$/g, "");

    if (cookies[i].indexOf(cookieKey) !== -1) {
      var str = cookies[i].split("=");

      // 同名を含むクッキーパラメータが存在した場合の対策
      if (str[0] === cookieKey) {
        targetValue = str[1];
        break;
      }
    }
  }

  return targetValue;
}

/**
 * 限定コンテンツ判定
 */
function isLimitedContents(id) {
  if (id == null || id.toString() == "") {
    return false;
  }

  var limitedInitial = "C";

  if (id.toString().substr(0, 1) == limitedInitial) {
    return true;
  } else {
    return false;
  }
}

/**
 * 途中から再生用再生開始位置をミリ秒に変換
 * (1h23m55s100ms→5035100)
 */
function changeStartPositionToMillisecond(position) {
  var hour = 0;
  var minute = 0;
  var second = 0;
  var millisecond = 0;

  position = position.toString();
  if (position == "") {
    return null;
  }

  // ミリ秒「ms」は先に除去しておく(「m」「s」があるため)
  if (position.indexOf("ms") != -1) {
    position = position.substr(0, position.indexOf("ms"));
  }

  // 時「h」を取得
  if (position.indexOf("h") != -1) {
    hour = parseFloat(position.substr(0, position.indexOf("h")));
    position = position.substr(position.indexOf("h") + 1);
  }
  // 分「m」を取得
  if (position.indexOf("m") != -1) {
    minute = parseFloat(position.substr(0, position.indexOf("m")));
    position = position.substr(position.indexOf("m") + 1);
  }
  // 秒「s」を取得
  if (position.indexOf("s") != -1) {
    second = parseFloat(position.substr(0, position.indexOf("s")));
    position = position.substr(position.indexOf("s") + 1);
  }
  // ミリ秒「ms」を取得
  if (position != "") {
    millisecond = parseFloat(position);
  }

  return parseInt(((hour * 60 + minute) * 60 + second) * 1000 + millisecond);
}

/**
 * ストアログ送信
 */
function sendStoreLog(partId, goodsCd) {
  // スゴ得会員は送信しない
  if (getCookieParam("sugotoku_member_status") === "1") {
    return;
  }

  // ストアログで送信する操作種別
  var operateKind = "102";
  // 個別課金かどうかで値を変更する
  if (!isLimitedContents(partId)) {
    // 既にgoodsCdを取得済の場合は再取得しない
    if (goodsCd == null) {
      goodsCd = getGoodsCd(partId);
    }
    if (goodsCd == "1") {
      operateKind = "105";
    }
  }
  // 作品ID
  var workId = partId.toString().substr(0, 5);

  // 画面読み込み完了後にストアログ送信用jsが読み込まれていない場合読み込む
  setTimeout(function () {
    var sendTime = 0;
    if (typeof stlog === "undefined") {
      var script = document.createElement("script");
      script.src = "https://stlog.d.dmkt-sp.jp/js/regStlog.js";
      document.body.appendChild(script);
      sendTime = 1000;
    }

    setTimeout(function () {
      stlog.logrecord({ operate_kind: operateKind, contents_id: [workId] });
    }, sendTime);
  }, 1000);
}

/**
 * 商品種別取得
 */
function getGoodsCd(partId) {
  var goodsCd = null;
  var getGoodsCd_api_url = "/animestore/rest/WS000112?partId=" + partId;
  $.ajax({
    type: "GET",
    url: getGoodsCd_api_url,
    cache: false,
    async: false,
    success: function (json) {
      if (json.resultCd == "00") {
        goodsCd = json.data.goodsCd;
      }
    },

    error: function (xhr, textStatus, errorThrown) {},
  });
  return goodsCd;
}

/**
 * 基準画質Cookie更新
 */
function updateStandardBitrateCdCookie(defaultPlay) {
  if (navigator.cookieEnabled) {
    // 現在の日付データを取得
    var date = new Date();

    // Integer.MAX_VALUE(JavaScriptでは取得できないので定数化)
    var integerMax = 2147483647;

    // cookieの有効期限
    date.setTime(date.getTime() + integerMax * 1000);

    // GMT形式に変換
    var expires = date.toGMTString();

    // クッキーに基準画質を保持
    document.cookie =
      "standard_bitrate_cd=" + defaultPlay + ";path=/;expires=" + expires;
  }
}

/**
 * 年齢認証ダイアログ表示処理
 */
function showAgeCheckDialog(type, resultCd, registFunc, closeFunc) {
  if (resultCd == "35") {
    var title;
    if (type == "1" || type == "4") title = "本作品の視聴について";
    if (type == "2") title = "本作品のレンタルについて";
    if (type == "3") title = "年齢確認";

    // ダイアログ表示
    window.COMMON.showDialog({
      title: title,
      text: "あなたは15歳以上ですか？",
      button1Text: "はい",
      button1Callback: function () {
        // 年齢確認結果登録IF呼び出し
        registAgeCheckResult(type, "1", registFunc, closeFunc);
      },
      button2Text: "いいえ",
      button2Callback: function () {
        // 年齢確認結果登録IF呼び出し
        registAgeCheckResult(type, "0", registFunc, closeFunc);
      },
      closeCallback: function () {
        if (typeof closeFunc === "function") {
          closeFunc();
        }
      },
    });
  }

  if (
    resultCd == "34" ||
    resultCd == "36" ||
    resultCd == "37" ||
    resultCd == "38" ||
    resultCd == "39"
  ) {
    // TODO チケット10185のURLが決定次第リンク追加
    // TODO 年齢認証IFエラー時文言決定次第修正
    var text;
    if ((type == "1" || type == "4") && resultCd == "34")
      text = "年齢制限のある作品のため視聴できません。";
    if ((type == "1" || type == "4") && resultCd == "36")
      text = "お客様の年齢では本作品は視聴できません。";
    if ((type == "1" || type == "4") && resultCd == "37")
      text =
        '利用者情報の提供が拒否されているため、年齢制限のある作品は視聴できません。設定方法は<a href="/animestore/CF/help_qa_age_verification">こちら</a>をご確認ください。';
    if ((type == "1" || type == "4") && resultCd == "38")
      text =
        '契約者による利用者情報拒否設定がされているため、年齢制限のある作品は視聴できません。詳しくは<a href="/animestore/CF/help_qa_age_verification">こちら</a>をご確認ください。';
    if (type == "2" && resultCd == "36")
      text = "お客様の年齢では本作品はレンタルできません。";
    if (type == "2" && resultCd == "37")
      text =
        '利用者情報の提供が拒否されているため、年齢制限のある作品はレンタルできません。設定方法は<a href="/animestore/CF/help_qa_age_verification">こちら</a>をご確認ください。';
    if (type == "2" && resultCd == "38")
      text =
        '契約者による利用者情報拒否設定がされているため、年齢制限のある作品はレンタルできません。詳しくは<a href="/animestore/CF/help_qa_age_verification">こちら</a>をご確認ください。';
    if (type == "3" && resultCd == "36")
      text =
        "お客様の年齢では年齢制限のある作品を視聴またはレンタルできません。";
    if (type == "3" && resultCd == "37")
      text =
        '利用者情報の提供が拒否されているため、年齢制限のある作品を視聴またはレンタルできません。設定方法は<a href="/animestore/CF/help_qa_age_verification">こちら</a>をご確認ください。';
    if (type == "3" && resultCd == "38")
      text =
        '契約者による利用者情報拒否設定がされているため、年齢制限のある作品を視聴またはレンタルできません。詳しくは<a href="/animestore/CF/help_qa_age_verification">こちら</a>をご確認ください。';
    if (resultCd == "39")
      text =
        "お客様の年齢が確認できませんでした。しばらく待ってから再度お試しください。";

    // ダイアログ表示
    window.COMMON.showDialog({
      showTitleBar: false,
      text: text,
      button1Text: "閉じる",
      button1Callback: function () {
        if (typeof closeFunc === "function") {
          closeFunc();
        }
      },
      closeCallback: function () {
        if (typeof closeFunc === "function") {
          closeFunc();
        }
      },
    });
  }
}

/**
 * 年齢確認結果登録処理
 */
function registAgeCheckResult(type, paramResult, registFunc, closeFunc) {
  var param;
  var url = "/animestore/rest/WS010302";
  var param = { result: paramResult };
  var text;

  if (type == "1") text = "お客様の年齢では本作品は視聴できません。";
  if (type == "2") text = "お客様の年齢では本作品はレンタルできません。";
  if (type == "3")
    text = "お客様の年齢では年齢制限のある作品を視聴またはレンタルできません。";

  window.COMMON.restPost(url, param)
    .done(function (data) {
      // 登録成功後の処理
      if (paramResult == "1") {
        if (typeof registFunc === "function") {
          registFunc();
        }
      } else {
        if (type == "4") {
          if (typeof closeFunc === "function") {
            closeFunc();
          }
          return;
        }
        window.COMMON.showDialog({
          showTitleBar: false,
          text: text,
          button1Text: "閉じる",
          button1Callback: function () {
            if (typeof closeFunc === "function") {
              closeFunc();
            }
          },
          closeCallback: function () {
            if (typeof closeFunc === "function") {
              closeFunc();
            }
          },
        });
      }
    })
    .fail(function (errorCode) {
      // エラー表示
      window.COMMON.showDialog({
        showTitleBar: false,
        text: "選択内容の登録に失敗しました",
        button1Text: "閉じる",
        button1Callback: function () {
          if (typeof closeFunc === "function") {
            closeFunc();
          }
        },
        closeCallback: function () {
          if (typeof closeFunc === "function") {
            closeFunc();
          }
        },
      });
    });
}
