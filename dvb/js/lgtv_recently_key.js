
var SCROLL_INTERVAL_TIME = 50;
var ITEM_HEIGHT = 50;
var tagitem ="";
var timerId;
var comeFrom=""; // 아무것도 없을 땐 초기 포커스가 여기니까!?  리스트가 있을때는 달라지겠네... 체크해야할 듯?
var focusHideSetTimeFlag = true;
var isListExist = false;
var isArrowBarExist = false;
var listIndex = 0;
var arrowBtnOn = false;
var magicMouseOn = false;
var isArrowUpOrDown ="";
var arrowBtnClickBlock = false;
var arrowMouseDownOn = false;
var isEnterKeyPressed ="";
var arrowUpBtn = false; // 처음 들어갔을 때 위 스크롤 버튼 off
var arrowDownBtn = true; // 처음 들어갔을 때 아래 스크롤 버튼 on
var isPageRtl ;
var isPrevBtnHeader; // back버튼으로 갈때 헤더 버튼에서 왔는지 리스트에서 왔는지 체크
var arrowCheckForRtl ="";
var tvResolution = "";
const TAB_KEY = 9;

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
	getRecentlyItem();
	initialArrowBtnCheck();
	initialFocusCheck();

	if($("html").attr("dir") === "rtl")
	{
		isPageRtl = true;
	}
	else
	{
		isPageRtl = false;
	}

	var recentlyListSize = $("#recentlyListDiv ul li ").size(); 
	var lastIndex = 0; // each문에서 마지막 Index를 저장하기 위한 변수
	var firstIndex = 0; // each문에서 처음 Index를 저장하기 위한 변수
	var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
	var contentHeight = $(".content .list").height();
	var contentBottom = contentTop + contentHeight; // 1060

	$('.wrap').on('click',function(e){

		if(arrowBtnClickBlock)
		{
			arrowBtnClickBlock = false;
		}
		else
		{
			$('.title').focus();
		}

	}).on('keydown',function(e){

		if(e.keyCode == CURSOR_SHOW) 
		{
			magicMouseOn = true;
			$('.title').focus();
		}
		else if(e.keyCode == CURSOR_HIDE) 
		{
			magicMouseOn = false;
		}

	}).on('mousemove', function(){

		magicMouseOn = true;

	});

	$('.content .list').on('mousewheel', function() {

		$('.title').focus();
		magicMouseOn = false; 

	});

	$('.content .list').on('scroll', function() {
		
		magicMouseOn = false; 
		$('.scroll-hide').hide();
		$('.scroll-hide').stop(true, true);
		$('.scroll-hide').fadeIn(1500);
		
		if(arrowBtnOn)
		{
			if(isArrowUpOrDown =="arrowDown")
			{
				checkArrowDownCss();
			}
			else if(isArrowUpOrDown == "arrowUp")
			{
				checkArrowUpCss();
			}
		}
		else
		{
			checkCssFromScroll();
		}

	});

	$('.title').on('keydown',function(e){

		focusHideSetTimeFlag = false;
		setTimeout(function(){focusHideSetTimeFlag = true;}, 50);

		switch (comeFrom)
		{

		case "ok" :
			$('#noneListDiv a').focus();
			break;

		case "back" :
			$('.backBtn a').focus();
			break;

		case "arrowUp" :
			if(arrowUpBtn)
			{
				$('.arrow-up').focus();
			}
			else
			{
				$('.arrow-down').focus();
			}
			break;

		case "arrowDown" :
			if(arrowDownBtn)
			{
				$('.arrow-down').focus();
			}
			else
			{
				$('.arrow-up').focus();
			}
			break;

		case "list" :
			$("#recentlyListDiv ul li a").eq(listIndex).focus();
			e.preventDefault();
			break;

		default : 

		}
	});

	$('#noneListDiv a').on('keydown', function(e) {

		if(focusHideSetTimeFlag == true)
		{
			if(e.keyCode == upKey)
			{
			}
			else if(e.keyCode == leftKey)
			{
				$('.backBtn a').focus();
			} else if (e.keyCode == TAB_KEY) {
				e.preventDefault();
				$('.backBtn a').focus();
			}
		}

	}).on('mouseover', function(e){

		$('#noneListDiv a').focus();

	}).on('mouseout', function(e){

		$('.title').focus();

	}).on('focusin',function(e){

		comeFrom ="ok";
		isPrevBtnHeader = false;

	});

	$('.backBtn a').on('keydown', function(e){

		if(focusHideSetTimeFlag == true)
		{
			if(e.keyCode == rightKey)
			{
				if(!isPageRtl)
				{
					if (isPrevBtnHeader) 
					{
					} 
					else 
					{
						if(isListExist)
						{
							$("#recentlyListDiv ul li a").eq(listIndex).focus();
						}
						else
						{
							$('#noneListDiv a').focus();
						}
					} 
				}
				else
				{
					if (isPrevBtnHeader) 
					{
						
					}
					else
					{
						if(isListExist)
						{
							if(isArrowBarExist)
							{
								if(arrowCheckForRtl == "arrowUp")
								{
									$('.arrow-up').focus();
								}
								else if(arrowCheckForRtl == "arrowDown")
								{
									$('.arrow-down').focus();
								}
							}
							else
							{
								$("#recentlyListDiv ul li a").eq(listIndex).focus();
							}
						}
						else
						{
							$('#noneListDiv a').focus();
						}
					}
				}
			}
			else if(e.keyCode == enterKey)
			{
				backProcess();
			} else if (e.keyCode == TAB_KEY) {
				e.preventDefault();
				if(!isPageRtl)
				{
					if (isPrevBtnHeader) 
					{
					} 
					else 
					{
						if(isListExist)
						{
							listIndex = 0 ;
							$("#recentlyListDiv ul li a").eq(listIndex).focus();
						}
						else
						{
							$('#noneListDiv a').focus();
						}
					} 
				}
				else
				{
					if (isPrevBtnHeader) 
					{
						
					}
					else
					{
						if(isListExist)
						{
							if(isArrowBarExist)
							{
								if(arrowCheckForRtl == "arrowUp")
								{
									$('.arrow-up').focus();
								}
								else if(arrowCheckForRtl == "arrowDown")
								{
									$('.arrow-down').focus();
								}
							}
							else
							{
								$("#recentlyListDiv ul li a").eq(listIndex).focus();
							}
						}
						else
						{
							$('#noneListDiv a').focus();
						}
					}
				}
			}
		}

	}).on('mouseover', function(e){

		$('.backBtn a').focus();

	}).on('mouseout', function(e){

		$('.title').focus();

	}).on('focusin',function(e){

		comeFrom ="back";

	});

	$("#recentlyListDiv ul li a").on('keydown',function(e){

		e.preventDefault(); //* 2016.08.11 리스트에서 포커스가 사라진 후 다시 리스트로 돌아왔을 때 스크롤이 이동하여 리스트가 짤려 보이는 현상 --- parkoon 

		var offset =  $(this).offset().top; // 현재 영역의 위치
		var focusedList = $("#recentlyListDiv ul li a").index(this); // 현재 포커스가 잡힌 list의 index > 0 1 2 3 4 ...
		var offset =  $(this).offset().top; // 현재 영역의 위치
		magicMouseOn = false;	

		if(focusHideSetTimeFlag == true)
		{

			if(e.keyCode == upKey)
			{
				if(listIndex == 0)
				{
					arrowUpBtn=false;

					$(".arrow-up").css("background-position", "-80px 0px");

					$(".list").scrollTop(0); // 스크롤을 맨 위로 이동
				
				}
				else
				{
					$.each($('.list li'), function(index, list){

						var listTop = $(list).offset().top ;

						if( listTop >= contentTop && listTop <= contentBottom )
						{
							firstIndex = index ;
							return false;
						}
					});

					if(firstIndex == focusedList)
					{
						listIndex --;
						$("#recentlyListDiv ul li a").eq(listIndex).get(0).scrollIntoView(true);
						$("#recentlyListDiv ul li a").eq(listIndex).focus();
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
						listIndex --;
						$("#recentlyListDiv ul li a").eq(listIndex).focus();
					}
				}
			}
			else if(e.keyCode == downKey)
			{
				e.preventDefault();
				if(listIndex < recentlyListSize -1 )
				{
					$.each($('.list li'), function(index, list) {

						var listTop = $(list).offset().top ;

						if( listTop >= contentTop && listTop <= contentBottom )
						{
							lastIndex = index ;
						}
					});

					if(lastIndex == focusedList)
					{
						listIndex ++;
						$("#recentlyListDiv ul li a").eq(listIndex).get(0).scrollIntoView(false);
						$("#recentlyListDiv ul li a").eq(listIndex).focus();

						arrowUpBtn = true;
						$(".arrow-up").css("background-position", "0px 0px");


					}
					else
					{
						listIndex ++;
						$("#recentlyListDiv ul li a").eq(listIndex).focus();
					}
				}
				else
				{
					//console.log("No More ++");
				}
			} else if (e.keyCode == TAB_KEY) {
				e.preventDefault();
				if(listIndex < recentlyListSize -1 )
				{
					$.each($('.list li'), function(index, list) {

						var listTop = $(list).offset().top ;

						if( listTop >= contentTop && listTop <= contentBottom )
						{
							lastIndex = index ;
						}
					});

					if(lastIndex == focusedList)
					{
						listIndex ++;
						$("#recentlyListDiv ul li a").eq(listIndex).get(0).scrollIntoView(false);
						$("#recentlyListDiv ul li a").eq(listIndex).focus();

						arrowUpBtn = true;
						$(".arrow-up").css("background-position", "0px 0px");


					}
					else
					{
						listIndex ++;
						$("#recentlyListDiv ul li a").eq(listIndex).focus();
					}
				}
				else if (listIndex >= recentlyListSize -1) {

					$('.backBtn a').focus();
				}
			
			}
			else if(e.keyCode == leftKey)
			{
				if(!isPageRtl)
				{
					$('.backBtn a').focus();
				}
				else
				{
					if(isArrowBarExist) // 스크롤 버튼이 있는 경우 
					{ 
						if(offset < contentHeight /2)
						{
							if(arrowUpBtn)
							{
								$('.arrow-up').focus();
							}
							else
							{
								$('.arrow-down').focus(); 
							}
						}
						else
						{
							if(arrowDownBtn)
							{
								$('.arrow-down').focus(); 
							}
							else
							{
								$('.arrow-up').focus();
							}
						}
					}
					else
					{
						$('.backBtn a').focus();
					}
				}
			}
			else if(e.keyCode == rightKey)
			{
				if(!isPageRtl)
				{
					if(isArrowBarExist)
					{
						if(offset < contentHeight /2)
						{
							if(arrowUpBtn)
							{
								$('.arrow-up').focus();
							}
							else
							{
								$('.arrow-down').focus(); 
							}
						}
						else
						{
							if(arrowDownBtn)
							{
								$('.arrow-down').focus(); 
							}
							else
							{
								$('.arrow-up').focus();
							}
						}
					}
				}
			}
			else if(e.which == enterKey)
			{

				var pageLink = $(this).attr("data-navi");
				var prevFocusInfo = $(".list ul li a").index(this);
				var iFrameLink = $(this).attr("data-link");

				window.localStorage.setItem("forJinA", iFrameLink); 
				setRecentlyItem(iFrameLink);
				selectPageAccess(pageLink, prevFocusInfo);
				detailPageAccess(pageLink, iFrameLink);
			}
		}
	}).on('focusin', function(e){

		comeFrom = "list";
		listIndex = $("#recentlyListDiv ul li a").index(this); // 현재 포커스가 잡힌 list의 index > 0 1 2 3 4 ...
		isPrevBtnHeader = false;

	}).on('click', function(e){

		var pageLink = $(this).attr("data-navi");
		var prevFocusInfo = $(".list ul li a").index(this);
		var iFrameLink = $(this).attr("data-link");

		window.localStorage.setItem("forJinA", iFrameLink); // 진아는 포커스를 찍은 후 초기화 해줘야한다.
		setRecentlyItem(iFrameLink);
		selectPageAccess(pageLink, prevFocusInfo);
		detailPageAccess(pageLink, iFrameLink);

	}).on('mousemove', function(e){

		if(magicMouseOn)
		{
			listIndex = $("#recentlyListDiv ul li a").index(this); 
			$("#recentlyListDiv ul li a").eq(listIndex).focus();
		}

	}).on('mouseout', function(e){

		if(magicMouseOn)
		{
			$('.title').focus();
		}

	});

	$('.arrow-up').on('keydown', function(e){

		if(focusHideSetTimeFlag == true)
		{
			if(e.keyCode == upKey)
			{
				$('.search').focus();
			}
			else if(e.keyCode == downKey)
			{
				if(arrowDownBtn)
				{
					$('.arrow-down').focus();
				}
				else
				{
					$('.arrow-up').focus();
				}

			}
			else if(e.keyCode == leftKey)
			{
				if(!isPageRtl)
				{
					$.each($('.list li'), function(index, list) {

						var listTop = $(list).offset().top ;

						if( listTop >= contentTop && listTop <= contentBottom )
						{
							firstIndex = index ;
							return false;
						}

					});

					listIndex = firstIndex ;
					$("#recentlyListDiv ul li a").eq(listIndex).focus();
					// 리스트에서 맨 위로 이동하자

				}
				else
				{
					arrowCheckForRtl ="arrowUp";
					$('.backBtn a').focus();
				}
			}
			else if(e.keyCode == rightKey)
			{
				if(isPageRtl)
				{
					$.each($('.list li'), function(index, list) {

						var listTop = $(list).offset().top ;

						if( listTop >= contentTop && listTop <= contentBottom )
						{
							firstIndex = index ;
							return false;
						}
					});

					listIndex = firstIndex ;
					$("#recentlyListDiv ul li a").eq(listIndex).focus();

				}
			}
			else if(e.keyCode == enterKey)
			{
				arrowBtnOn = true;
				arrowBtnClickBlock = true;
				arrowMouseDownOn = false;
				isArrowUpOrDown ="arrowUp";

				if(isEnterKeyPressed=="yes")
				{

				}else
				{
					$(".content .list").scrollTop($(".content .list").scrollTop() - ITEM_HEIGHT);
				}
			}
		}
	}).on('focusin', function(){

		if(arrowUpBtn == true)
		{
			arrowBtnOn = true; // 누르고 있다가 때었을 때 ( 스크롤에서 arrow 버튼만 예외로 두기 위해서)
			comeFrom="arrowUp";

			if(tvResolution == "FHD")
			{
				$(".arrow-up").css("background-position", "-60px 0");

			}else
			{
				$(".arrow-up").css("background-position", "-40px 0");
			}
		}
		else
		{
			comeFrom="arrowUp";
			$('.title').focus();	
		}

	}).on('focusout', function(){

		clearInterval(timerId);
		arrowBtnOn = false;

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

	}).on('mousedown', function(){

		if(arrowUpBtn)
		{
			arrowBtnClickBlock = true;
			arrowMouseDownOn = true;
			isArrowUpOrDown ="arrowUp";

			timerId = setInterval(function(){ 

				$(".content .list").scrollTop($(".content .list").scrollTop() - ITEM_HEIGHT);

			}, SCROLL_INTERVAL_TIME);
		}
		else
		{
			$(".title").focus();
		}

	}).on('mouseup', function(){

		clearInterval(timerId);

	}).on('keyup', function(){

		arrowBtnOn = false;

		if(isEnterKeyPressed=="yes")
		{
			isEnterKeyPressed="no";
		}

	}).on('mousemove', function(){

		if(magicMouseOn)
		{
			if(arrowUpBtn)
			{
				isArrowUpOrDown ="arrowUp";
				$('.arrow-up').focus();
			}
		}

	}).on('mouseout', function(){

		$('.title').focus();

	});

	$('.arrow-down').on('keydown', function(e){

		if(focusHideSetTimeFlag == true)
		{
			if(e.keyCode == upKey)
			{
				if(arrowUpBtn)
				{
					$('.arrow-up').focus();
				}
				else
				{
					$('.search').focus();
				}
			}
			else if(e.keyCode == downKey)
			{

			}
			else if(e.keyCode == leftKey)
			{
				if(!isPageRtl)
				{
					$.each($('.list li'), function(index, list) {

						var listTop = $(list).offset().top ;

						if( listTop >= contentTop && listTop <= contentBottom )
						{
							lastIndex = index ;
						}
					});

					listIndex = lastIndex ;
					$("#recentlyListDiv ul li a").eq(listIndex).focus();

				}
				else
				{
					arrowCheckForRtl ="arrowDown";
					$('.backBtn a').focus();
				}
			}
			else if(e.keyCode == rightKey)
			{
				if(isPageRtl)
				{
					$.each($('.list li'), function(index, list) {

						var listTop = $(list).offset().top ;

						if( listTop >= contentTop && listTop <= contentBottom )
						{
							lastIndex = index ;
						}
					});

					listIndex = lastIndex ;
					$("#recentlyListDiv ul li a").eq(listIndex).focus();

				}
			}
			else if(e.keyCode == enterKey)
			{
				arrowBtnClickBlock = true;
				arrowBtnOn = true;
				arrowMouseDownOn = false;
				isArrowUpOrDown ="arrowDown";

				if(isEnterKeyPressed=="yes")
				{

				}
				else
				{
					$(".content .list").scrollTop($(".content .list").scrollTop() + ITEM_HEIGHT);
				}
			}
		}

	}).on('focusin', function(){

		if(arrowDownBtn == true)
		{
			arrowBtnOn = true; // 누르고 있다가 때었을 때 ( 스크롤에서 arrow 버튼만 예외로 두기 위해서)
			comeFrom="arrowDown";

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
			comeFrom="arrowDown";
			$('.title').focus();	
		}
	}).on('focusout', function(){

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
	}).on('mousedown', function(){

		if(arrowDownBtn)
		{
			arrowBtnClickBlock = true;
			arrowMouseDownOn = true;
			isArrowUpOrDown ="arrowDown";
			timerId = setInterval(function(){ 

				$(".content .list").scrollTop($(".content .list").scrollTop() + ITEM_HEIGHT);

			}, SCROLL_INTERVAL_TIME);
		}
		else
		{
			$('.title').focus();
		}

	}).on('mouseup', function(){

		clearInterval(timerId);

	}).on('keyup', function(){

		arrowBtnOn = false;

		if(isEnterKeyPressed=="yes")
		{
			isEnterKeyPressed="no";
		}

	}).on('mousemove', function(){

		if(magicMouseOn)
		{
			if(arrowDownBtn)
			{
				isArrowUpOrDown ="arrowDown";
				$('.arrow-down').focus();
			}
		}
	}).on('mouseout', function(){

		$('.title').focus();

	});

});

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
	var listUlMargin = $(".content .list ul li").outerHeight(true) - $(".content .list ul li").outerHeight();

	//if (scrollMove + contentHeight >= scrollHeight-25) { // 이건 가라야....
	if (scrollMove + contentHeight >= scrollHeight - listUlMargin) // 2016.08.11 25로 박혀 있는 값을 유동적으로 변환 --- parkoon
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
				$(".arrow-down").css("background-position", "-120px -60px");
			}
			else
			{
				$(".arrow-up").css("background-position", "-40px 0px");
				$(".arrow-down").css("background-position", "-80px -40px");
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
				$(".arrow-up").css("background-position", "-120px 0px");
			}
			else
			{
				$(".arrow-up").css("background-position", "-80px 0px");
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

function initialArrowBtnCheck()
{

	var scrollMove =$(".content .list").scrollTop(); // 스크롤이 움직인 거리
	var contentHeight =$('.content .list').innerHeight();
	var scrollHeight =$(".content .list")[0].scrollHeight;

	if (scrollMove <= 0) 
	{
		arrowUpBtn = false;

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
	var initialFocusInfo = window.localStorage.getItem("prevFocusInfo");
	var savedRecentlyList = window.localStorage.getItem("recentlyItem");

	if(initialFocusInfo == null) 
	{
		initialFocusInfo = "x";
	}

		if(initialFocusInfo == "x") // 포커스 정보가 저장되어 있지 않은 경우
		{ 
			if(savedRecentlyList != null || savedRecentlyList != undefined)
			{
				listIndex = 0;
				$("#recentlyListDiv ul li a").eq(listIndex).focus();
				comeFrom ="list";
				isListExist = true;

			}
			else
			{
				comeFrom ="ok"; // list가 존재하지 않을 시 초기 포커스는 OK 버튼으로 기억한다.
				isListExist = false;
				$('#noneListDiv a').focus();
			}
		}
		else // 포커스 정보가 저장되어 있는 경우
		{ 
			if(initialFocusInfo == "search") // 너 어디서 왔니? search
			{ 
				$(".search").focus();

				if(savedRecentlyList != null || savedRecentlyList != undefined)
				{
					isListExist = true;

				}
				else
				{
					isListExist = false;
				}
			}
			else // 너 어디서 왔니? list ( search 와 list 밖에 없으니 search만 골라주면 나머지는 list )
			{ 
				isListExist = true;
				listIndex = 0;
				$("#recentlyListDiv ul li a").eq(listIndex).focus();
			}
		}

		window.localStorage.setItem("prevFocusInfo","x");

}