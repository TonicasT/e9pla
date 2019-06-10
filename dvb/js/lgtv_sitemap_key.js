var SCROLL_INTERVAL_TIME = 45;
var ITEM_HEIGHT = 50;
var rightContentList = 0 ; // 오른쪽 컨텐츠의 리스트 번호
var leftMenuIndex = 0; // 왼쪽 메뉴의 index 번호
var sayBackBtnWhereFrom ="";
var focusHideSetTimeFlag = true;
var lastMousePosition = "lnb"; // 2016.07.18  공백으로 해주면 처음 화면에서 휠 했을 때 포커스 사라지는 문제 발생
var timerId;
var arrowUpBtn = false; // 처음 들어갔을 때 위 스크롤 버튼 off
var arrowDownBtn = true; // 처음 들어갔을 때 아래 스크롤 버튼 on
var mouseOn = false;
var keyDownOn = false;  // 키보드 조작 여부
var keyBtnCase =""; // 어떤 키를 조작했는가?
var arrowBtnClickBlock = false ;
var lnbBtnClickBlock = false;
var lnbBtnOn = false ;
var isEnterKeyPressed ="";
var isPageRtl=false;
var isMouseWheelOn = false;
var isArrowUpOrDown = "";
var arrowBtnOn = false;
var arrowMouseDownOn = false;
var tvResolution = "";

