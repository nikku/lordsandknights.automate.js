var BATTLETYPE = {
  OWN_HABITAT: 0,
  EXTERNAL_UNITS_TO_DEFENSE: 1,
  ATTACKER: 2
};

var TRANSITTYPE = {
  DEFENSE: 0,
  TRANSIT_DEFENSE: 1,
  ATTACKER: 2,
  TRANSIT_ATTACKER: 3,
  TRANSPORT: 4,
  TRANSIT_TRANSPORT: 5,
  SPY: 6,
  TRANSIT_SPY: 7
};

var ALLIANCEPERMISSIONTYPE = {
  ALLIANCE_PERMISSION_INVITE_PLAYER: 1,
  ALLIANCE_PERMISSION_DISMISS_PLAYER: 2,
  ALLIANCE_PERMISSION_MODERATE_FORUM: 4,
  ALLIANCE_PERMISSION_MASS_MAIL: 8,
  ALLIANCE_PERMISSION_DIPLOMATIC_RELATIONS: 16,
  ALLIANCE_PERMISSION_PLAYER_PERMISSIONS: 32,
  ALLIANCE_PERMISSION_DISBAND_ALLIANCE: 64
//  ALLIANCE_PERMISSION_PROMOTE_LEADER: 128
};

var REPORTTYPE = {
  TYPE_ATTACK_WARNING : 1,
  TYPE_LOST_FOREIGN_DEFENDER : 9,
  TYPE_BATTLE_ROUND_FINISHED : 8,
  TYPE_CONQUEST : 11,
  TYPE_CONQUEST_FAILED : 10,
  TYPE_TRANSIT_RETURNED : 6,
  TYPE_DELIVERED_RESOURCES : 14,
  TYPE_KNOWLEDGE_RESEARCHED : 3,
  TYPE_MISSION_FINISHED : 2,
  TYPE_SPY_FINISHED : 7,
  TYPE_SPY_CAPTURED : 13
};

var DIPLOMACYTYPE = {
    TYPE_ALLY : 2,
    TYPE_NAP : 1,
    TYPE_FOE : -1,
    TYPE_VASSAL : 3,
    TYPE_NEUTRAL :0
};


var SESSIONJOBTYPE = {
  SESSION: 0,
  BUILDINGUPGRADE: 1,
  UNITORDER: 2,
  TRANSIT: 3,
  MISSION: 4,
  KNOWLEDGEORDER: 5,
  ALLIANCERELATIONSHIP: 6,
  ATTACK: 7
};

var MODIFIERTYPE = {
  BUILDCOST: 0, // pay less (unit, building, knowledge, mission)
  BUILDSPEED: 1, // build faster (unit, building, knowledge)
  AMOUNTSTORE: 2, // store more (unit, building)
  AMOUNTGENERATE: 3, // generate more (building, mission)
  OFFENSE : 4, // attack stronger (unit, building)
  DEFENSE : 5, // defend stronger (unit, building)
  MOVEMENTSPEED: 6 // move faster (unit, mission)
};

var mSettings;
var mTimeDifferenceToServer;
var mSession;
var mUniqueID;
var mStringtable;
var mCurrentActionBlocked;
var mSound;
var mTopBar;
var mBottomBar;
var mPictureCounts = {};
var mResources = {};
var mMissions = {};
var mModifiers = {};
var mKnowledges = {};
var mUnits = {};
var mBuildings = {};
var mPlayer;
var mMessagesView = null;
var mReportsView = null;
var mAllianceView = null;
var mBuildingName;
var mBuildingID;
var mUpgradeToID;
var mDependentBuilding;
var mSelectedUnits;
var mSelectedResources;
var mAmountValues;
var mResValues;
var mCurrentBuilding;
var mCurrentKey;
var mNightModusActive;
var mAllianceForum = null;
var mProfileView;
//var mLastAction;
var mRecruitingListValues = null;
var mRecruitingView;
var mExchangeView;
var mExchangeBuilding;
var mExchangeResourceId;
var mHabitatView;

var mTabs;
var mGoldView;

var mResolution = "";
var mBoxId = 0;

var mPapyrusSize1x;
var mPapyrusSize2x;

var mCornersBigBoxSize1x;
var mCornersBigBoxSize2x;
var mCornersBigOffset;

var mCornersSmallBoxSize1x;
var mCornersSmallBoxSize2x;
var mCornersSmallOffset;

/*
var mServer;
var mLanguage;
var email;
var password;
var worldID;
var mLogoutUrl;
var mapUrl;
*/

var mSessionSecoundsForBlock = 10;

var mMapStackUsed;

var str_mCurrentAction = "";
var building_list_scroll_position = 0;

var mChangedHabitatName = false;
var playerProfileCloseButton = false;

var propertyListVersion = "3";

var globalTimeout = "60000";

var globalTouchDate = "";

var timeoutId = 0;

//just for  assense development
/*$(document).ready(function() {
  initGame();
});*/


function initGame() {

  mCurrentActionBlocked = false;

  initPictureArray();
  initGlobalPictureDirectories();
  initGlobalBackgroundImageDimensions();
  init();

  if(oneTimeLoginHash === "") {
  	tryToConnect();
  } else {
  	tryToConnectOneTime();
  }

  mTopBar.addToBody();
  $.tmpl("viewportTmpl", mPlayer).appendTo($("#" + mDivId));
  mBottomBar.addToBody();

  windowSize();

  Animation_controller.preload();

  $(window).resize(function() {
    windowSize();
    window_size_for_map();
  });

  $().maxlength();
  getGameVersion();

  processOneTimeLogin();
};

function processOneTimeLogin() {
  switch(oneTimeAction) {
    case "paymentAborted":
      openInformationPapyrusBox("payment aborted");
      break;
    case "paymentSuccessful":
    	var paymentSessionIdentifier = getURLParameter("paymentSession.identifier");
    	if(paymentSessionIdentifier !== "null") {
			/* Do payment processing on the backend */
			var successfullRequest = false;
			var paramObject = {"paymentSession.identifier": paymentSessionIdentifier, "PropertyListVersion": "3"};
			$.getJSON(mServer + 'PaymentAction/processPayment?callback=?', paramObject, function(data)
			{
				if(data.error != null)
				{
					openInformationPapyrusBox(data.error, false);
				}
				else if(data.info != null)
				{
					//$("#statusImage").attr("src", "<?php echo bloginfo('template_url');?>/images/success.png");
					openInformationPapyrusBox(data.info);
					successfullRequest = true;
				}
			});
		} else {
			openInformationPapyrusBox("payment successful");
		}
      break;
  }
}

function openInformationPapyrusBox(message, translate) {
  if(translate == true || typeof translate === "undefined") {
  	message = mStringtable.getValueOf(message);
  }
  showPapyrusMsgBox(message, mStringtable.getValueOf("Information"), redirect, false, false);
}

function window_size_for_map(){

  if (str_mCurrentAction  == "openMap") {

//    Mapcenter.updateXY_window_size();
    if (  Nmap.set_wh() ){
      map_json_request();
    }else{
      generate_map();
    }
  }
  if (str_mCurrentAction == "openPolMap"){
    wmap.start();
  }
  if (str_mCurrentAction == "habitatView"){
    Animation_controller.preload();
    Animation_controller.start();
  }
}

function tryToConnect() {
  blockUI("Loading...");

  var parameters = {};
  parameters["login"] = email;
  parameters["password"] =  password;
  parameters["worldId"] = worldID;
  parameters["logoutUrl"] = mLogoutUrl;
  parameters["PropertyListVersion"] = propertyListVersion;
  genericAjaxRequest("LoginAction/connectBrowser", parameters, "connect", 5000);
  /*
  $.ajax({
    type: "POST",
    dataType: "jsonp",
    url: mServer + "LoginAction/connectBrowser",
    data: {
      "login": email,
      "password": password,
      "worldId": worldID,
      "logoutUrl" : mLogoutUrl,
      "PropertyListVersion": propertyListVersion
    },
    jsonp: "callback",
    jsonpCallback: "connect",
    error:function (xhr, ajaxOptions, thrownError){
      jsonp_error(xhr, ajaxOptions, thrownError);
    },
    timeout : 5000
  });*/
}

function tryToConnectOneTime() {
  blockUI("Loading...");

  var parameters = {};
  parameters["hash"] = oneTimeLoginHash;
  parameters["PropertyListVersion"] = propertyListVersion;
  genericAjaxRequest("LoginAction/connectBrowserOneTime", parameters, "connect", 5000);
  /*
	$.ajax({
    type: "GET",
    dataType: "jsonp",
    url: mServer + "LoginAction/connectBrowserOneTime",
    data: {
      "hash": oneTimeLoginHash,
      "PropertyListVersion": propertyListVersion
    },
    jsonp: "callback",
    jsonpCallback: "connect",
    error:function (xhr, ajaxOptions, thrownError){
      jsonp_error(xhr, ajaxOptions, thrownError);
    },
    timeout : 5000
  });*/
}

function jsonp_error(XHR, textStatus, errorThrown){
  if(XHR.status != 200 && XHR.readyState != 4){
     errorThrown = mStringtable.getValueOf("Server is offline");
     showPapyrusMsgBox( errorThrown, false, redirect, false, false);
  }
}

function showPapyrusMsgBox( msg, title, event, parameters, cansel ){

     if(mIsBlocked)  unblockUI();// $.msg('unblock');
     if (typeof title == "undefined" || title == false) title = mStringtable.getValueOf("Error");
     if (typeof cansel == "undefined") cansel = false;
     $("#dialog:ui-dialog").dialog("destroy");
     $(".ui-dialog-title").text(title);
     $("#dialog-confirm").attr("title", title);
     $("#dialog-confirm > p").html( msg );

     var but = [];
     i = 0;
     if (cansel){
       but[i] = {
              text: mStringtable.getValueOf("cancel"),
              click: function() {$(this).dialog("close");}
       };
       i = 1;
     }
     but[i] = {
            text: mStringtable.getValueOf("ok"),
            click: function() {
              $(this).dialog("close");
              if (typeof event != "undefined" && event != false)  {
                if (typeof parameters == "undefined" ||  parameters == false){
                  event();
                } else {
                  event( parameters );
                }
              }
            }
         };

     $("#dialog-confirm").dialog({
        resizable: false,
        width: 389,
        modal: true,
        draggable: false,
        buttons:but,
        open: function () {
          //$(this).parents('.ui-dialog-buttonpane button:eq(1)').focus();
          //$(this).find('.ui-dialog-buttonset :button').blur();
          //jQuery('.ui-dialog-buttonset input:last').focus();
           jQuery('.ui-dialog-buttonset button:last').focus();
        }

     });

}

