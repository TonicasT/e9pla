var FHD_RESOLUTION_VALUE = 1920;

var leftKey = "37";
var rightKey = "39";
var upKey = "38";
var downKey = "40";
var backKey = "461";
var backSpaceKey = "8";
var enterKey = "13";

var CURSOR_SHOW = 1536;
var CURSOR_HIDE = 1537;

var pageUpKey = "33";
var pageDownKey = "34";

var currentLanguage = null;
var currentPage = null;

$(document).ready(function() {

	var innerWidthValue = $(".wrap").innerWidth();

	tvResolution = (innerWidthValue >= FHD_RESOLUTION_VALUE) ? "FHD" : "HD";
	currentLanguage = location.href;
	window.localStorage.setItem("tvResolution", tvResolution);

	pageEntranceProcess();

	$(".wrap .backBtn a").click(function(e) { backProcess(); });
	$("body:not(#iframetest)").on("keydown", function(e) {
		if(e.keyCode == backKey) { backProcess(); }
	});

	$(document).on("webOSLocaleChange", function(){
		parent.startLanguageQuarter(false);
	});

	$(".header a.close").on("click", function() {
		window.close();
	}).on("keydown", function(e) {
		if(e.keyCode == enterKey) { window.close(); }
	});

	if(currentLanguage.indexOf("tha") > -1) {

		$(".header .title h2").css("padding-top","3px");

	} else if (currentLanguage.indexOf("mog") > -1) {

		$(".mainWrap .content ul li:nth-child(4) span").css("padding", "0 7px");

	} else if (currentLanguage.indexOf("mac" ) > -1) {

		$(".header .title h1").css("padding-top","0px");

	}  else if (currentLanguage.indexOf("sin") > -1) {

			$(".header h1").css("line-height", "1.05em");
			$(".mainWrap .content ul li:nth-child(4) span").css("padding", "0 20px");
			$(".header.small h1").css("line-height","50px");
			$(".resultWrap .resultList h3").css("line-height", "15px");

	} else if (currentLanguage.indexOf("bul") > -1) {

			$(".header .title h1").css("font-size","75px");	
			$(".header.small .title h1").css("font-size","40px");	

	} else if (currentLanguage.indexOf("swh") > -1) {

		$(".mainWrap .content ul li:nth-child(6) span").css("padding", "0 0px");
		$(".header.small .title h1").css("font-size", "35px");

	} else if (currentLanguage.indexOf("khm") > -1) {

		$(".header .title h1").css("padding-top","0px");

	} 
});

function pageEntranceProcess() {

	var backNumber = null;
	if (window.localStorage.getItem("backNumber") == null) {
		backNumber = 0;
	} else {
		backNumber = Number(window.localStorage.getItem("backNumber"));
	}

	currentPage = (location.href).split("/").pop();
	if(currentPage == "index.html") {
		backNumber = 0;
		prevPageHistory = "index@x";
		window.localStorage.setItem("prevPageHistory", prevPageHistory);
	}

	var prevPageHistory = window.localStorage.getItem("prevPageHistory");
	var pageLength = prevPageHistory.split("#");
	if(pageLength != null) {
		backNumber = pageLength.length - 1;	
	}
	
	if (backNumber < 0 ) {
		$(".wrap .backBtn a span").text("<ERR");
	} else if (backNumber >= 0 && backNumber <= 9) {
		$(".wrap .backBtn a span").text("<0" + backNumber);
	} else {
		$(".wrap .backBtn a span").text("<" + backNumber);
	}

	window.localStorage.setItem("historicalBack", "false");
	window.localStorage.setItem("backNumber", backNumber);
}