$(document).ready(function() {

	if(window.localStorage.getItem("tvResolution") == null) 
	{
		tvResolution = (window.innerWidth >= 1920) ? "FHD" : "HD";
	} 
	else 
	{
		tvResolution = window.localStorage.getItem("tvResolution");
	}

	$('.scroll-hide').css('display','block');
	
	eraseLastUlMargin();
	initialFocusCheck();
	initialArrowBtnCheck();

	if($("html").attr("dir") === "rtl")
	{
		isPageRtl = true;
	}
	else
	{
		isPageRtl = false;
	}

	var rightContentSize = $(".list ul li a").size(); // 오른쪽 컨텐츠(가,나,다 ... )의 크기
	var leftMenuSize=$(".lnb ul li a").size(); // 왼쪽 메뉴 (목차, 색인)의 크기
	var scrollMove =$(".content .list").scrollTop(); // 스크롤이 움직인 거리
	var contentHeight =$('.content .list').innerHeight();
	var scrollHeight =$(".content .list")[0].scrollHeight;
	var detailWrap = $('.detailWrap').height(); // 전체 영역의 크기

	$(".lnb ul li:nth-child(1) a .point").css("display","inline-block"); // 목차에 들어가면 목차부분의 display 속성을 inline-block으로 바꿔줌으로써 포인트를 만들어준다.

	$('.list').on('scroll', function() {

		mouseOn = false;
		$('.scroll-hide').hide();
		$('.scroll-hide').stop(true, true);
		$('.scroll-hide').fadeIn(1500);

		if(arrowBtnOn)
		{
			if(isArrowUpOrDown =="down")
			{
				checkArrowDownCss();
			}
			else if(isArrowUpOrDown == "up")
			{
				checkArrowUpCss();
			}
		}
		else
		{
			checkCssFromScroll();
		}
	});

	$('.wrap').on("click", function(e){

		if(arrowBtnClickBlock == true || lnbBtnClickBlock == true)
		{
			arrowBtnClickBlock = false;
			lnbBtnClickBlock = false
		}
		else
		{
			$('.title').focus();
		}
	}).mousemove(function(e){
		// * 마우스가 움직의 움직임 감지 & 키와 엉키는 현상 방지
		// * 마우스가 움직였을 때 마우스 포커스 막아둔 것을 풀어준다.
		mouseOn = true;

	}).on('keydown',function(e){ // 키보드 조작 후 마우스를 움직이면 다른 곳에 포커스가 잡히기 전까지 포커스가 살아있다.

		if(e.keyCode == CURSOR_SHOW) 
		{
			$('.title').focus();
			mouseOn = true;
		}
		else if(e.keyCode == CURSOR_HIDE) 
		{
			mouseOn = false;
		}
	});

	$('.title').on("keydown",function(e){

		focusHideSetTimeFlag = false;
		setTimeout(function(){focusHideSetTimeFlag = true;}, 50);

		switch (lastMousePosition)
		{
		case "search" :
			$(".search").focus();
			break;

		case "close" :
			$(".close").focus();
			break;

		case "lnb" :
			$(".lnb ul li a").eq(leftMenuIndex).focus();
			e.preventDefault();
			break;

		case "arrow-up" :
			if(arrowUpBtn == true)
			{
				$(".arrow-up").focus();
			}
			else
			{
				$(".arrow-down").focus();
			}
			break;

		case "arrow-down" :
			if(arrowDownBtn == true)
			{
				$(".arrow-down").focus();
			}
			else
			{
				$(".arrow-up").focus();
			}
			break;

		case "list" :
			$(".list ul li a").eq(rightContentList).focus();
			e.preventDefault();
			break;

		case "back" :
			$(".backBtn a").focus();
			e.preventDefault();

		default : 

		}
	});	


	$('.content .list').on('mousewheel', function() {

		$('.title').focus();
		mouseOn = false; // 2016.07.13 스크롤 발생했을 때 마우스 포커스가 발생하지 않게 막아둔다.
		keyDownOn = false; // 2016.07.13 list에 마우스로 포커스를 잡고 방향키 조작후 스크롤을 동작시키면

	});

	$('.backBtn a').on('keydown', function(e){
		if(focusHideSetTimeFlag == true)
		{
			if(e.keyCode == rightKey)
			{
				if(sayBackBtnWhereFrom == "lnb") // 너 어디서에 왔니
				{ 
					$(".lnb ul li a").eq(leftMenuIndex).focus();
				}
				else if (sayBackBtnWhereFrom == "search")
				{
					if(isPageRtl)
					{
						$(".close").focus();
					}
					else
					{
						$(".search").focus();
					}
				}
				else 
				{
					$(".lnb ul li a").eq(leftMenuIndex).focus();
				}	
			}
			if(e.keyCode == enterKey)
			{
				backProcess(); // common.js
			}
		}
	}).mouseover(function() {

		lastMousePosition="back";
		$(".backBtn a").focus();

	}).mouseout(function() {

		$('.title').focus();

	}).focusin(function(){

		lastMousePosition = "back";

	});

	$(".search").on("keydown",function(e){

		keyDownOn = false; // 키보드 조작 off
		mouseOn = false; // 키 조작시 마우스 막기
		sayBackBtnWhereFrom = "search";

		if(focusHideSetTimeFlag == true)
		{
			if(e.keyCode == upKey)
			{
				$(".close").focus();
			}
			else if(e.keyCode == downKey)
			{
				leftMenuIndex = 0;
				$(".lnb ul li a").eq(leftMenuIndex).focus();
				e.preventDefault();
			}
			else if(e.keyCode == rightKey)
			{
				if(isPageRtl)
				{

				}
				else
				{
					$(".close").focus();
				}
			}
			else if(e.keyCode == leftKey)
			{
				if(isPageRtl)
				{
					$('.close').focus();
				}
				else
				{
					$('.backBtn a').focus();
				}
			}
		}
	})	.mouseover(function() {

		lastMousePosition="search";
		sayBackBtnWhereFrom = "search";
		$(".search").focus();

	})	.mouseout(function() {

		$('.title').focus();

	}).unbind('click').click(function(e){ 

		selectPageAccess("search.html", "search");
		e.stopPropagation(); // 두 번 클릭되는거 방지

	}).focusin(function(){

		lastMousePosition ="search";

	});

	$(".close").on("keydown", function(e){

		keyDownOn = false; // 키보드 조작 off
		mouseOn = false; // 키 조작시 마우스 막기

		if(focusHideSetTimeFlag == true)
		{
			if(e.keyCode == upKey)
			{
				$(".close").focus();
			}
			else if(e.keyCode == downKey)
			{
				$(".search").focus();
			}
			else if(e.keyCode == leftKey)
			{
				if(isPageRtl)
				{
					$('.backBtn a').focus();
				}
				else
				{
					$(".search").focus();
				}
			}
			else if(e.keyCode == rightKey)
			{
				if(isPageRtl)
				{
					$('.search').focus();
				}
			}
		}
	})	.mouseover(function() {

		lastMousePosition="close";
		$(".close").focus();

	})	.mouseout(function() {

		$('.title').focus();

	}).focusin(function(){
		lastMousePosition ="close";

	});

	$(".lnb ul li").on("keydown",function(e){ // Section의 lnb 영역에서 메뉴 부분

		keyDownOn = false; // 키보드 조작 off
		mouseOn = false; // 키 조작시 마우스 막기
		lnbBtnOn = true;
		sayBackBtnWhereFrom ="lnb";

		if(focusHideSetTimeFlag == true)
		{
			if(e.keyCode == upKey)
			{
				leftMenuIndex = $(this).index(); // 현재 Focus 된 부분의 Index를 저장

				if(leftMenuIndex == 0)
				{
					$(".search").focus();
				}
				else
				{
					leftMenuIndex--;
					$(".lnb ul li a").eq(leftMenuIndex).focus();
				}
			}
			else if(e.keyCode == downKey)
			{
				leftMenuIndex = $(this).index();

				if(leftMenuIndex < leftMenuSize - 1)
				{ 
					leftMenuIndex++;
					$(".lnb ul li a").eq(leftMenuIndex).focus();
				} 
			}
			else if(e.keyCode == rightKey)
			{
				if(isPageRtl)
				{
					if(arrowUpBtn)
					{
						$(".arrow-up").focus();
					}
					else
					{
						$(".arrow-down").focus()
					}
				}else
				{
					$(".list ul li a").eq(rightContentList).focus();
				}
			}
			else if(e.keyCode == leftKey)
			{
				$('.backBtn a').focus();	
			}
			else if(e.keyCode == enterKey)
			{
				var tmp = $(this).children('a').attr("href");
				lnbBtnClickBlock = true;
				selectPageAccess(tmp, "x");
			}
		}
	}).mouseover(function() {

		lastMousePosition="lnb";
		sayBackBtnWhereFrom ="lnb";
		leftMenuIndex = $(".lnb ul li").index(this); // 현재 포커스가 잡힌 list의 index > 0 1 2 3 4 ...
		$(".lnb ul li a").eq(leftMenuIndex).focus();

	}).mouseout(function() {

		$('.title').focus();

	}).on("focusin", function(){

		lastMousePosition ="lnb";
		window.localStorage.setItem("seeAllPageAccessException", "true");

	}).on("focusout",function(){

		window.localStorage.setItem("seeAllPageAccessException", "false"); 

	}).on("click",function(){

		var tmp = $(this).children('a').attr("href");
		lnbBtnClickBlock = true;
		selectPageAccess(tmp, "x");
	});

	$(".list ul li a").on("keydown", function(e){

		e.preventDefault();
		keyDownOn = true; // 키보드 조작 true
		mouseOn = false; // 키 조작시 마우스 막기
		var offset =  $(this).offset().top; // 현재 영역의 위치
		var focusedList = $(".list ul li a").index(this); // 현재 포커스가 잡힌 list의 index > 0 1 2 3 4 ...
		var lastIndex = 0; // each문에서 마지막 Index를 저장하기 위한 변수
		var firstIndex = 0; // each문에서 처음 Index를 저장하기 위한 변수

		if(focusHideSetTimeFlag == true)
		{
			if(e.keyCode == upKey)
			{
				var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
				var contentHeight = $(".content .list").height();
				var contentBottom = contentTop + contentHeight; // 1060
				var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
				var firstIndex = 0 ;

				$.each($('.list li'), function(index, list) {

					var listTop = $(list).offset().top ;

					if( listTop >= contentTop && listTop <= contentBottom )
					{
						firstIndex = index ;
						return false;
					}
				});

				keyBtnCase = "upkey";

				if(rightContentList <= 0)
				{
					arrowUpBtn=false;

					if(tvResolution == "FHD")
					{
						$(".arrow-up").css("background-position", "-120px 0px");//left top
					}
					else
					{
						$(".arrow-up").css("background-position", "-80px 0px");//left top
					}

					keyDownOn = false; // false 해준 이유는 $(".list").scrollTop(0) 때문에 스크롤이 발생해 의도하지 않은(스크롤 시 발생하는 이벤트) 이벤트가 발생한다.
					$(".list").scrollTop(0); // 스크롤을 맨 위로 이동
					$(".search").focus();

				}
				else
				{
					if(rightContentList == firstIndex)
					{
						rightContentList = rightContentList-1;
						$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(true);
						$(".list ul li a").eq(rightContentList).focus();
						// 스크롤 아래 버튼의 disabled를 풀어준다.
						arrowDownBtn = true;

						if(tvResolution == "FHD")
						{
							$(".arrow-down").css("background-position", "0px -60px");
						}
						else
						{
							$(".arrow-down").css("background-position", "0px -40px");
						}
					}
					else
					{
						rightContentList = rightContentList-1;
						$(".list ul li a").eq(rightContentList).focus();
						e.preventDefault();
					}
				}
			}
			if(e.keyCode == downKey)
			{
				var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
				var contentHeight = $(".content .list").height();
				var contentBottom = contentTop + contentHeight; // 1060
				var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();

				var lastIndex = 0 ;

				$.each($('.list li'), function(index, list) {

					var listTop = $(list).offset().top ;

					if( listTop >= contentTop && listTop <= contentBottom )
					{
						lastIndex = index ;
					}
				});

				keyBtnCase = "downkey";

				if(rightContentList < rightContentSize -1)
				{
					if(rightContentList == lastIndex)
					{
						rightContentList = rightContentList+1;
						$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(false);
						$(".list ul li a").eq(rightContentList).focus();
						// 스크롤 위 버튼의 disabled를 풀어준다.
						arrowUpBtn = true;
						$(".arrow-up").css("background-position", "0px 0px");
					}
					else
					{
						rightContentList = rightContentList+1;
						$(".list ul li a").eq(rightContentList).focus();
						e.preventDefault();
					}
				}
			}
			if(e.keyCode == leftKey)
			{
				if(isPageRtl)
				{
					if(offset < detailWrap/2) // 현재 포커스가 중간을 기준으로 중간보다 위에 있다면
					{ 
						if(arrowUpBtn == false)
						{
							$(".arrow-down").focus();
						}
						else if(arrowUpBtn == true)
						{
							$(".arrow-up").focus();
						}
					}
					else //  현재 포커스가 중간을 기준으로 중간보다 아래에 있다면
					{
						if(arrowDownBtn == true)
						{
							$(".arrow-down").focus();
						}
						else if(arrowDownBtn == false)
						{
							$(".arrow-up").focus();
						}
					}
				}
				else
				{
					$(".lnb ul li a").eq(leftMenuIndex).focus();
				}
			}
			if(e.keyCode ==	rightKey)
			{
				if(isPageRtl)
				{

				}else
				{
					if(offset < detailWrap/2) // 현재 포커스가 중간을 기준으로 중간보다 위에 있다면
					{ 
						if(arrowUpBtn == false)
						{
							$(".arrow-down").focus();
						}
						else if(arrowUpBtn == true)
						{
							$(".arrow-up").focus();
						}
					}
					else //  현재 포커스가 중간을 기준으로 중간보다 아래에 있다면
					{
						if(arrowDownBtn == true)
						{
							$(".arrow-down").focus();
						}
						else if(arrowDownBtn == false)
						{
							$(".arrow-up").focus();
						}
					}
				}
			}
			if(e.keyCode == enterKey)
			{
				var pageLink = $(this).attr("data-navi");
				var focusIndexValue = $(".list ul li a").index(this);
				var focusTextValue = $(this).text();
				var prevFocusInfo = focusIndexValue+"^"+focusTextValue;
				var iFrameLink = $(this).attr("data-link");

				window.localStorage.setItem("forJinA", iFrameLink); // 진아는 포커스를 찍은 후 초기화 해줘야한다.

				setRecentlyItem(iFrameLink);
				selectPageAccess(pageLink, prevFocusInfo);
				detailPageAccess(pageLink, iFrameLink);
			}
		}
	}).on("click", function(){

		var pageLink = $(this).attr("data-navi");
		var focusIndexValue = $(".list ul li a").index(this);
		var focusTextValue = $(this).text();
		var prevFocusInfo = focusIndexValue+"^"+focusTextValue;
		var iFrameLink = $(this).attr("data-link");

		window.localStorage.setItem("forJinA", iFrameLink); // 진아는 포커스를 찍은 후 초기화 해줘야한다.

		setRecentlyItem(iFrameLink);
		selectPageAccess(pageLink, prevFocusInfo);
		detailPageAccess(pageLink, iFrameLink);

	}).mousemove(function() {

		lastMousePosition="list";

		if(mouseOn ==true)
		{
			rightContentList = $(".list ul li a").index(this); // 현재 포커스가 잡힌 list의 index > 0 1 2 3 4 ...
			$(".list li a").eq(rightContentList).focus();
		}

	}).mouseout(function() {

		keyDownOn = false ;

		if(mouseOn ==true)
		{
			rightContentList = $(".list ul li a").index(this);
			$('.title').focus();	
		}

	}).focusin(function(){

		lastMousePosition ="list";

		var focusedList = $(".list ul li a").index(this); // 현재 포커스가 잡힌 list의 index > 0 1 2 3 4 ...

		if(focusedList == rightContentSize -1)
		{
			arrowDownBtn=false;

			if(tvResolution == "FHD")
			{
				$(".arrow-down").css("background-position", "-120px -60px");//left top
			}
			else
			{
				$(".arrow-down").css("background-position", "-80px -40px");//left top
			}
		}

	}).focusout(function(){

		mouseOn=false;

	});

	$(".arrow-up").on("keydown", function(e){

		keyDownOn = false; // 키보드 조작 off
		mouseOn = false; // 키 조작시 마우스 막기

		if(focusHideSetTimeFlag == true)
		{
			if(e.keyCode == leftKey){

				if(isPageRtl)
				{
					$(".lnb ul li a").eq(leftMenuIndex).focus();
				}
				else
				{
					moveArrowUpToContent();
				}
			}
			else if(e.keyCode == rightKey)
			{
				if(isPageRtl)
				{
					moveArrowUpToContent();
				}
			}
			else if(e.keyCode == upKey)
			{
				$(".header .search").focus();
			}
			else if(e.keyCode == downKey)
			{
				if(arrowDownBtn == false)
				{
					$(".arrow-up").focus();
				}
				else if(arrowDownBtn == true)
				{
					$(".arrow-down").focus();
				}
			}
			else if(e.keyCode == enterKey)
			{
				scroll_flag = true; // from SH
				arrowBtnOn = true; // parkoon
				isArrowUpOrDown ="up";
				arrowMouseDownOn = false;

				if(isEnterKeyPressed=="yes")
				{

				}else
				{
					$(".content .list").scrollTop($(".content .list").scrollTop() - ITEM_HEIGHT);
				}
			}
		}
	}).mousemove(function() {

		if(mouseOn == true)
		{
			if(arrowUpBtn == true)
			{
				keyDownOn =""; // 2016.08.02  리스트에서 키 조작 후 스크롤 버튼을 마우스로 누르면 리스트의 마지막을 기억하고 이벤트가 발생한다.
				lastMousePosition="arrow-up";
				$(".arrow-up").focus();
			}
		}

	}).mouseout(function() {
		$('.title').focus();	

	}).mousedown(function() {

		if(arrowUpBtn == true)
		{
			isArrowUpOrDown = "up";
			arrowBtnOn = true; // parkoon
			arrowMouseDownOn = true;
			timerId = setInterval(function(){ 

				$(".content .list").scrollTop($(".content .list").scrollTop() - ITEM_HEIGHT);

			}, SCROLL_INTERVAL_TIME);
		}
		else
		{
			lastMousePosition="arrow-up";
			$('.title').focus();	
		}

	}).mouseup(function(){

		clearInterval(timerId);

	}).focusin(function(){

		if(arrowUpBtn == true)
		{
			arrowBtnOn = true; // 누르고 있다가 때었을 때 ( 스크롤에서 arrow 버튼만 예외로 두기 위해서)
			lastMousePosition="arrow-up";

			if(tvResolution == "FHD")
			{
				$(".arrow-up").css("background-position", "-60px 0");
			}
			else
			{
				$(".arrow-up").css("background-position", "-40px 0");
			}
		}
		else
		{
			lastMousePosition="arrow-up";
			$('.title').focus();	
		}

	}).focusout(function(){

		clearInterval(timerId);
		arrowBtnOn = false; // 누르고 있다가 때었을 때 ( 스크롤에서 arrow 버튼만 예외로 두기 위해서)

		if(arrowUpBtn == false)
		{
			if(tvResolution == "FHD")
			{
				$(".arrow-up").css("background-position", "-120px 0");
			}
			else
			{
				$(".arrow-up").css("background-position", "-80px 0");
			}
		}
		else if( arrowUpBtn == true)
		{
			$(".arrow-up").css("background-position", "0 0");
		}
	}).on('click', function(){

		keyDownOn = false;
		arrowBtnClickBlock = true; // container 영역어서 arrow 버튼 빼기

	}).on('keyup', function(){

		arrowBtnOn = false; // 누르고 있다가 때었을 때 ( 스크롤에서 arrow 버튼만 예외로 두기 위해서)

		if(isEnterKeyPressed == "yes")
		{
			isEnterKeyPressed = "no";
		}

	});

	$(".arrow-down").on("keydown", function(e){

		keyDownOn = false; // 키보드 조작 off
		mouseOn = false; // 키 조작시 마우스 막기

		if(focusHideSetTimeFlag == true)
		{
			if(e.keyCode == leftKey)
			{
				if(isPageRtl)
				{
					$(".lnb ul li a").eq(leftMenuIndex).focus();
				}
				else
				{
					moveArrowDownToContent();
				}
			}
			else if(e.keyCode == rightKey)
			{
				if(isPageRtl)
				{
					moveArrowDownToContent();
				}
			}
			else if(e.keyCode == upKey)
			{
				if(arrowUpBtn == false)
				{
					$(".search").focus();
				}
				else if(arrowUpBtn == true)
				{

					$(".arrow-up").focus();
				}
			}
			else if(e.keyCode == enterKey)
			{
				scroll_flag = true; // from SH
				arrowBtnOn = true;
				arrowMouseDownOn = false;
				isArrowUpOrDown = "down";

				if(isEnterKeyPressed=="yes")
				{

				}
				else
				{
					$(".content .list").scrollTop($(".content .list").scrollTop() + ITEM_HEIGHT);
				}
			}
		}
	}).mousemove(function() {

		if(mouseOn==true)
		{
			if(arrowDownBtn == true)
			{
				keyDownOn =""; // 2016.08.02  리스트에서 키 조작 후 스크롤 버튼을 마우스로 누르면 리스트의 마지막을 기억하고 이벤트가 발생한다.
				lastMousePosition="arrow-down";
				$(".arrow-down").focus();
			}
		}

	}).mouseout(function() {
		
		$('.title').focus();	

	}).mousedown(function() {
		
		if(arrowDownBtn == true)
		{
			isArrowUpOrDown = "down";
			arrowBtnOn = true;
			arrowMouseDownOn = true;
			timerId = setInterval(function(){

				$(".content .list").scrollTop($(".content .list").scrollTop() + ITEM_HEIGHT);

			}, SCROLL_INTERVAL_TIME);
		}
		else
		{
			lastMousePosition="arrow-down";
			$('.title').focus();	
		}

	}).mouseup(function(){
		
		clearInterval(timerId);

	}).focusin(function(){

		if(arrowDownBtn == true)
		{
			arrowBtnOn = true; // 누르고 있다가 때었을 때 ( 스크롤에서 arrow 버튼만 예외로 두기 위해서)
			lastMousePosition="arrow-down";
			
			if(tvResolution == "FHD")
			{
				$(".arrow-down").css("background-position", "-60px -60px");
			}
			else
			{
				$(".arrow-down").css("background-position", "-40px -40px");
			}
		}
		else
		{
			lastMousePosition="arrow-down";
			$('.title').focus();	
		}

	}).focusout(function(){

		clearInterval(timerId);
		arrowBtnOn = false; // 누르고 있다가 때었을 때 ( 스크롤에서 arrow 버튼만 예외로 두기 위해서)
		
		if(arrowDownBtn == false)
		{
			if(tvResolution == "FHD")
			{
				$(".arrow-down").css("background-position", "-120px -60px");//left top
			}
			else
			{
				$(".arrow-down").css("background-position", "-80px -40px");//left top
			}

		}
		else if(arrowDownBtn == true)
		{
			if(tvResolution == "FHD")
			{
				$(".arrow-down").css("background-position", "0px -60px");//left top
			}
			else
			{
				$(".arrow-down").css("background-position", "0px -40px");//left top
			}

		}
	}).on('click', function(){

		keyDownOn = false;
		arrowBtnClickBlock = true; // container 영역어서 arrow 버튼 빼기

	}).on('keyup', function(){

		arrowBtnOn = false; // 누르고 있다가 때었을 때 ( 스크롤에서 arrow 버튼만 예외로 두기 위해서)
		
		if(isEnterKeyPressed=="yes")
		{
			isEnterKeyPressed="no";
		}
	});
});