function redirect(){
  //tryToConnect();
  //window.location = '/login';
}

function windowSize() {

  var minWinW = 760;
  var minWinH = 570;

  var winW = 760;
  var winH = 570;
  var offsetRightSide = 0; // test for IE
  var papyrusMiddleWidth=1;

  if (document.body && document.body.offsetWidth) {
    winW = document.body.offsetWidth;
    winH = document.body.offsetHeight;
  }
  if (document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.offsetWidth) {
    winW = document.documentElement.offsetWidth;
    winH = document.documentElement.offsetHeight;
  }
  if (window.innerWidth && window.innerHeight) {
    winW = window.innerWidth;
    winH = window.innerHeight;
  }

  // 2x (hier ändert sich nichts bei session update)
  if (winW / minWinW > 2.0) {
  //if ( mResolution != "2x"){
      mResolution = "2x";
      offsetRightSide = 18;
      papyrusMiddleWidth = mPapyrusSize2x - 2;
      mCornersBigOffset = mCornersBigBoxSize2x;
      mCornersSmallOffset = mCornersSmallBoxSize2x;

      $(".topbar").addClass("topbar2x");
      $(".bottombar").addClass("bottombar2x");

      // resource field
      $(".resField_Mid").addClass("resField_Mid2x");
      $(".resField_Right").addClass("resField_Right2x");
      $(".resField_Left").addClass("resField_Left2x");

      $(".viewport").addClass("viewport2x");

      $(".ui-state-active").addClass(".ui-state-active2x");
      $(".ui-state-default").addClass(".ui-state-default2x");

      // gameBoard
     //$("#gameBoardInner").addClass("gameBoardPosition2x");

     //$(".allyAndPointsContainter").css("top","55px");
      $("img.allyImage").css("width","11px").css("height","11px");

  //}

  } // default */
  else if (winW / minWinW <= 2.0){
  //if (mResolution != "default"){
    mResolution = "default";
    offsetRightSide = 5;
    papyrusMiddleWidth = mPapyrusSize1x - 2;
    mCornersBigOffset = mCornersBigBoxSize1x;
    mCornersSmallOffset = mCornersSmallBoxSize1x;

    $(".topbar").removeClass("topbar2x");
    $(".bottombar").removeClass("bottombar2x");

    // resource field
    $(".resField_Mid").removeClass("resField_Mid2x");
    $(".resField_Right").removeClass("resField_Right2x");
    $(".resField_Left").removeClass("resField_Left2x");

    $(".viewport").removeClass("viewport2x");

    $(".ui-state-active").removeClass(".ui-state-active2x");
    $(".ui-state-default").removeClass(".ui-state-default2x");

    // gameBoard
    //$("#gameBoardInner").removeClass("gameBoardPosition2x");
  //}

    //$(".allyAndPointsContainter").css("top","49px");
    $("img.allyImage").css("width","8px").css("height","8px");





  }



  var topbarHeight = $(".topbar").height();
  var bottomBarHeight = $(".bottombar").height();
  var viewportPadding = $(".viewport").css("padding-top");

  // if a headline is there
  var headlineHeight = 0;
  if ($("#mapHeadlineAndCloseButtonContainer").length > 0){
    headlineHeight = $(".calculateHeadline").height();
  }

  var height = winH - topbarHeight - bottomBarHeight - parseInt(2 * viewportPadding.substring(0, viewportPadding.indexOf("px")));
  $(".viewport").height(height);

  var img_wall_width = $("img.wall").width();
  if (img_wall_width < 1 ) img_wall_width = Math.round((640 * height / 734)*92/100);
  $("#habitatView > .background").width( img_wall_width );

  var rightside_width  = Math.floor(winW - img_wall_width - (2 * getCssWithOutPx($(".viewport").css("padding-left"))) - getCssWithOutPx($("#tabsBuildingUnitList").css("margin-left")) - getCssWithOutPx($(".rightside").css("margin-left")) - 24 ) - offsetRightSide - 20;

  $(".rightside").width( rightside_width );

  //$("#habitatView > div.background > div.right").css("right","-4.5%");

  $(".isPapyrusOrnament .papyruscontent").height(Math.floor($(".isPapyrusOrnament .papyrusbg").height() - (2 * getCssWithOutPx($(".isPapyrusOrnament .papyruscontent").css("margin-top")))));
  $(".isPapyrusPlain .papyruscontent").height(Math.floor($(".isPapyrusPlain .papyrusbg").height() - (2 * getCssWithOutPx($(".isPapyrusPlain .papyruscontent").css("margin-top")))));
  $(".isPapyrusOrnamentFullScreen .papyruscontent").height(Math.floor($(".isPapyrusOrnamentFullScreen .papyrusbg").height() - (2 * getCssWithOutPx($(".isPapyrusOrnamentFullScreen .papyruscontent").css("margin-top")))));

  var papyrusMiddleOffset = $(".isPapyrusOrnament").find("div.papyrusbg").width() -  2 * papyrusMiddleWidth;
  var papyrusMiddleHeight = $(".isPapyrusOrnament").find("div.papyrusbg").height() - 2 * papyrusMiddleWidth;
  //$(".isPapyrusOrnament td.varWidth").each(function() {
  //  $(this).width(papyrusMiddleOffset * 0.5);
  //});
  var temp_width = papyrusMiddleOffset * 0.5;
  $(".isPapyrusOrnament td.varWidth").width(temp_width);

  var temp_height = papyrusMiddleHeight * 0.5;
  $(".isPapyrusOrnament td.varHeight").height(temp_height);
  //$(".isPapyrusOrnament td.varHeight").each(function() {
   // $(this).height(papyrusMiddleHeight * 0.5);
  //});

  switchImages();
  switchPapyrusBackgroundImage();
  switchRoundCornersForBigBoxes();
  switchRoundCornersForSmallBoxes();
  switchIDs();

  papyrusMiddleOffset = $(".isPapyrusOrnamentFullScreen").find("div.papyrusbg").width() - 2 * papyrusMiddleWidth;
  papyrusMiddleHeight = $(".isPapyrusOrnamentFullScreen").find("div.papyrusbg").height() - 2 * papyrusMiddleWidth;

  $(".isPapyrusOrnamentFullScreen td.varWidth").width(papyrusMiddleOffset * 0.5);
  $(".isPapyrusOrnamentFullScreen td.varHeight").height(papyrusMiddleHeight * 0.5);

  // fullscreen (kann weg)
  if ($(".fullscreeninner").length > 0) {
    var fullscreeninnerHeight = height - (2 * getCssWithOutPx($(".fullscreeninner").css("margin-top")));
    $(".fullscreeninner").height(fullscreeninnerHeight);

    if ($(".fullscreeninner .left50")) {
      $(".fullscreeninner .left50 .content").height(fullscreeninnerHeight - (2 * getCssWithOutPx($(".fullscreeninner").css("margin-top"))) - $(".headline").height() - $(".fullscreeninner .left50 .toolbar").height() - (2 * getCssWithOutPx($(".fullscreeninner .left50 .toolbar").css("padding-top"))) - (2 * getCssWithOutPx($(".fullscreeninner .left50 .content").css("margin-top"))));
    }

    if ($(".fullscreeninner .right50")) {
      $(".fullscreeninner .right50 .content").height(fullscreeninnerHeight - (2 * getCssWithOutPx($(".fullscreeninner").css("margin-top"))) - $(".headline").height() - $(".fullscreeninner .right50 .toolbar").height() - (2 * getCssWithOutPx($(".fullscreeninner .right50 .toolbar").css("padding-top"))) - (2 * getCssWithOutPx($(".fullscreeninner .right50 .content").css("margin-top"))));
    }
  }

  var h = parseInt ( height );
  // fullscreeninnerWithHeadlineAndPapyrus
  if ($(".fullscreeninnerWithHeadlineAndPapyrus").length > 0) {
    var pap = (2 * getCssWithOutPx($(".papyruscontent").css("margin-top")));
    var tpo = 2 * getCssWithOutPx($(".fullscreeninnerWithHeadlineAndPapyrus").css("margin-top"));
    var fullscreeninnerHeight = height - tpo - headlineHeight - pap;

    $(".fullscreeninnerWithHeadlineAndPapyrus").height(fullscreeninnerHeight);

    h = parseInt ( fullscreeninnerHeight * 0.80 );
    //h = parseInt ( fullscreeninnerHeight * 0.75 );
    if ( str_mCurrentAction == "openPlayerView" ) h = parseInt ( fullscreeninnerHeight * 0.85 );
  }

  $(".noscroll").height( h );
  $(".right50").scrollTop(   parseInt ( $("#discussionentrylist").height()) );
  //$(".left50").scrollTop(0);
  if ( $(".noscroll").scrollTop() > 0) $(".noscroll").scrollTop(h);



  // adjustment for forum- and message-width in case of very long strings

  messageWidth = $(".floatingright").width() - 175;
  if(mResolution == "2x"){
    forumWidth = parseInt($(".noscroll2").width() / 2) - 180;
  }
  else {
    forumWidth = parseInt($(".noscroll2").width() / 2) - 120;
  }

  allianceTopWidth = parseInt($(".noscroll2").width() * 24 / 100);
  //allianceWidth = parseInt($(".left50").width() * 52 / 100);
  //$(".profilDetails").find(".textinformation").css("width", allianceWidth);
  $(".profilDetails").find(".textinformation").css("width", allianceTopWidth);

  $("#discussionentrys").find(".messageWidth").css("width",messageWidth);
  $("#discussionentrys").find(".forumWidth").css("width",forumWidth);


  // adjustment for forum-icon in bottom bar
  var titleField = mStringtable.getValueOf("Forum");
  if(typeof mPlayer != "undefined"){
    if(mPlayer.alliance == null){
      if(mResolution == "2x"){
        $("a.button[title^="+ titleField +"]").addClass("disabledFroumButton2x");
        $("a.button[title^="+ titleField +"]").removeClass("disabledFroumButton");
      }
      else {
        $("a.button[title^="+ titleField +"]").addClass("disabledFroumButton");
        $("a.button[title^="+ titleField +"]").removeClass("disabledFroumButton2x");
      }
    }
    else {
      $("a.button[title^="+ titleField +"]").removeClass("disabledFroumButton");
      $("a.button[title^="+ titleField +"]").removeClass("disabledFroumButton2x");
    }
  }

  set_height_scroll( h );

}