function backProcess(arg) {

	var pageLocationForFocus = null;
	var pageLocationForPage = null;
	var prevFocusInfo = null;
	var searchResultTitle = null;
	var prevPageHistory = window.localStorage.getItem("prevPageHistory");
	
	if(prevPageHistory.indexOf("#") > -1){
		var tmpLink = null;
		tmpLink = prevPageHistory.split("#");
		pageLocationForFocus = tmpLink.pop();
		pageLocationForPage = tmpLink.pop();
		tmpLink.push(pageLocationForPage);
		prevPageHistory = tmpLink.join("#");
	} else {
		pageLocationForPage = prevPageHistory;
	}

	if(pageLocationForFocus.indexOf("@") > -1 || pageLocationForPage.indexOf("@") > -1 ){
  		var tmpFocusInfo = null;
		pageLocationForFocus = pageLocationForFocus.split("@");
		tmpFocusInfo = pageLocationForFocus.pop();
    	if(tmpFocusInfo.indexOf("$") > -1) {
    		tmpFocusInfo = tmpFocusInfo.split("$");
      		searchResultTitle = tmpFocusInfo.pop();
			prevFocusInfo = tmpFocusInfo;
   		} else {
			prevFocusInfo = tmpFocusInfo.pop(); 
		}
    
    	pageLocationForPage = pageLocationForPage.split("@");
		pageLocationForPage = pageLocationForPage.shift(); 
  	}

	pageLocationForPage = String(pageLocationForPage);
	prevFocusInfo = (prevFocusInfo == null) ? 0 : prevFocusInfo;

	window.localStorage.setItem("historicalBack", "true");

	if(pageLocationForPage == "search_result") {
		window.localStorage.setItem("searchResultTitle", searchResultTitle);
		window.localStorage.setItem("isSearchResultPageBack", "true");
	}
	window.localStorage.setItem("prevFocusInfo", prevFocusInfo);
	window.localStorage.setItem("prevPageHistory", prevPageHistory);

	currentLanguage = window.localStorage.getItem("savedLanguage");
	if(arguments[0] == "detail") {
	 location.href = "./../../../../Apps/" + currentLanguage + "/" + pageLocationForPage + ".html";
	} else if(arguments[0] == "settings") {
		location.href = "./../../../../../Apps/" + currentLanguage + "/" + pageLocationForPage + ".html";
	} else {
		location.href = "./" + pageLocationForPage + ".html";
	}
}

function selectPageAccess(arg) {
	
	var pageLink = arguments[0];
	var prevFocusInfo = arguments[1];
	var searchResultPageInfo = "x";
	if(arguments.length > 2) {
		searchResultPageInfo = arguments[2]; 
	}

	if(pageLink.indexOf(".html") > -1) {
		pageLink = pageLink.replace(".html", "");
	}

	var prevPageHistory = window.localStorage.getItem("prevPageHistory");
	if(window.localStorage.getItem("prevPageHistory") == null) {
		prevPageHistory = pageLink + "@" + prevFocusInfo + "$" + searchResultPageInfo;
	} else {
		if(pageLink == "sitemap" || pageLink == "contentsIndex") {
			if(prevPageHistory.indexOf("#sitemap") > -1){
				prevPageHistory = prevPageHistory.replace("#sitemap", "#"+pageLink);
			} else if (prevPageHistory.indexOf("#contentsIndex") > -1) {
				prevPageHistory = prevPageHistory.replace("#contentsIndex", "#"+pageLink);
			} else {
				prevPageHistory += "#" + pageLink + "@" + prevFocusInfo + "$" + searchResultPageInfo;
			}
		} else {
			prevPageHistory += "#" + pageLink + "@" + prevFocusInfo + "$" + searchResultPageInfo;
		}

		var pageInfo = "#" + pageLink + "@" + prevFocusInfo + "$" + searchResultPageInfo;
		if(prevPageHistory.indexOf(pageInfo+pageInfo) > -1) {
			prevPageHistory = prevPageHistory.replace(pageInfo, "");
		}
	}

	window.localStorage.setItem("prevPageHistory", prevPageHistory);
}

function detailPageAccess(pageLink, iFrameLink) {
	location.href = "./" + pageLink + ".html?iFrameLink=" + iFrameLink;
}

function setRecentlyItem(iFramelink) {
	var recentlyItem = null;
	if (window.localStorage.getItem("recentlyItem") == null) {
		recentlyItem = iFramelink;
	} else {
		recentlyItem = window.localStorage.getItem("recentlyItem");
		
		if (recentlyItem.indexOf(iFramelink) > -1) {
			recentlyItem = recentlyItem.replace(iFramelink, "");
		}

		recentlyItem = recentlyItem.replace("##", "#");

		if (recentlyItem.indexOf("#") == 0) {
			recentlyItem = recentlyItem.replace("#", "");
		}

		var recentlyItemArray = null;
		recentlyItemArray = recentlyItem.split("#");

		var tmpArray = recentlyItemArray.splice(9, recentlyItemArray.length - 9);
		for (var i = 0; i < recentlyItemArray.length; i++) {
			if(recentlyItemArray[i] == "") {
				tmpArray = recentlyItemArray.splice(i, 1);
			}
		}

		recentlyItemArray.unshift(iFramelink);
		recentlyItem = recentlyItemArray.join("#");
	}

	window.localStorage.setItem("recentlyItem", recentlyItem);
}

function checkByte(str) { 
	var bRet = false;
	var maxByte = 200;
	
	var size = 0;
	var charCode;
	var chr = null;

	for(var i = 0; i < str.length; i++) { 
		chr = str.charAt(i);
		charCode = chr.charCodeAt(0);
		
		if(charCode <= 0x00007F)		{ size += 1; }
		else if(charCode <= 0x0007FF) 	{ size += 2; }
		else if(charCode <= 0x00FFFF) 	{ size += 3; }
		else							{ size += 4; }
		
		if(size >= maxByte) {
			bRet = true;
			break;
		}
	}
	
	return bRet;
}