function initialArrowBtnCheck()
{
	var scrollMove =$(".content .list").scrollTop(); // 스크롤이 움직인 거리
	var contentHeight =$('.content .list').innerHeight();
	var scrollHeight =$(".content .list")[0].scrollHeight;

	if (scrollMove <= 0) 
	{
		arrowUpBtn = false;
		arrowDownBtn = true;

		if(tvResolution == "FHD")
		{
			$(".arrow-up").css("background-position", "-120px 0px");//left top
		}
		else
		{
			$(".arrow-up").css("background-position", "-80px 0px");//left top
		}
	}
	else if (scrollMove + contentHeight >= scrollHeight ) 
	{
		arrowUpBtn = true;
		arrowDownBtn = false;

		if(tvResolution == "FHD")
		{
			$(".arrow-down").css("background-position", "-120px -60px");//left top
		}
		else
		{
			$(".arrow-down").css("background-position", "-80px -40px");//left top
		}
	}
	else
	{
		arrowUpBtn = true;
		arrowDownBtn = true;
		
		if(tvResolution == "FHD")
		{
			$(".arrow-up").css("background-position", "0px 0px");//left top
			$(".arrow-down").css("background-position", "0px -60px");//left top
		}
		else
		{
			$(".arrow-up").css("background-position", "0px 0px");//left top
			$(".arrow-down").css("background-position", "0px -40px");//left top
		}
	}
}

