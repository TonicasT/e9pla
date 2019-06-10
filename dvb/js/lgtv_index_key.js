var iconFocus= false;
var buttonFocus= false;
var guideFocus =false;
var doubleFocus=false;
var divisionFocus;
var mouseCheck= false;	
var icon_updown=4;
var standardbutton=3;
var iconFocusList=0;
var buttonFocusList=0;
var mouseOutBlock=false;
var pc=false;

$(document).ready(function(){
	
	isGuide();

	$(".button.largeButton a").click(function(){
		mouseOutBlock =true;
		clickUserGuidePageHide();
	});

	var iconFocusSize=$(".content ul li a").size()-1;
	var buttonFocusSize=$(".button li a").size()-1;

	$('.wrap.mainWrap').on("keydown", function(e) {
		if(pc==false){
		}else{
			if(buttonFocus== false && iconFocus== false) {
				$(".mainWrap .header a.close").focus();
			}else if(buttonFocus== true ) {
				$(".button li a").eq(buttonFocusList).focus();
			}else if(iconFocus== true ) {
				$(".content ul li a").eq(iconFocusList).focus();
			}
		}

	});

	$('.subWrap').on("keydown", function(e) {
		console.log("guide"+guideFocus);
			
				if(guideFocus== true) {
					$(".button.largeButton a").focus();
				}
			
	});

	$(".content ul li a").on("keydown",function(e){
		iconFocusList = $(".content ul li a").index($(this));
		if(e.keyCode == rightKey){
			if(iconFocusList<standardbutton){
				buttonFocus=false;
				iconFocus=true;
				iconFocusList++;
				console.log("iconFocusList__"+iconFocusList);
				$(".content ul li a").eq(iconFocusList).focus();
			}else if (iconFocusList>standardbutton&&iconFocusList<iconFocusSize){
				console.log("iconFocusList__"+iconFocusList);
				buttonFocus=false;
				iconFocus=true;
				iconFocusList++;
				$(".content ul li a").eq(iconFocusList).focus();
			}
		}
		if(e.keyCode == leftKey){
			if(iconFocusList == 0){
				$(".content ul li a").eq(0).focus();
			}else if(iconFocusList>icon_updown&&iconFocusList<iconFocusSize+1){
				buttonFocusList=false;
				iconFocus=true;
				iconFocusList--;
				$(".content ul li a").eq(iconFocusList).focus();
			}else if(iconFocusList<icon_updown){
					buttonFocusList=false;
					iconFocus=true;
					iconFocusList--;
					$(".content ul li a").eq(iconFocusList).focus();
			}
		}	
		if(e.keyCode == downKey){
			iconFocusList += icon_updown;
			if(iconFocusList>iconFocusSize){
				buttonFocus=false;
				iconFocus=true;
				iconFocusList -= icon_updown;
				$(".content ul li a").eq(iconFocusList).focus();
			}else{
				$(".content ul li a").eq(iconFocusList).focus();	
			}
		}
		if(e.keyCode == upKey){
			iconFocusList -= icon_updown;
			if(iconFocusList<0){
				pc=false;
				buttonFocus=false;
				iconFocus=true;
				buttonFocusList=0;
				iconFocusList += icon_updown;
				$(".button li a").eq(buttonFocusList).focus();
			}else{
				$(".content ul li a").eq(iconFocusList).focus();
			}
		}
		
		if(e.keyCode == backKey){
			PalmSystem.platformBack();
		}
	}).mouseover(function(e) {
		pc=false;
		iconFocus=true;
		buttonFocus=false;
		iconFocusList = $(".content ul li a").index($(this));
		$(".content ul li a").eq(iconFocusList).focus();
	}).mouseout(function(e){ //마우스 링크 정보가 담긴 위치에서 벗어낫을 때.
		pc=true;
		iconFocus=true;
		buttonFocus=false;
		iconFocusList = $(".content ul li a").index($(this));
		$('.wrap.mainWrap').focus();
	}).click(function(){	// 클릭 발생 시 
		pageLink=$(this).attr("href");
		selectPageAccess(pageLink, "x");
		iconFocusList = $(".content ul li a").index(this); // 현재 클릭한 요소의 index 번호 추출
		window.localStorage.setItem("indexFocus","icon");
		window.localStorage.setItem("indexList", iconFocusList); // index 번호 저장
	}); 
	$(".button li a").on("keydown",function(e){
		if($("html").attr("dir") == "rtl"){
			var leftKey =  "39";
			var rightKey = "37";
		}else{
			var rightKey = "39";
			var leftKey = "37";		
		}

		if(e.keyCode == rightKey){
			if(buttonFocusList < buttonFocusSize){
				buttonFocus=true;
				iconFocus=false;
				buttonFocusList++;
				$(".button li a").eq(buttonFocusList).focus();		
			}
		}
		if(e.keyCode == leftKey){
			if(buttonFocusList != 0){
				buttonFocus=true;
				iconFocus=false;
				buttonFocusList--;
				$(".button li a").eq(buttonFocusList).focus();
			}					
		}
		if(e.keyCode == downKey){
			pc=false;
			buttonFocus=true;
			iconFocus=false;
			buttonFocusList = 0;
			$(".content ul li a").eq(iconFocusList).focus();
		}
		if(e.keyCode == upKey){
			buttonFocus=false;
			iconFocus=false;
			buttonFocusList = 0;
			$(".mainWrap .header a.close").focus();
		}
		
		if(e.keyCode == backKey){
			PalmSystem.platformBack();
		}
	}).mouseover(function(e) { 
		pc=false;
		buttonFocus=true;
		iconFocus=false;
		buttonFocusList = $(".button li a").index($(this));
		$(".button li a").eq(buttonFocusList).focus();
	}).mouseout(function() { 
		pc=true;
		buttonFocus=true;
		iconFocus=false;
		buttonFocusList = $(".button li a").index($(this));
		if(buttonFocusList==3){
			if(divisionFocus==false){
				$('.wrap.mainWrap').focus();
			}else{
				$(".subWrap").focus();
			}
		}else{
			$('.wrap.mainWrap').focus();
		}
	}).click(function(){
		console.log("!");
		if(buttonFocusList!=3){
			pageLink=$(this).attr("href");
			selectPageAccess(pageLink, "x");
		}else{
			divisionFocus=true;
			guideFocus= true;
			clickUserGuidePageShow();
		}
		buttonFocusList = $(".button li a").index(this);
		console.log(buttonFocusList);
		window.localStorage.setItem("indexFocus","button");
		window.localStorage.setItem("indexList", buttonFocusList); // index 번호 저장
	});

	$(".button.largeButton a").mouseover(function(e){
		guideFocus=true;
		$(".button.largeButton a").focus();
	}).mouseout(function() { //마우스 링크 정보가 담긴 위치에서 벗어낫을 때.
		if(!mouseOutBlock){
			guideFocus=true;
			$('.subWrap').focus();
		}else{
			mouseOutBlock = false;
		}
	});
});
 