function set_height_scroll( h ){
	  var h = parseInt(h);
	  if ($("#tablecontainer").length > 0 ) {
	    if(mResolution == "2x"){
	      $("#tablecontainer").height( $(".viewport").height()*0.6 );
	    } else {
	      $("#tablecontainer").height( $(".viewport").height()*0.68 );
	    }
	  }

	  if ($("#div_playertable_scroll").length > 0 ) {
	     if(mResolution == "2x"){
	    	 $("#div_playertable_scroll").height( $(".viewport").height()*0.57);
		  }else {
		    $("#div_playertable_scroll").height( $(".viewport").height()*0.63);
		  }
	  }

	  if ($("#div_playerhabite_scroll").length > 0 ) {
		     if(mResolution == "2x"){
		    	 $("#div_playerhabite_scroll").height( $(".viewport").height()*0.57);
			  }else {
			     $("#div_playerhabite_scroll").height( $(".viewport").height()*0.63);
			  }
	  }

	  if ($("#ally_members_list").length > 0 ) {
	      if(mResolution == "2x"){
	    	  $("#ally_members_list").height( h * 0.64 );
		  }else {
			  $("#ally_members_list").height( h * 0.68 );
		  }
	  }

	  if ($("#div_ranking_scroll").length > 0 ) {
	      if(mResolution == "2x"){
	    	  $("#div_ranking_scroll").height( h * 0.90 );
	    	  $("#div_rankingAverage_scroll").height( h * 0.90 );
		  }else {
			  $("#div_ranking_scroll").height( h  );
			  $("#div_rankingAverage_scroll").height( h  );
		  }
	  }

	  if ($("#div_invitations_scroll").length > 0 ) {
	      if(mResolution == "2x"){
	    	  $("#div_invitations_scroll").height( h * 0.91);
		  }else {
			  $("#div_invitations_scroll").height( h);
		  }
	  }

	  if ($("#div_permissions_scroll").length > 0 ) {
		  if(mResolution == "2x"){
			  $("#div_permissions_scroll").height( h * 0.90 );
		  }else {
			  $("#div_permissions_scroll").height( h );
		  }
	  }

	  if ($("#div_buildtable_scroll").length > 0 ) {
	    if(mResolution == "2x"){
	      $("#div_buildtable_scroll").height( h * 0.93 );
	    }else {
	      $("#div_buildtable_scroll").height( h );
	    }
	  }

	  if ($("#div_transit_scroll").length > 0 ) {
		  if(mResolution == "2x"){
			  $("#div_transit_scroll").height( h * 0.83 );
		  }else {
			  $("#div_transit_scroll").height( h * 0.95 );
		  }
	  }

	  if ($("#div_mission_scroll").length > 0 ) {
		  if(mResolution == "2x"){
			  $("#div_mission_scroll").height( h * 0.83 );
		  }else {
			  $("#div_mission_scroll").height( h * 0.93 );
		  }
	  }

	  if ($("#div_defending_scroll").length > 0 ) {
		  if(mResolution == "2x"){
			  $("#div_defending_scroll").height( h * 0.83 );
		  }else {
			  $("#div_defending_scroll").height( h * 0.93 );
		  }
	  }

	  if ($("#div_attacking_scroll").length > 0 ) {
      if(mResolution == "2x"){
        $("#div_attacking_scroll").height( h * 0.83 );
      }else {
        $("#div_attacking_scroll").height( h * 0.93 );
      }
    }

	  if ($("#div_external_scroll").length > 0 ) {
		  if(mResolution == "2x"){
			  $("#div_external_scroll").height( h * 0.83 );
		  }else {
			  $("#div_external_scroll").height( h * 0.93 );
		  }
	  }
	  if ($("#div_battle_scroll").length > 0 ) {
		  if(mResolution == "2x"){
			  $("#div_battle_scroll").height( h * 0.83 );
		  }else {
			  $("#div_battle_scroll").height( h * 0.93 );
		  }
	  }

	  if ($("#div_exuser_scroll").length > 0 ) {
		  if(mResolution == "2x"){
			  $("#div_exuser_scroll").height( h * 0.75 );
		  }else {
			  $("#div_exuser_scroll").height( h * 0.72 );
		  }
	  }

	  if ($("#reportsView_mainContent").length > 0 ) {
      if(mResolution == "2x"){
        if(mReportsView && mReportsView.arrayAll.length > 0){
          $("#reportsView_mainContent").height($(".papyruscontent").height() - 270);
        }
        else {
          $("#reportsView_mainContent").height($(".papyruscontent").height() - 350);
        }
      }else {
        if(mReportsView && mReportsView.arrayAll.length > 0){
          $("#reportsView_mainContent").height($(".papyruscontent").height() - 150);
        }
        else {
          $("#reportsView_mainContent").height($(".papyruscontent").height() - 200);
        }
      }
    }


}

function init() {
  $.ajax({
    type: "GET",
    url: "data/settings.json",
    dataType: "json",
    async: false,
    success: function(data) {
      mSettings = new Settings(data);
    }
  });
  mStringtable = new Stringtable();
  mSound = new Sound();
  mTopBar = new TopBar();
  mBottomBar = new BottomBar();

  // detect the browser language if not provided as a query parameter
  detectBadBrowser();
  if(mLanguage === "") {
  	if(browsertype == 'msie') {
    	mLanguage = navigator.userLanguage.slice(0,2);
  	}
  	else {
    	mLanguage = navigator.language.slice(0,2);
  	}
  	if(typeof mLanguage == 'undefined' || mLanguage == null) {
    	mLanguage = "en"; // use english as default
  	}
  }

  // set up the stringtable
  var urlLang = "data/lang/" + mLanguage + ".json";
  mStringtable.setUpTable(urlLang);

  mBottomBar.initializeButtons();
  mBottomBar.initializeStacks();
  mGoldView = new GoldView();
  initTemplates();
  url_for_fb = create_url_for_fb();
}

function initPictureArray() {
  $.ajax({
    type: "GET",
    url: "data/BuildingStageOfExpansion.json",
    dataType: "json",
    async: false,
    success: function(data) {
      $.each(data, function(i, buildingType) {
        var tmpArray = new Array();
        $.each(buildingType.imageNameArray, function(key, value) {
          tmpArray.push(value);
        });
        mPictureCounts[buildingType.baseIdentifier] = tmpArray.length;
      });
    }
  });
}

/**
 * Creates an instance of Template.
 * @constructor
 * @param {String} path The path to the Templatefile.
 * @param {String} name The internal name to use this template.
 */
function Template(path, name) {
  this.path = path;
  this.name = name;
}

function initTemplates() {
  var templates = new Array();

  templates.push(new Template("templates/topBar.html", "topBarTmpl"));
  templates.push(new Template("templates/viewport.html", "viewportTmpl"));
  templates.push(new Template("templates/bottomBar.html", "bottomBarTmpl"));
  templates.push(new Template("templates/habitatView.html", "habitatViewTmpl"));
  templates.push(new Template("templates/habitatBuildingUnitList.html", "habitatBuildingUnitListTmpl"));
  templates.push(new Template("templates/buildingDetails.html", "buildingDetailsTmpl"));
  templates.push(new Template("templates/nextLevelPreview.html", "nextLevelPreviewTmpl"));
  templates.push(new Template("templates/factoryDetails.html", "factoryDetailsTmpl"));
  templates.push(new Template("templates/buildingList.html", "buildingListTmpl"));
  templates.push(new Template("templates/castleList.html", "castleListTmpl"));
  templates.push(new Template("templates/recruitingList.html", "recruitingListTmpl"));
  templates.push(new Template("templates/unitsView.html", "unitsViewTmpl"));
  templates.push(new Template("templates/externPlayerProfile.html", "externPlayerProfileTmpl"));
  templates.push(new Template("templates/messagesView.html", "messagesViewTmpl"));
  templates.push(new Template("templates/messagesViewEntrys.html", "messagesViewEntrysTmpl"));
  templates.push(new Template("templates/reportsView.html", "reportsViewTmpl"));
  templates.push(new Template("templates/reportDetail.html", "reportDetailTmpl"));

  templates.push(new Template("templates/reportDetailOverlay.html","reportDetailOverlayTmpl"));

  templates.push(new Template("templates/allianceReportDetail.html", "allianceReportDetailTmpl"));
  templates.push(new Template("templates/allianceView.html", "allianceViewTmpl"));
  templates.push(new Template("templates/allianceReportsView.html", "allianceReportsViewTmpl"));
  templates.push(new Template("templates/allianceMessagesView.html", "allianceMessagesViewTmpl"));
  templates.push(new Template("templates/allianceMessageEntry.html", "allianceMessageEntryTmpl"));
  templates.push(new Template("templates/allianceranking.html", "allianceRankingTmpl"));
  templates.push(new Template("templates/alliancerankingaverage.html", "allianceRankingAverageTmpl"));
  templates.push(new Template("templates/newAllianceTemplate.html", "newAllianceTmpl"));
  templates.push(new Template("templates/externAllianceProfile.html", "externAllianceProfileTmpl"));
  templates.push(new Template("templates/exchangeView.html", "exchangeViewTmpl"));
  templates.push(new Template("templates/silverGlobal.html", "silverGlobalTmpl"));
  templates.push(new Template("templates/knowledgeMissionDetails.html", "knowledgeMissionViewTmpl"));
  templates.push(new Template("templates/knowledgeMissionDescription.html", "knowledgeMissionDescriptionTmpl"));
  templates.push(new Template("templates/unitDetails.html", "unitDetailsTmpl"));
  templates.push(new Template("templates/unitTroopsDetails.html", "unitTroopsDetailsTmpl"));
  templates.push(new Template("templates/map/own/troops.html", "mapOwnTroopsTmpl"));
  templates.push(new Template("templates/playerView.html", "playerViewTmpl"));
  templates.push(new Template("templates/playerranking.html", "playerRankingTmpl"));
  templates.push(new Template("templates/map/foreignHabitatView.html", "foreignHabitatViewTmpl"));
  templates.push(new Template("templates/map/ownHabitatView.html", "ownHabitatViewTmpl"));
  templates.push(new Template("templates/map/defendForeignHabitatView.html", "defendForeignHabitatViewTmpl"));
  templates.push(new Template("templates/map/defendOwnHabitatView.html", "defendOwnHabitatViewTmpl"));
  templates.push(new Template("templates/map/sendResourcesForeignHabitatView.html", "sendResourcesForeignHabitatViewTmpl"));
  templates.push(new Template("templates/map/sendResourcesOwnHabitatView.html", "sendResourcesOwnHabitatViewTmpl"));
  templates.push(new Template("templates/map/attackView.html", "attackViewTmpl"));
  templates.push(new Template("templates/map/sendSpyView.html", "sendSpyViewTmpl"));
  templates.push(new Template("templates/map/karteView.html", "karteViewTmpl"));
  templates.push(new Template("templates/buyGold.html", "buyGoldTmpl"));
  templates.push(new Template("templates/buyGoldPacketSelection.html","buyGoldPacketSelectionTmpl"));
  templates.push(new Template("templates/buyGoldPaymentSelection.html","buyGoldPaymentSelectionTmpl"));
  templates.push(new Template("templates/buyGoldPaymentOverlay.html","buyGoldPaymentOverlayTmpl"));
  templates.push(new Template("templates/vacationTimer.html", "vacationTimerTmpl"));
  templates.push(new Template("templates/reportSelection.html", "reportSelectionTmpl"));
  templates.push(new Template("templates/globalMissions.html", "globalMissionsTmpl"));
  templates.push(new Template("templates/butGoldGutscheinSelection.html", "buyGoldGutscheinSelectionTmpl"));

  $.each(templates, function(i, template) {
    $.ajax({
      type: "GET",
      url: template.path,
      dataType: "html",
      async: false,
      success: function(data) {
        $.template(template.name, data);
      }
    });
  });
}