function initialFocusCheck()
{

	var initialFocusInfo;
	
	if(window.localStorage.getItem("prevFocusInfo") == null) 
	{
		initialFocusInfo = "x";
	} 
	else 
	{
		initialFocusInfo = window.localStorage.getItem("prevFocusInfo").split("^")[0];
	}

		if(initialFocusInfo == "x") // 포커스 정보가 저장되어 있지 않은 경우
		{ 
			$(".lnb ul li:nth-child(1) a").focus();
		}
		else // 포커스 정보가 저장되어 있는 경우
		{
			if(initialFocusInfo == "search") // 너 어디서 왔니? search
			{ 
				$(".search").focus();

			}
			else // 너 어디서 왔니? list ( search 와 list 밖에 없으니 search만 골라주면 나머지는 list )
			{ 
				rightContentList = Number(initialFocusInfo);
				$(".list ul li a").eq(rightContentList).focus();
			}
		}

		window.localStorage.setItem("prevFocusInfo","x");
}

function moveArrowDownToContent()
{
	var contentTop = $(".content .list").offset().top;
	var contentHeight = $(".content .list").height();
	var contentBottom = contentTop + contentHeight; // 1060
	var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
	var lastIndex = 0 ;

	$.each($('.list li'), function(index, list) {

		var listTop = $(list).offset().top ;
		
		if( listTop >= contentTop && listTop <= contentBottom - listMargin )
		{
			lastIndex = index ;
		}
	});

	rightContentList = lastIndex;
	$(".list ul li a").eq(rightContentList).focus();

}