function clickUserGuidePageHide(){
	 $(".helpGuide").hide();
	divisionFocus=false;
  if(window.localStorage.getItem("indexFocus") == null || window.localStorage.getItem("initFocusInfo") == "true"){
		returnMenu="iconFocus";
		iconFocusList=0;
		$(".content ul li a").eq(iconFocusList).focus();//초기 포커스
		window.localStorage.setItem("initFocusInfo", "false");
		window.localStorage.removeItem("prevFocusInfo");
	
	}else { // detail page 갔다가 나왔을 때 포커스 저장
		if(window.localStorage.getItem("indexFocus") == "button"){
			buttonFocusList=window.localStorage.getItem("indexList");
			returnMenu="buttonFocus";
			$(".button li a").eq(buttonFocusList).focus();
			window.localStorage.removeItem("indexFocus");
		}else if(window.localStorage.getItem("indexFocus") == "icon"){
			iconFocusList=window.localStorage.getItem("indexList");
			returnMenu="iconFocus";
			$(".content ul li a").eq(iconFocusList).focus();
			window.localStorage.removeItem("indexFocus");
		}
	}

}

function clickUserGuidePageShow(){
	divisionFocus=true;
	window.localStorage.setItem("Guide",1);
	$(".helpGuide").show();
	guideFocus=true;
	if(pc == true){
		$('.subWrap').focus();
	}else{
		$(".button.largeButton a").focus();
	}
	
}

function isGuide(){
	var guide =window.localStorage.getItem("Guide");
	if(guide== null) {
		pc = true;
		clickUserGuidePageShow();
	}else{
		clickUserGuidePageHide();
	}
}