function disconnect(data) {
  /*
  if (data.error) {
    showPapyrusMsgBox( mStringtable.getValueOf(data.error), false, logoutEvent, false, false);
  }
  else {*/
    window.location.href=mLogoutUrl;
  //}
}

function logoutEvent(){
  window.location.href=mLogoutUrl;
}

function connect(data) {

  if (data.error) {
    if(data.error == "This App refuses new sessions.") {
      var newPath = data.requestUri.slice(0,data.requestUri.indexOf("LoginAction"));
      var mainPath = mServer.slice(0, mServer.indexOf("/XYRALITY"));
      mServer = newPath + mainPath;
      tryToConnect();
    }
    else {
      //showPapyrusMsgBox(mStringtable.getValueOf(data.error), false, redirect);
      showPapyrusMsgBox( mStringtable.getValueOf(data.error), false, logoutEvent, false, false);
    }
  } else {// if(data.Player) {
    mSettings.updateData(data.defaultValues);

    mTimeDifferenceToServer = Math.ceil(new Date() - jsonDateToDate(data.time));
    mSession = new Session(data.sessionTimeout);
    mUniqueID = new UniqueID();

    $.each(data.Resource, function(i, r) {
      mResources[r.primaryKey] = new Resource(r.identifier, r.primaryKey, r.order);
    });

    $.each(data.Mission, function(i, m) {
      mMissions[m.primaryKey] = new Mission(m);
    });

    $.each(data.Modifier, function(i, m) {
      mModifiers[m.primaryKey] = new Modifier(m);
    });

    $.each(data.Knowledge, function(i, k) {
      mKnowledges[k.primaryKey] = new Knowledge(k);
    });

    $.each(data.Unit, function(i, u) {
      mUnits[u.primaryKey] = new Unit(u);
    });

    $.each(data.Building, function(i, b) {
      mBuildings[b.primaryKey] = new Building(b);
    });

    mTabs = 0;
    mPlayer = new Player(data.player);
    globalTouchDate = data.touchDate;
    setGlobalNightModus(data);
  /*  if(mPlayer.alliance) {
      mPlayer.unreadAllianceMessages = mPlayer.alliance.getUnreadThreadsCount();
    }*/
    if(typeof data.player.habitatDictionary == 'undefined' || Object.size(data.player.habitatDictionary) == 0) {
      //mCurrentActionBlocked = false;
      mPlayer.createNewHabitate();
    }
    else {
      finishConnect();
    }
  } /*else {
    showPapyrusMsgBox(mStringtable.getValueOf("Server is offline"), false, redirect);
  }*/

  wmap_request_bounds();

}

function finishConnect() {
  mTopBar.changeCurrentHabitatFromPlayer();
  mBottomBar.setNewCounts();
  if(mBottomBar.stacksEmpty() == false) {
    mBottomBar.callLastView();
  }
  else {
    mMapStackUsed = false;
    openHabitatView();
    timeoutId = window.setInterval("updateFunction()", 1000);

    unblockUI();
  }
  unblockUI();
}


var x = 0;

function updateFunction() {
  mSession.countDown();
  mPlayer.updateHabitateResources();
  mPlayer.updateAllTimesToComplete();
}

function selectButton(button, stacktype) {
  if(mBottomBar.selectedIndex == button) {
    mBottomBar.clearStack();
  }
  mBottomBar.unselectButton();
  mBottomBar.selectButton(button);
  return false;
}

function selectButtonWithoutClearStack(button, stacktype) {
  mBottomBar.unselectButton();
  mBottomBar.selectButton(button);
  return false;
}

function openHabitatView(target) {
  mTopBar.isOpenCastleList = false;
  str_mCurrentAction = "habitatView";
  selectButton(0, ITEMTYPE.HABITAT_VIEW_ITEM);
  mCurrentActionBlocked = false;
  if(mBottomBar.currentStackIsEmpty()) {
    if(!mHabitatView) {
      mHabitatView = new HabitatView();
    }
    mHabitatView.openHabitat(true);
  }
  else
    mBottomBar.callLastView();

  Animation_controller.start();

}

function openRecruitingList(target) {
  str_mCurrentAction = "";
  selectButton(1, ITEMTYPE.RECRUITINGLIST_VIEW_ITEM);
  mCurrentActionBlocked = true;
  addRecruitingListToStack();
  if(!mRecruitingView) {
    mRecruitingView = new RecruitingView();
  }
  mRecruitingView.listValues = {};
  mRecruitingView.initView();

  $(".name").click(function() {
    mMapStackUsed = true;
    mapActions.reset();
    //boardSetupFromOtherView( $(this).metadata().habitatX, $(this).metadata().habitatY, openOwnHabitatView);
    boardSetup( $(this).metadata().habitatX, $(this).metadata().habitatY );
  });

  $('th.recruittable_unit').tooltip({
  	track: true,
  	delay: 0,
  	showURL: false,
  	showBody: " - ",
  	extraClass: "pretty",
  	fixPNG: true,
  	opacity: 0.95,
  	left: 0,
	bodyHandler: function() {
		return $('#'+ $(this).attr("id") + "_" ).html();
	}
	});
}


function openCastleList(){

   mTopBar.setIsOpenCastleList( true );
   //str_mCurrentAction = "openCastleList";
   mCurrentActionBlocked = true;
   $.tmpl("castleListTmpl", mPlayer).appendTo($("div.viewport").empty());
   setPapyrusBackgroundForFullScreenView();
  // setRoundCornersForSmallBoxes(".smallBoxStyleClass");
   windowSize();

   if (str_mCurrentAction == "openMap"){

   }
   if (str_mCurrentAction == "openPolMap"){
     unregister_wmap_events();
   }

    $("table.btn_hab").click(function() {
     var id = $(this).attr('id');
     $(this).addClass('currenthabitat');
     id = id.match(/\d+/g);
     id = id[0];
     selectButtonWithoutClearStack(mBottomBar.selectedIndex);
     mTopBar.changeHabitate(  id  );
    });

   $("div.closeViewMission").click(function(event) {
    mTopBar.setIsOpenCastleList( false );
    mCurrentActionBlocked = false;
    if(mBottomBar.selectedIndex != 4) {
    	selectButtonWithoutClearStack(mBottomBar.selectedIndex);
        navigateBack();
     } else {
    	 str_mCurrentAction = "";
		 boardSetup();
    }
  });

   selectButtonWithoutClearStack(10);
}