function moveArrowUpToContent()
{
	var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
	var contentHeight = $(".content .list").height();
	var contentBottom = contentTop + contentHeight; // 1060
	var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
	var firstIndex = 0 ;

	$.each($('.list li'), function(index, list) {

		var listTop = $(list).offset().top ;
		
		if( listTop >= contentTop && listTop <= contentBottom - listMargin )
		{
			firstIndex = index ;
			return false;
		}
	});

	rightContentList = firstIndex;
	$(".list ul li a").eq(rightContentList).focus();

}

function eraseLastUlMargin()
{
	var rightUlsize = $(".content .list ul").size(); 
	$(".content .list ul").eq(rightUlsize-1).css('margin-bottom','0px'); // 마지막의 List의 Margin Bottom 을 0 px로 해주자.
}

function checkCssFromScroll()
{

	var scrollMove =$(".content .list").scrollTop(); // 스크롤이 움직인 거리
	var contentHeight =$('.content .list').innerHeight();
	var scrollHeight =$(".content .list")[0].scrollHeight;

	if (scrollMove <= 0) 
	{
		arrowUpBtn = false;
		arrowDownBtn = true;
		
		if(tvResolution == "FHD")
		{
			$(".arrow-up").css("background-position", "-120px 0px");
			$(".arrow-down").css("background-position", "-0px -60px");
		}
		else
		{
			$(".arrow-up").css("background-position", "-80px 0px");
			$(".arrow-down").css("background-position", "-0px -40px");
		}
	}
	else if (scrollMove + contentHeight >= scrollHeight ) 
	{
		arrowUpBtn = true;
		arrowDownBtn = false;

		if(tvResolution == "FHD")
		{
			$(".arrow-up").css("background-position","0px 0px");
			$(".arrow-down").css("background-position", "-120px -60px");
		}
		else
		{
			$(".arrow-up").css("background-position","0px 0px");
			$(".arrow-down").css("background-position", "-80px -40px");
		}
	}
	else
	{
		arrowUpBtn = true;
		arrowDownBtn = true;

		if(tvResolution == "FHD")
		{
			$(".arrow-up").css("background-position", "0px 0px");//left top
			$(".arrow-down").css("background-position", "0px -60px");//left top
		}
		else
		{
			$(".arrow-up").css("background-position", "0px 0px");//left top
			$(".arrow-down").css("background-position", "0px -40px");//left top
		}
	}
}

function checkArrowDownCss()
{
	var scrollMove =$(".content .list").scrollTop();
	var contentHeight =$('.content .list').innerHeight();
	var scrollHeight =$(".content .list")[0].scrollHeight;
	var listUlMargin = $(".content .list ul li").outerHeight(true) -$(".content .list ul li").outerHeight();

	if (scrollMove + contentHeight >= scrollHeight-listUlMargin) // 2016.08.11 25로 박혀 있는 값을 유동적으로 변환 --- parkoon
	{ 
		arrowDownBtn = false;
		$(".content .list").scrollTop(scrollHeight); // 2016.08.11 유동적으로 변환하면서 약간의 리스트가 남는 현상이 발생함에 따라 스크롤을 맨 아래로 내려줌 --- parkoon

		if(arrowMouseDownOn)
		{
			$(".title").focus();
			if(tvResolution == "FHD")
			{
				$(".arrow-down").css("background-position", "-120px -60px");
			}
			else
			{
				$(".arrow-down").css("background-position", "-80px -40px");
			}
		}
		else
		{
			$(".arrow-up").focus();
			
			if(tvResolution == "FHD")
			{
				$(".arrow-up").css("background-position", "-60px 0px");
				$(".arrow-down").css("background-position", "-120px -60px");//left top
			}
			else
			{
				$(".arrow-up").css("background-position", "-40px 0px");
				$(".arrow-down").css("background-position", "-80px -40px");//left top
			}
		}
		
		isEnterKeyPressed = "yes";
		
	}
	else
	{
		arrowDownBtn = true;
		arrowUpBtn=true;

		if(tvResolution == "FHD")
		{
			$(".arrow-up").css("background-position", "0px 0px");
			$(".arrow-down").css("background-position", "-60px -60px");

		}
		else
		{
			$(".arrow-up").css("background-position", "0px 0px");
			$(".arrow-down").css("background-position", "-40px -40px");
		}
	}
}