function openGlobalMissions(){
	mCurrentActionBlocked = true;

	function getID(id) {
		id = id.match(/\d+/g);
	    return id[0];
	}

	mGlobalMissions = {
	    getForHab : function(habID) {
		    var missions = $.jStorage.get("burg_" + habID);
		    if (missions == null) return null;
		    if (missions.length == 0) return null;
		    return missions;
	    },
	    getActiveMissionsForHab: function (habID) {
	    	var arr = this.getForHab(habID);
	    	if (arr == null) return 0;
	    	var i, count = 0;
	    	for (i=1; i<arr.length; i++) {
	    		if (arr[i] == 1) {
	    			var mission = mMissions[i];
	    			if (mission.isMissionPossible(habID)) {
	    				count++;
	    			}
	    		}
	    	}
	    	return count;
	    },
	    isHabPreselected: function (habID) {
	    	var preselected =  $.jStorage.get("globalMissions");
	    	if (preselected == null) return false;
	    	if (typeof preselected == "undefined") return false;
	    	if (preselected.length == 0) return false;
	    	for (var i=0; i<preselected.length; i++) {
	    		if (Number(preselected[i]) == Number(habID)) return true;
	    	}
	    	return false;
	    },
	    getActiveMissionsForSelected: function () {
	    	var count = 0;
	    	var that = this;	// we loose "this" in the loop
	    	$("table.btn_hab").each (function(idx, element) {
	    		var id = getID($(this).attr('id'));
	    		var btn = $("#globalMissions_"+ id);
	    		if (btn.is(":checked")) {
	    			count += that.getActiveMissionsForHab.call(that, id);
	    		}
	    	});
	    	return count;
	    },
	    getSelectedHabitats: function () {
	    	var arr = [];
	    	$("table.btn_hab").each (function(idx, element) {
	    		var id = getID($(this).attr('id'));
	    		var btn = $("#globalMissions_"+ id);
	    		if (btn.is(":checked")) {
	    			arr.push(id);
	    		}
	    	});
	    	return arr;
	    },

	    habitatArray: mPlayer.getHabitatsArray()

	};


	function save () {
		var preselected =  $.jStorage.get("globalMissions") || [];
		var btn=null, i=0;

		function updateStorageList(button, index) {
			var position = preselected.indexOf("" + mGlobalMissions.habitatArray[index].id);
			if (button.is(":checked")) {
    			if ( position == -1) {
    				preselected.push("" + mGlobalMissions.habitatArray[index].id);
    			}
    		} else {
    			if ( position != -1) {
    				 preselected.splice(position, 1);
    			}
    		}
		}

		for (i = 0; i<mGlobalMissions.habitatArray.length; i++) {
			if (mGlobalMissions.getActiveMissionsForHab(mGlobalMissions.habitatArray[i].id) > 0) {
				btn = $("#globalMissions_"+ mGlobalMissions.habitatArray[i].id);
	    		updateStorageList(btn, i);
			}

		}
		$.jStorage.set("globalMissions", preselected);
	}

	$.tmpl("globalMissionsTmpl",mGlobalMissions).appendTo($("div.viewport").empty());
	setPapyrusBackgroundForFullScreenView();
	setHover("div.globalMissions");
	$("#globalMissionsCount").text(mGlobalMissions.getActiveMissionsForSelected());
	for (var i = 0; i<mGlobalMissions.habitatArray.length; i++){
		if (mGlobalMissions.isHabPreselected(mGlobalMissions.habitatArray[i].id)) {
			$("#globalMissions_"+ mGlobalMissions.habitatArray[i].id).attr("checked", true);
		} else {
			$("#globalMissions_"+ mGlobalMissions.habitatArray[i].id).attr("checked", false);
		}
	}
	$("#globalMissionsCount").text(mGlobalMissions.getActiveMissionsForSelected());
	windowSize();

	if (str_mCurrentAction == "openMap") {

	}
	if (str_mCurrentAction == "openPolMap") {
		unregister_wmap_events();
	}

	$("table.btn_hab").click(function(){
	     var id = $(this).attr('id');
	     id = id.match(/\d+/g);
	     id = id[0];
	     selectButtonWithoutClearStack(mBottomBar.selectedIndex);
	     mTopBar.changeHabitate(  id  );
	});

	$("td.globalMissionsTableCell").click(function(event){

		var id = getID($(this).attr("id"));
		if ($("#globalMissions_"+ id).is(":checked")) {
			$("#globalMissions_"+ id).attr("checked",false);
		} else {
			$("#globalMissions_"+ id).attr("checked", true);
		}
		$("#globalMissionsCount").text(mGlobalMissions.getActiveMissionsForSelected());
		event.stopPropagation();
		event.preventDefault();
	});

	$(".globalMissionCheckBox").click(function(event) {
		$("#globalMissionsCount").text(mGlobalMissions.getActiveMissionsForSelected());
		event.stopPropagation();
	});

	$("#globalMissionsExecute").click(function () {
		save();

		var habitats = mGlobalMissions.getSelectedHabitats(),
			i=0, j=0, missions = [], habitatID,
			command= {};

		for (i=0; i<habitats.length; i++) {
			habitatID = Number(habitats[i]);
			command[habitats[i]] = [] ;
			missions = mGlobalMissions.getForHab(habitatID);
			for (j=1; j<missions.length; j++) {
				if (mMissions[j].isMissionPossible(habitatID)) {
					if (missions[j] == 1) command[habitats[i]].push(j);
				}
			}
		}

		var command_string = "";
		$.each(command, function(idx, val) {
			if (val.length == 0) return;
			command_string += idx + "=(";
				for (var i=0; i<val.length; i++) {
					command_string += val[i] + ",";
				}
			command_string += ");";
		});

		if(command_string != ""){
  		blockUI("HabitatAction/executeMission");

  		var touch = globalTouchDate;
  		var temp = "";
  		temp = touch.substring(0,10) +" "+ touch.substring(11,19)+" Etc/GMT";

  		var parameters = {};
  		parameters["habitatIDMissionIDArrayDictionary"] ="{" + command_string + "}";
  		parameters["PropertyListVersion"] = propertyListVersion;
  		parameters["touchDate"] = temp;
  		parameters[mPlayer.userIdentifier] = mPlayer.getHash();
  		genericAjaxRequest("HabitatAction/executeMissionsInHabitatDictionary", parameters, "Session.updateCallback");
		}
		else {
		  showPapyrusMsgBox( mStringtable.getValueOf("No element selected."));
		}

	});


	$("div.closeViewMission").click(function(event) {
		save();

		mTopBar.setIsOpenCastleList(false);
		mCurrentActionBlocked = false;
		if (mBottomBar.selectedIndex != 4) {
			selectButtonWithoutClearStack(mBottomBar.selectedIndex);
			navigateBack();
		} else {
			str_mCurrentAction = "";
			boardSetup();
		}
	});

	selectButtonWithoutClearStack(10);
}


function openBuildingList(target) {
  str_mCurrentAction = "";
  selectButton(2, ITEMTYPE.BUILDINGLIST_VIEW_ITEM);
  mCurrentActionBlocked = false;
  addBuildingListToStack();
    $.tmpl("buildingListTmpl", mPlayer).appendTo($("div.viewport").empty());
    setPapyrusBackgroundForFullScreenView();
    setHover("div.buildinglist");
    windowSize();
    //$("div.noscroll").scrollTop( building_list_scroll_position );

    $("div.build").click(function() {
      building_list_scroll_position = $("#div_buildtable_scroll").scrollTop();
      mBuildings[$(this).metadata().primaryKey].upgrade(mPlayer.habitate[$(this).metadata().habitat]);
    });
    $("div.speedupBuildingUpgrade").click(function() {
      building_list_scroll_position = $("#div_buildtable_scroll").scrollTop();
      var habitat = mPlayer.habitate[$(this).metadata().habitat];
      var buildingUpgrade = habitat.getHabitatBuildingUpgrade($(this).metadata().buildingUpgrade);
      if (buildingUpgrade) {
        buildingUpgrade.buildingTarget.speedup(buildingUpgrade);
      }
    });
    $("div.finishBuildingUpgrade").click(function() {
      building_list_scroll_position = $("#div_buildtable_scroll").scrollTop();
      var habitat = mPlayer.habitate[$(this).metadata().habitat];
      var buildingUpgrade = habitat.getHabitatBuildingUpgrade($(this).metadata().buildingUpgrade);
      if (buildingUpgrade) {
        buildingUpgrade.buildingTarget.finish(buildingUpgrade);
      }
    });

    // for BUKA-567

    $("div.speedupRecruitAll").click(function() {
      alert("speedup all");
      building_list_scroll_position = $("div.noscroll2").scrollTop();
      /*
      var habitat = mPlayer.habitate[$(this).metadata().habitat];
      if (habitat) {
        habitat.speedupAllUnits();
      }*/
    });

    $("div.finishRecruitAll").click(function() {
      alert("finish all");
      building_list_scroll_position = $("div.noscroll2").scrollTop();
      /*
      var habitat = mPlayer.habitate[$(this).metadata().habitat];
      if (habitat) {
        habitat.finishAllUnits();
      }*/
    });
    $("div.speedupRecruitAllHabitate").click(function() {
      alert("sppedup all habitate");
      building_list_scroll_position = $("div.noscroll2").scrollTop();
      //mPlayer.speedupAllUnits();
    });
    $("div.finishRecruitAllHabitate").click(function() {
    alert("finsih all habitate");
      building_list_scroll_position = $("div.noscroll2").scrollTop();
      //mPlayer.finishAllUnits();
    });



    $('div.noscroll').scroll(function(){
      //building_list_scroll_position = $("div.noscroll").scrollTop();
    });
    $(".name").click(function() {
      var hoola = $(this);
      mMapStackUsed = true;
      mapActions.reset();
      //boardSetupFromOtherView( $(this).metadata().habitatX, $(this).metadata().habitatY, openOwnHabitatView);
      boardSetup( $(this).metadata().habitatX, $(this).metadata().habitatY );
    });
    windowSize();
    if(building_list_scroll_position > 0){
      $("#div_buildtable_scroll").scrollTop(building_list_scroll_position);
    }
    else {
      $("#div_buildtable_scroll").scrollTop(0);
    }

   // console.log(mPlayer.currentHabitat.habitatBuildings);
   // console.log(mPlayer.habitate);
   // console.log(mBuildings);


    $('div.tooltip').tooltip({
      	track: true,
      	delay: 0,
      	showURL: false,
      	showBody: " - ",
      	extraClass: "pretty",
      	fixPNG: true,
      	opacity: 0.95,
      	left: 0,
    	bodyHandler: function() {
    		if ( $('#'+ $(this).attr("id") + "_" ).length > 0 )
    			return $('#'+ $(this).attr("id") + "_" ).html();
    		else
    			return false;
    	}
    });

}

function openUnitsView(target) {
  str_mCurrentAction = "";
  selectButton(3, ITEMTYPE.TROOPACTIONS_VIEW_ITEM);
  mCurrentActionBlocked = false;
  addTroopActionViewToStack();
  $.tmpl("unitsViewTmpl", mPlayer).appendTo($("div.viewport").empty());
  setPapyrusBackgroundForFullScreenView();
  setHover("div.unitsview");
  $("#tabsUnitsview").tabs({
    select: function(event, ui) {
      mTabs = ui.index;
    },
    selected: mTabs
  });
  $("div.noscroll").scrollTop(0);
  windowSize();

  $(".summaryrow").each(function() {
    var sumrow = $(this);
    if ($(".detailsrow" + $(this).metadata().habitat).length == 0) {
      $(this).find(".arrowdown").removeClass("arrowdown");
    }
    $(this).find(".unit").each(function() {
      var unitcell = $(this);
      var unitcount = 0;
      var update = false;

      $(".detailsrow" + $(sumrow).metadata().habitat).each(function() {
        update = true;

        // prevent to display "0" as value in unitsview
        var temp = parseInt($(this).find($(".unit" + $(unitcell).metadata().unit)).html(), 10);
        if(!parseInt(temp)){
          temp = 0;
        }
        unitcount = parseInt(unitcount + temp);
        if(unitcount == 0) {
          unitcount = "";
        }

      });
      if (update) {
        unitcell.html(unitcount);
      }
    });
  });

  $(".summaryrow").click(function(event) {
    if(event.target.className.indexOf("name") == -1) {
      var sumrow = $(this);
      if ($(".detailsrow" + $(this).metadata().habitat).css("display") == "none") {
        $(".detailsrow" + $(this).metadata().habitat).show();
        $(sumrow).find(".arrowdown").removeClass("arrowdown").addClass("arrowup");
      } else {
        $(".detailsrow" + $(this).metadata().habitat).hide();
        $(sumrow).find(".arrowup").removeClass("arrowup").addClass("arrowdown");
      }
    }
  });


  //attack summaryrow
  $(".summaryrowAttack").each(function() {
    var sumrow = $(this);
    if ($(".detailsrowAttack" + $(this).metadata().habitat).length == 0) {
      //$(this).find(".arrowdown").removeClass("arrowdown");
    }
    $(this).find(".unit").each(function() {
      var unitcell = $(this);
      var unitcount = 0;
      var update = false;
      $(".detailsrowAttack" + $(sumrow).metadata().habitat).each(function() {
        update = true;

        // prevent to display "0" as value in unitsview
        var temp = parseInt($(this).find($(".unit" + $(unitcell).metadata().unit)).html(), 10);
        if(!parseInt(temp)){
          temp = 0;
        }
        unitcount = parseInt(unitcount + temp);
        if(unitcount == 0) {
          unitcount = "";
        }

      });
      if (update) {
        unitcell.html(unitcount);
      }
    });
  });

  $(".summaryrowAttack").click(function(event) {
    if(event.target.className.indexOf("name") == -1) {
      var sumrow = $(this);
      if ($(".detailsrowAttack" + $(this).metadata().habitat).css("display") == "none") {
        $(".detailsrowAttack" + $(this).metadata().habitat).show();
        $(sumrow).find(".arrowdown").removeClass("arrowdown").addClass("arrowup");
      } else {
        $(".detailsrowAttack" + $(this).metadata().habitat).hide();
        $(sumrow).find(".arrowup").removeClass("arrowup").addClass("arrowdown");
      }
    }
  });

  $(".name").click(function() {
    //selectButton(4);
    //if($(this).metadata().habitatPK == mPlayer.currentHabitat.id) {
    //  boardSetup();
    //}
    //else {
    mMapStackUsed = true;
    mapActions.reset();
   // if(mPlayer.isOwnHabitat($(this).metadata().habitatPK))
//      boardSetupFromOtherView( $(this).metadata().habitatX, $(this).metadata().habitatY, openOwnHabitatView);
    boardSetup( $(this).metadata().habitatX, $(this).metadata().habitatY );
//    else
//      boardSetupFromOtherView( $(this).metadata().habitatX, $(this).metadata().habitatY, openForeignHabitatView);
    //}
  });


  // alte Funktionalität um alle verteid. Einheiten zurückzuschicken
  $(".sendHomeAction").click(function() {
    var playerHabitat = mPlayer.habitate[$(this).metadata().habitatID];
    var srcID = $(this).metadata().srcHabitatID;
    $.each(playerHabitat.habitatUnits, function(i, habitatUnit) {
      if(habitatUnit.sourceHabitat.id == srcID) {
        playerHabitat.sendTroopsHome(habitatUnit,TRANSITTYPE.TRANSIT_DEFENSE);
      }
    });
  });

  // verteidigende Einheiten aus eigener burg zurücksenden in unitsview verteidigende einheiten
  $(".sendHomeSelectedAction").click(function() {

    var unitDictionary = {};
    var identifier = 0;
    var value = 0;
    var unitsCount = 0;

    $("#foreignUnitsToSend_"+$(this).metadata().habitatID+"_"+$(this).metadata().foreignDefenderUnitIndex).find("input.recallSelected").each(function(index) {

      value = parseInt($(this).val());
      identifier = $(this).metadata().pk;
      if (value > 0 && !isNaN(value)){
        unitDictionary[identifier] = value;
        unitsCount += value;
      }
    });

    if(Object.size(unitDictionary) > 0) {
      var destHabitatId = $(this).metadata().srcHabitatID;
      var playerHabitat = mPlayer.habitate[$(this).metadata().habitatID];

      $.each(playerHabitat.habitatUnits, function(i, habitatUnit) {
        if(habitatUnit.sourceHabitat.id == destHabitatId) {
          if(habitatUnit.battleType == BATTLETYPE.EXTERNAL_UNITS_TO_DEFENSE) {
            playerHabitat.recallTroops(habitatUnit,TRANSITTYPE.TRANSIT_DEFENSE,unitDictionary);
          }
        }
      });
    }
    else {
      showPapyrusMsgBox( mStringtable.getValueOf("No untis were assigned."));
    }
  });

  /*
  // alte Funktionalität um alle angreifenden Einheiten zurückzuschicken
  $(".recallAction").click(function() {
    var destHabitatId = $(this).metadata().habitatID;
    var srcHabitat = mPlayer.habitate[$(this).metadata().srcHabitatID];
    $.each(srcHabitat.externalHabitatUnits, function(i, habitatUnit) {
      if(habitatUnit.habitat.id == destHabitatId) {
        if(habitatUnit.battleType == BATTLETYPE.EXTERNAL_UNITS_TO_DEFENSE) {
          srcHabitat.recallTroops(habitatUnit,TRANSITTYPE.TRANSIT_DEFENSE);
        }
        else if(habitatUnit.battleType == BATTLETYPE.ATTACKER) {
          srcHabitat.recallTroops(habitatUnit,TRANSITTYPE.TRANSIT_ATTACKER);
        }
      }
    });
  });
  */


// alle angreifende Einheiten zurück nach hause schicken
  $(".recallAllUnits").click(function() {
	    var destHabitatId = $(this).metadata().habitatID;
	   // console.info('recallAction destHabitatId ' + destHabitatId );

	    $.each( $(".detailsrow" + destHabitatId), function(i) {

	       var habitat_id = $(this).find('.recallSelectedAction').metadata().srcHabitatID;

	       var srcHabitat = mPlayer.habitate[ habitat_id ];

	       $.each(srcHabitat.externalHabitatUnits, function(i, habitatUnit) {

	    	   if(habitatUnit.battleType == BATTLETYPE.EXTERNAL_UNITS_TO_DEFENSE) {
	    	      srcHabitat.recallTroops(habitatUnit,TRANSITTYPE.TRANSIT_DEFENSE);
	    	   }
	    	   else if(habitatUnit.battleType == BATTLETYPE.ATTACKER) {
	    	      srcHabitat.recallTroops(habitatUnit,TRANSITTYPE.TRANSIT_ATTACKER);
	    	   }

	       });
   });

  });

  // auswärtig angreifende Einheiten zurück nach hause schicken
  $(".recallSelectedAction").click(function() {

    var unitDictionary = {};
    var identifier = 0;
    var value = 0;
    var unitsCount = 0;

    $("#externalUnitsToSend_"+$(this).metadata().externalUnitIndex).find("input.recallSelected").each(function(index) {

      value = parseInt($(this).val());
      identifier = $(this).metadata().pk;
      if (value > 0 && !isNaN(value)){
        unitDictionary[identifier] = value;
        unitsCount += value;
      }
    });

    if(Object.size(unitDictionary) > 0) {
      var destHabitatId = $(this).metadata().habitatID;
      var srcHabitat = mPlayer.habitate[$(this).metadata().srcHabitatID];

      $.each(srcHabitat.externalHabitatUnits, function(i, habitatUnit) {
        if(habitatUnit.habitat.id == destHabitatId) {
          if(habitatUnit.battleType == BATTLETYPE.ATTACKER) {
            srcHabitat.recallTroops(habitatUnit,TRANSITTYPE.TRANSIT_ATTACKER,unitDictionary);
          }
        }
      });
    }
    else {
      showPapyrusMsgBox( mStringtable.getValueOf("No untis were assigned."));
    }
  });


//auswärtig verteidigende Einheiten zurück nach hause schicken
  $(".recallSelectedDefendersAction").click(function() {

    var unitDictionary = {};
    var identifier = 0;
    var value = 0;
    var unitsCount = 0;

    $("#externalDefendingUnitsToSend_"+$(this).metadata().habitatID+"_"+$(this).metadata().defenderUnitIndex).find("input.recallSelected").each(function(index) {

      value = parseInt($(this).val());
      identifier = $(this).metadata().pk;
      if (value > 0 && !isNaN(value)){
        unitDictionary[identifier] = value;
        unitsCount += value;
      }
    });

    if(Object.size(unitDictionary) > 0) {
      var destHabitatId = $(this).metadata().habitatID;
      var srcHabitat = mPlayer.habitate[$(this).metadata().srcHabitatID];

      $.each(srcHabitat.externalHabitatUnits, function(i, habitatUnit) {
        if(habitatUnit.habitat.id == destHabitatId) {
          if(habitatUnit.battleType == BATTLETYPE.EXTERNAL_UNITS_TO_DEFENSE) {
            srcHabitat.recallTroops(habitatUnit,TRANSITTYPE.TRANSIT_DEFENSE,unitDictionary);
          }
        }
      });
    }
    else {
      showPapyrusMsgBox( mStringtable.getValueOf("No untis were assigned."));
    }
  });

  // Einheiten Eingabe Felder
  $("input.recallSelected").blur(function(e) {

    var newVal = parseInt($(this).val());
    var maxVal = parseInt($(this).metadata().count);
    if(newVal > maxVal){
      $(this).val(maxVal);
    }
    else if(isNaN(newVal)){
      $(this).val(0);
    }
  });

  $("input.recallSelected").numeric({
    decimal: false,
    negative: false
  });

  $('input.recallSelected').bind('paste', function (e) {
       e.preventDefault();
  });

}

function openMap() {
  mTopBar.isOpenCastleList = false;
  mMapStackUsed = true;
  mCurrentActionBlocked = true;
  boardSetup();
}

function openMessagesView(target) {
  str_mCurrentAction = "";
  mCurrentActionBlocked = true;
  selectButton(5, ITEMTYPE.MESSAGES_VIEW_ITEM);
  if(mBottomBar.currentStackIsEmpty()) {
    if(mMessagesView == null) {
      mMessagesView = new MessagesView();
    }
    else {
      mMessagesView.discussionId = 0;
      mMessagesView.massMailMode = false;
      mMessagesView.newMessageMode = false;
      mMessagesView.answerMode = false;
      mMessagesView.selectedMessageNumber = 0;
    }
    blockUI("DiscussionAction/discussion");
    mMessagesView.loadDiscussionTitles();
  }
  else
    mBottomBar.callLastView();
}