function checkArrowUpCss()
{
	scroll_flag = true; // from SH
	arrowBtnOn = true; // parkoon
	var scrollMove =$(".content .list").scrollTop(); // 스크롤이 움직인 거리
	
	if (scrollMove <= 0) 
	{
		arrowUpBtn=false;

		if(arrowMouseDownOn)
		{
			$(".title").focus();
			
			if(tvResolution == "FHD")
			{
				$(".arrow-up").css("background-position", "-120px 0px");//left top
			}
			else
			{
				$(".arrow-up").css("background-position", "-80px 0px");//left top
			}

		}
		else
		{
			$(".arrow-down").focus();
			
			if(tvResolution == "FHD")
			{
				$(".arrow-up").css("background-position", "-120px 0px");//left top
				$(".arrow-down").css("background-position", "-60px -60px");//left top
			}
			else
			{
				$(".arrow-up").css("background-position", "-80px 0px");//left top
				$(".arrow-down").css("background-position", "-40px -40px");//left top
			}
		}
		
		isEnterKeyPressed = "yes";
		
	}
	else
	{
		arrowUpBtn=true;
		arrowDownBtn = true;
		
		if(tvResolution == "FHD")
		{
			$(".arrow-down").css("background-position", "0px -60px");
		}
		else
		{
			$(".arrow-down").css("background-position", "0px -40px");
		}
	}

}