function openReportsView(target) {
  str_mCurrentAction = "";
  if(mBottomBar.selectedIndex == 6) {
    mBottomBar.clearStack();
  }
  if(mBottomBar.stackArray[6].length > 0) {
    if(mReportsView.selectedTabIndex == 7){
      mReportsView.selectedTabIndex = 0;
      mReportsView.loadReports("all");
    }
    else {
      mReportsView.modus = false;
      mBottomBar.callLastView(6);
    }

  }
  else {
    if(mReportsView == null) {
      mReportsView = new ReportsView(false, false);
    }
    else {
      mReportsView.spyReport = false;
      mReportsView.modus = false;
    }
    //mReportsView.loadReports(1);
    mReportsView.selectedTabIndex = 0;
    mReportsView.loadReports("all");

  }
}

function openAllianceView(target) {

  if(mBottomBar.selectedIndex == 8){
    //mAllianceView.selectedTabIndex = 0;
  }
  str_mCurrentAction = "";
  mCurrentActionBlocked = true;
  selectButton(7, ITEMTYPE.ALLIANCE_VIEW_ITEM);
  if(mAllianceView == null) {
    mAllianceView = new AllianceView();
    $("ul.tabDisplay").show();
    $("#forum").hide();
  }
  if(mBottomBar.currentStackIsEmpty()) {
    if(mPlayer.alliance) {
      mAllianceView.selectedTabIndex = 0;
      mAllianceView.openAllianceProfile();
      $("ul.tabDisplay").show();
      $("#forum").hide();
    }
    else {
      mCurrentActionBlocked = true;
      mAllianceView.createNewAlliance();
    }
  }
  else {
    /*if(mAllianceView.selectedTabIndex == 2){
      mAllianceView.selectedTabIndex = 0;
    } */
    mBottomBar.callLastView();
    $("ul.tabDisplay").show();
    $("#forum").hide();
  }
}

function openAllianceForum(target) {
  str_mCurrentAction = "";
  mCurrentActionBlocked = true;
  selectButton(8, ITEMTYPE.ALLIANCE_VIEW_ITEM);
  if(mAllianceView == null) {
    mAllianceView = new AllianceView();
    mAllianceView.selectedTabIndex = 6;
  }
  else {
    mAllianceView.selectedTabIndex = 6;
  }
  if(mBottomBar.currentStackIsEmpty()) {
    if(mPlayer.alliance) {
      mAllianceView.openAllianceProfile();
      //mAllianceView.initForum();
    }
    /*else {
      mCurrentActionBlocked = true;
      mAllianceView.createNewAlliance();
    }*/
  }

  else
    mBottomBar.callLastView();
}

function openPlayerView(target) {
  playerProfileCloseButton = false;
  str_mCurrentAction = "";
  mCurrentActionBlocked = true;
  selectButton(9, ITEMTYPE.PROFILE_VIEW_ITEM);
  if(mProfileView == null)
    mProfileView = new ProfileView();
  if(mBottomBar.currentStackIsEmpty())
    mProfileView.openPlayerProfile();
  else
    mBottomBar.callLastView();
  $("div.noscroll").scrollTop(0);


}

function openExternAllianceProfile(allianceId) {
  str_mCurrentAction = "";
  mCurrentActionBlocked = false;
  if(mMapStackUsed == true)
    mMapStackUsed = false;
  if(mAllianceView == null) {
    mAllianceView = new AllianceView();
  }
  if(mAllianceView.externalProfile && (typeof allianceId == 'undefined')) {  //for sessionUpdate
    mAllianceView.getAllianceInformation();
  }
  else {
    if(mPlayer.alliance && mPlayer.alliance.id == allianceId) {
      mAllianceView.openAllianceProfile();
    }
    else {
      mAllianceView.getAllianceInformation(allianceId);
    }
  }
}

/**
 * opens extern player profile
 * @param {Number} id of the player
 */
function openExternPlayerProfile(playerId) {
  //getBackToMap = true;
  str_mCurrentAction = "";
  mCurrentActionBlocked = false;
  if(mMapStackUsed == true)
    mMapStackUsed = false;
  if(mProfileView == null)
    mProfileView = new ProfileView();
  if(playerId == mPlayer.id) {
    mProfileView.openPlayerProfile();
  }
  else {
    mProfileView.openExternPlayerProfile(playerId);
  }
}

/**
 * opens View to send messages
 * @param {Player} destinationPlayer the Player who will receive the message
 */
function openSendMessageView(destinationPlayer) {
  str_mCurrentAction = "";
   mCurrentActionBlocked = true;
  if(mMessagesView == null) {
    mMessagesView = new MessagesView();
  }
  mMessagesView.newMessageMode = true;
  mMessagesView.answerMode = false;
  mMessagesView.messageDestination = destinationPlayer;
  mMessagesView.fromView = mBottomBar.selectedIndex;
  selectButton(5, ITEMTYPE.MESSAGES_VIEW_ITEM);
  mMessagesView.loadDiscussionTitles();
}

function openBuyGoldView() {
  mCurrentActionBlocked = true;
  mGoldView.addToBody();
}

function openKnowledgeAndMissionView(buildingID, keyID) {
  mCurrentBuilding = mBuildings[buildingID];
  mCurrentKey = keyID;
  str_mCurrentAction = "";
  mCurrentActionBlocked = false;
 // $("div.paddinOut").scrollTop(0);
  $.tmpl("knowledgeMissionViewTmpl", mCurrentBuilding).appendTo($("div#tabsBuildingUnitList").empty());

  if(mCurrentBuilding.knowledges) {
    $.tmpl("knowledgeMissionDescriptionTmpl", mKnowledges[mCurrentKey]).appendTo($("div.description").empty());
  }
  else {
    $.tmpl("knowledgeMissionDescriptionTmpl", mMissions[mCurrentKey]).appendTo($("div.description").empty());
  }
  setHover("div.knowledgemissionview");
  windowSize();

 // $("div.scrollinner").scrollTop(0);

/*  $("div.speedupResearch").click(function() {
    mKnowledges[$(this).metadata().primaryKey].speedup(mPlayer.habitate[$(this).metadata().habitat]);
  });
  $("div.finishResearch").click(function() {
    mKnowledges[$(this).metadata().primaryKey].finish(mPlayer.habitate[$(this).metadata().habitat]);
  });
  $("div.explore").click(function() {
    mKnowledges[$(this).metadata().primaryKey].research(mPlayer.habitate[$(this).metadata().habitat]);
  });
  $("div.speedupMission").click(function() {
    mMissions[$(this).metadata().primaryKey].speedup(mPlayer.habitate[$(this).metadata().habitat]);
  });
  $("div.execute").click(function() {
    mMissions[$(this).metadata().primaryKey].execute(mPlayer.habitate[$(this).metadata().habitat]);
  });
  $("div.clickable").click(function(event) {
    var target = event.target.className;
    var buttonclick = ((target.indexOf("noclick") > - 1) || (target.indexOf("iconbutton") > -1));
    if(!buttonclick) {
      mCurrentKey = $(this).metadata().key;
      mHabitatView.addViewToStack(ITEMTYPE.MISSION_VIEW_ITEM);
      openKnowledgeAndMissionView(mCurrentBuilding.primaryKey,mCurrentKey);
    }
  });*/
  $("div.closeViewMission").click(function(event) {
    navigateBack();
  });
}

function openExchangeView() {
  str_mCurrentAction = "";
  $("div.papyruscontent").scrollTop(0);
  mCurrentActionBlocked = true;

  if(mExchangeView == null) {
    mExchangeView = new ExchangeView();
  }

  // secures right values from actuel habitat while changing the current Habitat on exchangeView
  var newBuildingValue = 0;
  $.each(mPlayer.currentHabitat.habitatBuildings, function(key, habitatBuildings) {
    if(mExchangeResourceId == 5 || mExchangeResourceId == 6){
      if(habitatBuildings.identifier.substring(0,4) == "Keep"){
        newBuildingValue = key;
      }
    }
    else {
      if(habitatBuildings.identifier.substring(0,6) == "Market"){
        newBuildingValue = key;
      }
    }
  });
  mExchangeBuilding = mBuildings[newBuildingValue];
  mExchangeView.initView(mExchangeResourceId, mExchangeBuilding);
}


function openGlobalExchange(tradeResID) {
	str_mCurrentAction = "";
	$("div.papyruscontent").scrollTop(0);
	mCurrentActionBlocked = true;
	var tradeGood = {
		resource : mResources[tradeResID],
		selectedUnit: null,
		usedUnits: [],
		usedResources: []
	};

	$.tmpl("silverGlobalTmpl", tradeGood).appendTo($("div.viewport").empty());
	$("img.warning").hide();
	setPapyrusBackgroundForFullScreenView();
	setHover("div.silverview");
	$("div.papyruscontent").scrollTop(0);
	$("div.actionTitle").html($.sprintf(mStringtable.getValueOf('Barter %@'), mStringtable.getValueOf(tradeGood.resource.identifier)));
	$(".silverview .transportselect").hide();
	$(".silverview .right50withoutBorder").hide();
	$(".silverview input").attr("checked", false);
	var habList = $.jStorage.get("globalExchange_" + tradeResID);
	if (habList != null && typeof habList != "undefined") {
		for (var i=0; i<habList.length; i++) {
			$(".silverview #btn_hab_"+habList[i]+" input").attr("checked", true);
		}
	}
	windowSize();

	$(".silverview .unitbutton").click(function(event) {

		var unitID = $(this).attr("id").split("_")[1];
		tradeGood.selectedUnit = mUnits[unitID];
		$(".silverview .right50withoutBorder").show();
		$(".silverview .transportselect").hide();
		$(".silverview .unitimg").attr("src", mPath_Images + mDir_Units + tradeGood.selectedUnit.identifier+"Icon.png");
		var habitats = mPlayer.getHabitatsArray();
		var habunits, wantedResource, capacity=0, unitCount=0;
		var unitStore = 0;
		var woodCarried, stoneCarried, oreCarried;
		var woodStock, stoneStock, oreStock;
		var capacityUsed, unitsUsed, originalCapacity;
		var woodRate=1, stoneRate=1, oreRate=1, silverGained = 0;
		var keepID, rates, tmpObj;
		tradeGood.usedUnits = [];
		tradeGood.usedResources = [];

		for (var i=0; i<habitats.length; i++) {

			// set how much of the selected units we have
			habunits = habitats[i].getAllHabitatUnits();

			for (var j=0; j<habunits.length; j++) {
				if (habunits[j].primaryKey == Number(unitID)) {
					unitCount = habunits[j].count;
					$(".silverview #unitcount_"+habitats[i].id).text(habunits[j].count);
					unitStore = habunits[j].storeAmount;
					capacity = habunits[j].count * unitStore;
					break;
				}
			}

			woodStock = habitats[i].habitatResources[1].getRoundedAmount(); //wood
			stoneStock = habitats[i].habitatResources[2].getRoundedAmount(); //stone
			oreStock = habitats[i].habitatResources[3].getRoundedAmount(); //ore
			totalResourceAmount  = woodStock +  stoneStock + oreStock;

			if (capacity > totalResourceAmount) {
				capacity = totalResourceAmount;
			}


			keepID = habitats[i].findBuilding("Keep");
			if (tradeResID == "1" || tradeResID == "2" || tradeResID == "3") {
				keepID = habitats[i].findBuilding("Market");
			}
			rates = habitats[i].habitatBuildings[keepID].marketRates;

			for (var k=0; k<rates.length; k++) {
				if (Number(rates[k].resourceID) == tradeResID) {
					woodRate = rates[k].rates[1];
					stoneRate = rates[k].rates[2];
					oreRate = rates[k].rates[3];
					break;
				}
			}

			originalCapacity = capacity;

			// Fill capacity with resources from wood to ore
			woodCarried = 0;
			stoneCarried = 0;
			oreCarried = 0;
			silverGained = 0;
			if (tradeResID != "1") {
				if (woodStock <= capacity) {
					woodCarried = Math.floor(woodStock / woodRate) * woodRate;
				} else {
					woodCarried = Math.floor(capacity / woodRate) * woodRate;
				}
				capacity -= woodCarried;
				silverGained += Math.floor(woodCarried / woodRate);
				if (capacity <= 0) capacity = 0;
			}

			if (tradeResID != "2") {
				if (stoneStock <= capacity) {
					stoneCarried = Math.floor(stoneStock / stoneRate) * stoneRate;
				} else {
					stoneCarried = Math.floor(capacity / stoneRate) * stoneRate;
				}
				capacity -= stoneCarried;
				silverGained += Math.floor(stoneCarried / stoneRate);
				if (capacity <= 0) capacity = 0;
			}

			if (tradeResID != "3") {
				if (oreStock <= capacity) {
					oreCarried = Math.floor(oreStock / oreRate) * oreRate;
				} else {
					oreCarried = Math.floor(capacity / oreRate) * oreRate;
				}
				capacity -= oreCarried;
				silverGained += Math.floor(oreCarried / oreRate);
				if (capacity <= 0) capacity = 0;
			}

			// Calculate how many unit we really need to transport stuff
			capacityUsed = woodCarried + stoneCarried + oreCarried;
			unitsUsed = Math.ceil(capacityUsed / unitStore);
			if (capacityUsed > originalCapacity) {
				capacityUsed = originalCapacity;
			}
			if (unitsUsed > unitCount) {
				unitsUsed = unitCount;
			}


			// Update tradeGood information
			tmpObj = {};
			tmpObj[unitID] = unitsUsed;
			tradeGood.usedUnits.push(tmpObj);
			tradeGood.usedResources.push({1:woodCarried, 2:stoneCarried, 3:oreCarried});

			$("#transportcount_"+ habitats[i].id).text(unitsUsed);
			$("#silvergain_"+ habitats[i].id).text(silverGained);

			if (silverGained != 0) {
				$(".silverview #btn_hab_"+habitats[i].id).addClass("currenthabitat");
				$(".silverview #btn_hab_"+habitats[i].id+" input").show();
			} else {
				$(".silverview #btn_hab_"+habitats[i].id+" input").hide();
				$(".silverview #btn_hab_"+habitats[i].id).removeClass("currenthabitat");
			}

			// Set the amount of what we have of the wantedResoure
			wantedResource = habitats[i].habitatResources[tradeResID];
			$(".silverview #wantedResourceAmount_"+habitats[i].id).text(parseInt(wantedResource.amount));
			$(".silverview #wantedResourceAmount_"+habitats[i].id).css("color", wantedResource.getBgColor());

		}

		$(this).find(".transportselect").show();
	});


	$("div.closeViewMission").click(function(event) {
		navigateBack();
	});


	$(".dotransit").click(function(event){
		var habitats = mPlayer.getHabitatsArray();
		var keepID, keep, check;
		var parameters = {};
		var habList = [];

		for (var i=0; i<habitats.length; i++) {
			check = $("#btn_hab_"+habitats[i].id+" input");
			if (check.is(":checked")) {
				habList.push(habitats[i].id);
			}

		}
		$.jStorage.set("globalExchange_" + tradeResID, habList);
		// do transists

  		for (var i=0; i<habitats.length; i++) {
  			check = $("#btn_hab_"+habitats[i].id+" input");
  			if (check.css("display") != "none" && check.is(":checked")) {
  				keepID = habitats[i].findBuilding("Keep");
  				if (tradeResID == "1" || tradeResID == "2" || tradeResID == "3") {
  					keepID = habitats[i].findBuilding("Market");
  				}
  				keep = habitats[i].habitatBuildings[keepID];
  				keep.exchangeResource(habitats[i], tradeGood.usedUnits[i], tradeGood.usedResources[i], ""+ tradeResID);
  			}
  		}

  		// Update Session hard to get correct display
  		parameters["PropertyListVersion"] = propertyListVersion;
  		parameters[mPlayer.userIdentifier] = mPlayer.getHash();
  		genericAjaxRequest("SessionAction/update", parameters, "Session.updateCallbackWithoutRepaint");
  		//navigateBack();
	});
}


function addBuildingListToStack() {
  var item = new StackItem();
  item.itemType = ITEMTYPE.BUILDINGLIST_VIEW_ITEM;
  item.functionname = openBuildingList;
  mBottomBar.addToStack(item);
};

function addTroopActionViewToStack() {
  var item = new StackItem();
  item.itemType = ITEMTYPE.TROOPACTIONS_VIEW_ITEM;
  item.functionname = openUnitsView;
  mBottomBar.addToStack(item);
};

function addRecruitingListToStack() {
  var item = new StackItem();
  item.itemType = ITEMTYPE.RECRUITINGLIST_VIEW_ITEM;
  item.functionname = openRecruitingList;
  mBottomBar.addToStack(item);
};

function detectBadBrowser() {
  var browserInformation;
  if(navigator.appName.indexOf('Microsoft') > -1) {
    browsertype = "msie";
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null) {
      browserversion = parseFloat( RegExp.$1 );
      isBadBrowser = browserversion < 8;
    }
    else {
      isBadBrowser = true;
    }
  }
  else if(navigator.userAgent.toLowerCase().indexOf("opera") > -1) {
    browserVersionStrings = navigator.userAgent.slice(navigator.userAgent.toLowerCase().indexOf("opera")).split(" ");
    browserInformation = browserVersionStrings[0].split("/");
    browsertype = browserInformation[0].toLowerCase();
    browserVersionStrings = navigator.userAgent.slice(navigator.userAgent.toLowerCase().indexOf("version")).split(" ");
    browserInformation = browserVersionStrings[0].split("/");
    browserversion = parseInt(browserInformation[1]);
    isBadBrowser = browserversion < 10;
  }
  else if(navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
    browserVersionStrings = navigator.userAgent.slice(navigator.userAgent.toLowerCase().indexOf("chrome")).split(" ");
    browserInformation = browserVersionStrings[0].split("/");
    browsertype = browserInformation[0].toLowerCase();
    browserversion = parseInt(browserInformation[1]);
    isBadBrowser = browserversion < 9;
  }
  else if(navigator.userAgent.toLowerCase().indexOf("safari") > -1) {
    browserVersionStrings = navigator.userAgent.slice(navigator.userAgent.toLowerCase().indexOf("safari")).split(" ");
    browserInformation = browserVersionStrings[0].split("/");
    browsertype = browserInformation[0].toLowerCase();
    browserVersionStrings = navigator.userAgent.slice(navigator.userAgent.toLowerCase().indexOf("version")).split(" ");
    browserInformation = browserVersionStrings[0].split("/");
    browserversion = parseInt(browserInformation[1]);
    isBadBrowser = browserversion < 4;
  }
  else if(navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
    browserVersionStrings = navigator.userAgent.slice(navigator.userAgent.toLowerCase().indexOf("firefox")).split(" ");
    browserInformation = browserVersionStrings[0].split("/");
    browsertype = browserInformation[0].toLowerCase();
    browserversion = parseInt(browserInformation[1]);
    isBadBrowser = browserversion < 4;
  }
  else if(navigator.userAgent.toLowerCase().indexOf("msie") > -1) {
    browserInformation = navigator.userAgent.slice(navigator.userAgent.toLowerCase().indexOf("msie")).split(" ");
    browsertype = browserInformation[0].toLowerCase();
    browserversion = parseInt(browserInformation[1]);
    isBadBrowser = browserversion < 8;
  }
  else {
    isBadBrowser = true;
  }

  return isBadBrowser;
}

function genericAjaxRequest(url, data, jsonpCallback, timeout, errorHandler) {

  if(typeof errorHandler == 'undefined' ){
    errorHandler = "function (xhr, ajaxOptions, thrownError){jsonp_error(xhr, ajaxOptions, thrownError);}";
  }
  if(typeof timeout == 'undefined' ){
    timeout = globalTimeout;
  }

  $.ajax({
      type: "GET",
      dataType: "jsonp",
      url: mServer+""+url,
      data: data,
      jsonp: "callback",
      jsonpCallback: jsonpCallback,
      error: errorHandler,
      timeout : timeout
  });
}


function getGameVersion() {
	$.get ("version.txt", function(data) {
		window.mGameVersion = data;
	});
}

