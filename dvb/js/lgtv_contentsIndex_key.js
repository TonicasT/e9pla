/* PC VER. */
var ITEM_HEIGHT = 50;
var SCROLL_INTERVAL_TIME = 45;
var rightContentList = 0;
var leftMenuIndex = 1;
var timerId;
var lastMousePosition = "lnb";
var sayBackBtnWhereFrom = "";
var focusHideSetTimeFlag = true;
var arrowUpBtn = false;
var arrowDownBtn = true;
var keyDownOn = false;
var keyBtnCase = "";
var mouseOn = false;
var arrowBtnClickBlock = false;
var lnbBtnClickBlock = false;
var lnbBtnOn = false;
var isEnterKeyPressed = "";
var isPageRtl = false;
var arrowCssControl = true;
var arrowBtnOn = false;
var isArrowUpOrDown = "";
var arrowMouseDownOn = false;
var tvResolution = "";
var lastListCssControl = false;  //* 키를 이용해 리스트 마지막에 포커스를 이동시켰는데 그에 따른 동작이 발생하지 않는다.
//* 원인을 찾아보니 checkCssFromScroll() 함수가 최종적으로 실행되고 맨 아래가 아닌 중간에 있을 때에 따른 동작이 발생해 생긴 문제이다.
//* checkCssFromScroll() 를 키 동작을 했을 때 막자.
var lastListCssControlExceptScroll = false;

/* 4.0 고도화 (Navigation 관련 변수) */
var indexBtnClickBlock = false;
var topBtnClickBlock = false;
var quickArrowBlock = false;
var quickBtnNum = 0;
var moveMenuToQuickBtn = true;
var clickedQuickBtnIndex = 0;
var rememberFocusMenuToQuick = "";
var rememberFocusSearchToQuick = "";
var rememberFocusContentsToQuick = 'indexListBtn';
var isQuickLeftArrowOpen = false;
var isQuickRightArrowOpen = false;
var isQuickLeftBtnClick = false;
var isQuickRightBtnClick = false;
var isArrowBtnClicked = false;
var quickBtnSize = 0;
var isQickBtnBlock = false;

$.fn.hasScrollBar = function () {
	return this.children('ul').innerWidth() > this.innerWidth() ? true : false;
}

$.fn.focusWithoutScrolling = function() {
	let x = window.scrollX, 
		y = window.scrollY;
	this.focus();
	window.scrollTo( x, y );

	return this;
};

let naviBtn = {
	nextSize    : 60,
	prevSize	: 60,
	defaultSize : 60,
	isLast      : false,
	isFirst     : false
};

$(document).ready(function () {

	var leftQuickBtnFocusOn = function () {
		$('.indexTop .left').focus();
		(tvResolution === 'FHD') ? $(".indexTop .left").css("background-position", "0px -60px") : $(".indexTop .left").css("background-position", "0px -40px");
	}

	var leftQuickBtnFocusOut = function () {
		$('.title').focus();
		$(".indexTop .left").css("background-position", "0px 0px");
	}

	var rightQuickBtnFocusOn = function () {
		$('.indexTop .right').focus();
		(tvResolution === 'FHD') ? $(".indexTop .right").css("background-position", "-60px -60px") : $(".indexTop .right").css("background-position", "-40px -40px");
	}

	var rightQuickBtnFocusOut = function () {
		$('.title').focus();
		(tvResolution === 'FHD') ? $(".indexTop .right").css("background-position", "-60px 0px") : $(".indexTop .right").css("background-position", "-40px 0px");
	}

	var appendQuickBtn = function () {
		var naviIndexLength =[];
		var className = "";
		$('.index .list h3').each(function () {
			naviIndexLength.push($(this).text().length);
			if ($(this).text().length === 1) {
				className = "wordOne";
			} else if ($(this).text().length === 2) {
				className = "wordTwo";
			} else if ($(this).text().length === 3) {
				className = "wordThree";
			} else if ($(this).text().length === 4) {
				className = "wordFour";
			}
			
			$('.indexBtn ul').append('<li class="' + className + '"><a href="#"><span class="text">' + $(this).text() + '</span></a></li>');
		});

		var naviMaxIndexLength =Math.max.apply(null, naviIndexLength);
		switch (naviMaxIndexLength){
			case 2: $(".detailWrap .index .navigator").addClass("max two");break;
			case 3: $(".detailWrap .index .navigator").addClass("max three");break;
			case 4: $(".detailWrap .index .navigator").addClass("max four"); break;
			default: return false; break;
		}
	}

	var focusAndMoveScroll = function (indexNum, moveScroll) {
		clickedQuickBtnIndex = indexNum;
		$('.index .list ul:eq(' + indexNum + ') a:eq(0)').focus();
		moveScroll();
	}


	var visibleFirstContents = function (el) {

		var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
		var contentHeight = $(".content .list").height();
		var contentBottom = contentTop + contentHeight;
		var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
		var firstContentsIndex = 0;
		var selectedElDir = '';
		var selectedElPos = $(el).offset().left;
		var standardPos = $('.navigator').offset().left + $('.navList').width() / 2;

		(selectedElPos < standardPos ) ? selectedElDir = 'left' : selectedElDir = 'right';
		$.each($('.list li'), function (index, list) {

			var listTop = $(list).offset().top;
			if (listTop >= contentTop && listTop <= contentBottom) {

				if (selectedElDir === 'left') {
					firstContentsIndex = index;
					return false;
				}

				if (selectedElDir === 'right') {
					($(list).parent('ul').children('li').length === 1) ? firstContentsIndex = index : firstContentsIndex = index + 1;
					return false;
				}
			}
		});
		return firstContentsIndex;
	}

	var visibleFirstNavi = function () {
		var naviLeftPosition = $('.indexBtn').offset().left;
		var naviRightPosition = naviLeftPosition + $('.indexBtn').innerWidth();
		var firstQuickIndex = 0;
		$.each($('.indexBtn li'), function (index, list) {
			var listCenterPosition = $(list).offset().left + $(list).innerWidth() / 2;
			if (listCenterPosition > naviLeftPosition && listCenterPosition < naviRightPosition) {
				firstQuickIndex = index;
				return false;
			}
		});
		return firstQuickIndex;
	}

	var visibleLastNavi = function () {
		var naviLeftPosition = $('.indexBtn').offset().left;
		var naviRightPosition = naviLeftPosition + $('.indexBtn').innerWidth();
		var lastQuickIndex = 0;
		$.each($('.indexBtn li'), function (index, list) {
			var listCenterPosition = $(list).offset().left + $(list).innerWidth() / 2;
			if (listCenterPosition > naviLeftPosition && listCenterPosition < naviRightPosition) {
				lastQuickIndex = index;
			}
		});
		return lastQuickIndex;
	}

	var handleQuickArrowBtn = function (scrollMove, scrollWidth, quickAreaWidth) {
		if ($('.indexBtn').hasScrollBar()) {
			if (scrollMove === 0) {
				isQuickLeftArrowOpen = false;
				isQuickRightArrowOpen = true;
				isQuickLeftBtnClick = false;
				if (tvResolution === 'FHD') {
					$(".indexTop .right").css("background-position", "-60px -0px");
					$(".indexTop .left").css("background-position", "0px -120px");
				} else {
					$(".indexTop .right").css("background-position", "-40px -0px");
					$(".indexTop .left").css("background-position", "0px -80px");
				}


				if (isArrowBtnClicked) $('.title').focus();

				return false;

			} else if ((scrollMove + quickAreaWidth) === scrollWidth) {

				isQuickLeftArrowOpen = true;
				isQuickRightArrowOpen = false;
				isQuickRightBtnClick = false;
				if (tvResolution === 'FHD') {
					$(".indexTop .right").css("background-position", "-60px -120px");
					$(".indexTop .left").css("background-position", "0px 0px");
				} else {
					$(".indexTop .right").css("background-position", "-40px -80px");
					$(".indexTop .left").css("background-position", "0px 0px");
				}

				if (isArrowBtnClicked) $('.title').focus();

				return false;

			} else {
				isQuickLeftArrowOpen = true;
				isQuickRightArrowOpen = true;
				if (tvResolution === 'FHD') { 
					$(".indexTop .right").css("background-position", "-60px 0px");
					$(".indexTop .left").css("background-position", "0px 0px");
				} else {
					$(".indexTop .right").css("background-position", "-40px 0px");
					$(".indexTop .left").css("background-position", "0px 0px");
				}

				if (isQuickLeftBtnClick) {
					isQuickLeftBtnClick = false;
					leftQuickBtnFocusOn();

				}

				if (isQuickRightBtnClick) {
					isQuickRightBtnClick = false;
					rightQuickBtnFocusOn();
				}

				return false;
			}
		} else {
			isQuickLeftArrowOpen = false;
			isQuickRightArrowOpen = false;
			if (tvResolution === 'FHD') {
				$(".indexTop .right").css("background-position", "-60px -120px");
				$(".indexTop .left").css("background-position", "0px -120px"); 
			} else {
				$(".indexTop .right").css("background-position", "-40px -80px");
				$(".indexTop .left").css("background-position", "0px -80px");
			}
		}
	}


	if (window.localStorage.getItem("tvResolution") == null) {
		tvResolution = (window.innerWidth >= 1920) ? "FHD" : "HD";
	}
	else {
		tvResolution = window.localStorage.getItem("tvResolution");
	}

	if ($("html").attr("dir") === "rtl") {
		isPageRtl = true;
	}
	else {
		isPageRtl = false;
	}

	$('.scroll-hide').css('display','block');

	initilaFocusCheck();
	initialArrowBtnCheck();
	appendQuickBtn();
	naviBtn.defaultSize = getNaiBtnDefaultSize();
	if (!isPageRtl) handleQuickArrowBtn(0, $('.indexBtn')[0].scrollWidth, $('.indexBtn').innerWidth());
	else handleQuickArrowBtn($('.indexBtn')[0].scrollWidth - $('.indexBtn').innerWidth(), $('.indexBtn')[0].scrollWidth, $('.indexBtn').innerWidth());


	var rightContentSize = $(".index .list ul li a").size();
	var leftMenuSize = $(".lnb ul li a").size();
	var scrollMove = $(".content .list").scrollTop();
	var contentHeight = $('.content .list').innerHeight();
	var scrollHeight = $(".content .list")[0].scrollHeight;
	var detailWrap = $('.detailWrap').height();

	var quickBtnSize = $('.indexBtn').innerHeight();
	
	$(".lnb ul li:nth-child(2) a .point").css("display", "inline-block");

	$.each($('.list li a'), function (index, list) {

		var itemLeft = $(list).offset().left;

		if (itemLeft < 700) {
			var itemHeight = $(this).innerHeight();
			var nextItem = $(list).parent().next();

			if (nextItem != undefined) {
				var nextItemHeight = nextItem.innerHeight();
				var itemGap = itemHeight - nextItemHeight;

				if (itemGap > 0) {
					$(nextItem).css('margin-bottom', parseInt($(list).parent().css('margin-bottom')) + itemGap + 'px');
				}
			}
		}
	});

	var rightUlsize = $(".index .list ul").size();
	$(".index .list ul").eq(rightUlsize - 1).css('margin-bottom', '0px');

	$('.wrap').on("click", function (e) {

		if (arrowBtnClickBlock == true || lnbBtnClickBlock == true || indexBtnClickBlock == true || topBtnClickBlock == true || quickArrowBlock == true || isQickBtnBlock == true) {
			arrowBtnClickBlock = false;
			lnbBtnClickBlock = false;
			indexBtnClickBlock = false;
			topBtnClickBlock = false;
			quickArrowBlock = false;
			isQickBtnBlock = false;
		}
		else {
			$('.title').focus();
		}

	});

	$('.indexTop .left').on('click', function () {
		if (isQuickLeftArrowOpen) {
			isArrowBtnClicked = true;
			quickArrowBlock = true;
			isQuickLeftBtnClick = true;
			if (!isPageRtl) $('.indexBtn').scrollLeft($('.indexBtn').scrollLeft() - quickBtnSize); // ITEM 값으로 변경해야함
			else $('.indexBtn').scrollLeft($('.indexBtn').scrollLeft() - quickBtnSize);
		}
	})
		.on('mouseover', function () {
			if (isQuickLeftArrowOpen) {
				lastMousePosition = 'arrow-left';
				leftQuickBtnFocusOn();
			}
		})
		.on('mouseout', function () {
			if (isQuickLeftArrowOpen) leftQuickBtnFocusOut();
		});
	$('.indexTop .right').on('click', function () {
		if (isQuickRightArrowOpen) {
			isArrowBtnClicked = true;
			quickArrowBlock = true;
			isQuickRightBtnClick = true;

			if (!isPageRtl) $('.indexBtn').scrollLeft($('.indexBtn').scrollLeft() + quickBtnSize); // ITEM 값으로 변경해야함
			else $('.indexBtn').scrollLeft($('.indexBtn').scrollLeft() + quickBtnSize);
		}
	})
		.on('mouseover', function () {
			if (isQuickRightArrowOpen) {
				lastMousePosition = 'arrow-right';
				rightQuickBtnFocusOn();
			}
		})
		.on('mouseout', function () {
			if (isQuickRightArrowOpen) rightQuickBtnFocusOut();

		});

	$('.topBtn').on('click', function () {
		topBtnClickBlock = true;
		rightContentList = 0;

		$(".content .list").scrollTop(0);

		rightContentList = 0;
		$(".list ul li a").eq(rightContentList).focus();

	})
		.on('mouseover', function () {
			$('.topBtn').focus();
		})
		.on('mouseout', function () {
			$('.title').focus();
		})
		.on('keydown', function (e) {
			if (focusHideSetTimeFlag == true) {
				if (e.keyCode == rightKey) {

					if (!isPageRtl) {

						if (arrowDownBtn == false) {
							$(".arrow-up").focus();
						} else{
							$(".arrow-down").focus();
						} 

					} else {
						moveArrowDownToContent();
					}
				} else if (e.keyCode == leftKey) {

					if (!isPageRtl) {
						moveArrowDownToContent();
					} else {
						if (arrowDownBtn == false){
							$(".arrow-up").focus();
						} 
						else if (arrowDownBtn == true){ 
							$(".arrow-down").focus();
						}
					}

				} else if (e.keyCode == upKey) {
					// 어디로 이동해야하는거?
				}
			}
		})
		.on('focusin', function () {
			rememberFocusContentsToQuick = 'topBtn';
			rememberFocusSearchToQuick = 'quickBtn';
			lastMousePosition = 'top';
		});

	$('.indexBtn').on('scroll', function () {

		var scrollMove = $('.indexBtn').scrollLeft();
		var scrollWidth = $('.indexBtn')[0].scrollWidth;
		var quickAreaWidth = $('.indexBtn').innerWidth();

		handleQuickArrowBtn(scrollMove, scrollWidth, quickAreaWidth);

	});

	$('.indexBtn a').on('click', function (e) {
		if(isQickBtnBlock) {
			e.preventDefault();
		} else {
			var clickedIndex = $(this).children().text().trim();
			indexBtnClickBlock = true;

			$('.index .list h3').each(function (indexNum) {
				if (clickedIndex === $(this).text()) {
					var indexTitleHeight = $(this).outerHeight(true);
					focusAndMoveScroll(indexNum, function () {
						var moveAmount = $('.index .list ul:eq(' + indexNum + ')').position().top - indexTitleHeight;
						$(".content .list").scrollTop($(".content .list").scrollTop() + moveAmount);
						console.log("moveAmount" + moveAmount);
					});
				}
			});
		}

	})
	.on('keydown', function (e) {
		isArrowBtnClicked = false;
		if(e.keyCode != enterKey) {e.preventDefault();}
		
		if (focusHideSetTimeFlag == true) {
			if (e.keyCode == rightKey) {
				if (!isPageRtl) {
					quickBtnNum++;

					if ($('.indexBtn a').size() > quickBtnNum) {

						// 이슈     : 중국어에서 li 사이즈가 다름 
						// 수정일   : 2017/11/29
						// 기능내용 : 기본적으로 스크롤 없이 이동하며 마지막일 때 다음 li 사이즈 만큼 스크롤 이동
						if ( naviBtn.isLast ) {
							$('.indexBtn').scrollLeft($('.indexBtn').scrollLeft() + naviBtn.nextSize)
						} 
						$('.indexBtn a').eq(quickBtnNum).focusWithoutScrolling();

					} else {
						quickBtnNum = $('.indexBtn a').size() - 1;
						$('.topBtn').focus();
					}
				} else {
					quickBtnNum--;
					if (quickBtnNum >= 0) {

						// 이슈     : 중국어에서 li 사이즈가 다름 
						// 수정일   : 2017/11/29
						// 기능내용 : 기본적으로 스크롤 없이 이동하며 마지막일 때 다음 li 사이즈 만큼 스크롤 이동 (rtl)
						if ( naviBtn.isLast ) {
							$('.indexBtn').scrollLeft($('.indexBtn').scrollLeft() + naviBtn.nextSize)
						} 
						$('.indexBtn a').eq(quickBtnNum).focusWithoutScrolling();

					} else {
						quickBtnNum = 0;
					}

				}
			} else if (e.keyCode == leftKey) {
				if (!isPageRtl) {
					quickBtnNum--;
					if (quickBtnNum >= 0) {

						// 이슈     : 중국어에서 li 사이즈가 다름 
						// 수정일   : 2017/11/29
						// 기능내용 : 기본적으로 스크롤 없이 이동하며 마지막일 때 다음 li 사이즈 만큼 스크롤 이동
						if ( naviBtn.isFirst ) {
							$('.indexBtn').scrollLeft($('.indexBtn').scrollLeft() - naviBtn.prevSize)
						} 
						$('.indexBtn a').eq(quickBtnNum).focusWithoutScrolling();

					} else {
						quickBtnNum = 0;
						$(".lnb ul li a").eq(leftMenuIndex).focus();
					}
				} else {
					quickBtnNum++;

					if ($('.indexBtn a').size() > quickBtnNum) {

						// 이슈     : 중국어에서 li 사이즈가 다름 
						// 수정일   : 2017/11/29
						// 기능내용 : 기본적으로 스크롤 없이 이동하며 마지막일 때 다음 li 사이즈 만큼 스크롤 이동(rtl)
						if ( naviBtn.isFirst ) {
							$('.indexBtn').scrollLeft($('.indexBtn').scrollLeft() - naviBtn.prevSize)
						} 
						$('.indexBtn a').eq(quickBtnNum).focusWithoutScrolling();

					} else {
						quickBtnNum = $('.indexBtn a').size() - 1;
						$('.topBtn').focus();
					}
				}
			} else if (e.keyCode == upKey) {
				$('.search').focus();
			} else if (e.keyCode == downKey) {
				rightContentList = visibleFirstContents(this);
				$(".list ul li a").eq(rightContentList).focus();
			}
		}
	})
		.on('mouseover', function () {
			$('.indexBtn a').eq($(this).parent().index()).focus();
		})
		.on('mouseout', function () {
			$('.title').focus();
		})
		.on('focusin', function () {
			quickBtnNum = $(this).parent().index();
			rememberFocusMenuToQuick = "quickBtn";
			rememberFocusSearchToQuick = "quickBtn";
			lastMousePosition = 'quick';
			// 이슈   : 중국어에서 li 사이즈가 다름 
			// 수정일 : 2017/11/29
			isBtnLast.call( this );
			isBtnFirst.call( this );
		});

	// 이슈     : 중국어에서 li 사이즈가 다름 
	// 수정일   : 2017/11/29
	// 기능내용 : li 기본사이즈 세팅 (현재 60 or 170)
	function getNaiBtnDefaultSize () {
		return $('#contentindex > div.navWrap > div > div > ul > li:nth-child(1)').innerWidth();
	}

	// 이슈     : 중국어에서 li 사이즈가 다름 
	// 수정일   : 2017/11/29
	// 기능내용 : 버튼이 첫번째 인지 체크 및 이전 li 사이즈 세팅
	function isBtnFirst () {
		let navListLength = $( '.navList' ).innerWidth(),
			navOffsetLeft = $( '.navList' ).offset().left,
			li 			  = $(this).parent();
			prevLi 		  = $(this).parent().prev();


		naviBtn.isFirst =  li.offset().left - navOffsetLeft <= 0 ? true : false;
		if ( prevLi[0] ) {
			naviBtn.prevSize = prevLi.innerWidth();
		}
	}
	// 이슈 : 중국어에서 li 사이즈가 다름 
	// 수정일 : 2017/11/29
	// 기능내용 : 버튼이 마지막인지 체크 및 다음 li 사이즈 세팅
	function isBtnLast () {
		let navListLength = $( '.navList' ).innerWidth(),
			navOffsetLeft = $( '.navList' ).offset().left,
			li 		  	  = $( this ).parent();
			nextLi 		  = $( this ).parent().next();
			
			naviBtn.isLast   = ( li.offset().left + li.innerWidth() ) - navOffsetLeft >= navListLength ? true : false;
			
			if ( nextLi[0] ) { 
					naviBtn.nextSize = nextLi.innerWidth();	
			}
	}
	
	$('.title').on("keydown", function (e) {

		var isBackClicked = false;
		if (e.keyCode === 461) isBackClicked = true;

		focusHideSetTimeFlag = false;
		setTimeout(function () { focusHideSetTimeFlag = true; }, 50);
		if (!isBackClicked) {

			switch (lastMousePosition) {
				case "search":
					$(".search").focus();
					break;

				case "close":
					$(".close").focus();
					break;

				case "lnb":
					$(".lnb ul li a").eq(leftMenuIndex).focus();
					e.preventDefault();
					break;

				case "arrow-up":
					if (arrowUpBtn == true) {
						$(".arrow-up").focus();
					}
					else {
						$(".arrow-down").focus();
					}
					break;

				case "arrow-down":
					if (arrowDownBtn == true) {
						$(".arrow-down").focus();
					}
					else {
						$(".arrow-up").focus();
					}
					break;

				case "list":
					$(".list ul li a").eq(rightContentList).focus();
					e.preventDefault();
					break;

				case "back":
					$(".backBtn a").focus();
					e.preventDefault();
					break;

				case "quick":
					$('.indexBtn a').eq(quickBtnNum).focus();
					isQickBtnBlock = true;
					setTimeout(function() {
						isQickBtnBlock = false;
					},50);
					e.preventDefault();
					break;

				case "top":
					$(".topBtn").focus();
					e.preventDefault();
					break;

				case "arrow-left":
					if (!isPageRtl) {

						quickBtnNum = visibleFirstNavi();
						$('.indexBtn a').eq(quickBtnNum).focus();
						break;
					} else {
						quickBtnNum = visibleLastNavi();
						$('.indexBtn a').eq(quickBtnNum).focus();
						break;
					}

				case "arrow-right":
					if (!isPageRtl) {

						quickBtnNum = visibleLastNavi();
						$('.indexBtn a').eq(quickBtnNum).focus();
						break;
					} else {
						quickBtnNum = visibleFirstNavi();
						$('.indexBtn a').eq(quickBtnNum).focus();
						break;
					}

				default:
					console.log("Nothing!! --> Exception Check!!");
			}
		}
	});

	$(".wrap").mousemove(function (e) {

		mouseOn = true;

	}).on('keydown', function (e) {
		if (e.keyCode == CURSOR_SHOW) {
			$('.title').focus();
		}
	});

	$('.list').on('scroll', function () {

		mouseOn = false;
		$('.scroll-hide').hide();
		$('.scroll-hide').stop(true, true);
		$('.scroll-hide').fadeIn(1500);


		if (arrowBtnOn) {
			if (isArrowUpOrDown == "down") {
				checkArrowDownCss();
			}
			else if (isArrowUpOrDown == "up") {
				checkArrowUpCss();
			}
		}
		else {

			if (!lastListCssControl) {
				checkCssFromScroll();
			}
			else {
				lastListCssControl = false;

				if (lastListCssControlExceptScroll) {
					lastListCssControlExceptScroll = false;

					arrowUpBtn = true;
					arrowDownBtn = false;

					if (tvResolution == "FHD") {
						$(".arrow-up").css("background-position", "0px 0px");
						$(".arrow-down").css("background-position", "-120px -60px");
					}
					else {
						$(".arrow-up").css("background-position", "0px 0px");
						$(".arrow-down").css("background-position", "-80px -40px");
					}
				}

			}
		}
	});

	$('.index .list').on('mousewheel', function () {
		mouseOn = false;
		keyDownOn = false;
		lastListCssControlExceptScroll = true;
		$('.title').focus();

	});

	$('.backBtn a').on('keydown', function (e) {

		if (focusHideSetTimeFlag == true) {
			if (e.keyCode == rightKey) {
				if (sayBackBtnWhereFrom == "body") {
					$(".lnb ul li a").eq(leftMenuIndex).focus();
				}
				else if (sayBackBtnWhereFrom == "header") {
					if (isPageRtl) {
						$(".close").focus();
					}
					else {
						$(".search").focus();
					}
				}
				else {
					$(".lnb ul li a").eq(leftMenuIndex).focus();
				}
			}
			if (e.keyCode == enterKey) {
				backProcess(); // common.js
			}
		}

	}).mouseover(function () {

		lastMousePosition = "back";
		$(".backBtn a").focus();

	}).mouseout(function () {

		$('.title').focus();

	}).focusin(function () {
		lastMousePosition = "back";
	});

	$(".lnb ul li").on("keydown", function (e) {

		lnbBtnOn = true;
		sayBackBtnWhereFrom = "body";

		if (focusHideSetTimeFlag == true) {
			if (e.keyCode == upKey) {
				leftMenuIndex = $(this).index();

				if (leftMenuIndex == 0) {
					$(".search").focus();
				}
				else {
					leftMenuIndex--;
					$(".lnb ul li a").eq(leftMenuIndex).focus();
				}
			}
			else if (e.keyCode == downKey) {
				leftMenuIndex = $(this).index();

				if (leftMenuIndex < leftMenuSize - 1) {
					leftMenuIndex++;
					$(".lnb ul li a").eq(leftMenuIndex).focus();
				}
			}
			else if (e.keyCode == rightKey) {
				e.preventDefault(); // 고도화 
				if (isPageRtl) {
					if (arrowUpBtn) {
						$(".arrow-up").focus();
					}
					else {
						$(".arrow-down").focus();
					}
				}
				else {
					if (moveMenuToQuickBtn) {
						$('.indexBtn a').eq(quickBtnNum).focus();
						moveMenuToQuickBtn = false;
					} else {
						if (rememberFocusMenuToQuick === 'indexListBtn') {
							$(".list ul li a").eq(rightContentList).focus();
						} else if (rememberFocusMenuToQuick === 'quickBtn') {
							$('.indexBtn a').eq(quickBtnNum).focus();
						}
					}
				}

			}
			else if (e.keyCode == leftKey) {
				$('.backBtn a').focus();
			}
			else if (e.keyCode == enterKey) {
				var tmp = $(this).children('a').attr("href");
				lnbBtnClickBlock = true;
				selectPageAccess(tmp, "x");
			}
		}

	}).mouseover(function () {

		lastMousePosition = "lnb";
		sayBackBtnWhereFrom = "body";
		leftMenuIndex = $(".lnb ul li").index(this);
		$(".lnb ul li a").eq(leftMenuIndex).focus();

	}).mouseout(function () {

		$('.title').focus();

	}).on('focusin', function () {

		window.localStorage.setItem("seeAllPageAccessException", "true");
		lastMousePosition = "lnb";
		sayBackBtnWhereFrom = "body";
		rememberFocusSearchToQuick = 'menuBtn';

	}).on('focusout', function () {

		window.localStorage.setItem("seeAllPageAccessException", "false");

	}).on('click', function () {

		var tmp = $(this).children('a').attr("href");
		lnbBtnClickBlock = true;
		selectPageAccess(tmp, "x");

	});


	$(".list ul li").on("keydown", function (e) {

		e.preventDefault();
		lastListCssControl = false;
		keyDownOn = true;
		mouseOn = false;
		var offset = $(this).offset().top;
		var currentList = $(this).index();
		var focusedList = $(".list ul li").index(this);
		var sizeOfList = $(this).parent().children("li").size();
		var nextLiSize = $(e.target).parents('ul').next().next().children('li').length;
		var preLiSize = $(e.target).parents('ul').prev().prev().children('li').length;

		if (focusHideSetTimeFlag == true) {
			if (e.keyCode == upKey) {
				keyBtnCase = "upkey";

				if (currentList % 2 == 0) {

					if (rightContentList == 0) {
						arrowUpBtn = false;

						if (tvResolution == "FHD") {
							$(".arrow-up").css("background-position", "-120px 0px");
						}
						else {
							$(".arrow-up").css("background-position", "-80px 0px");
						}

						keyDownOn = false;
						$(".list").scrollTop(0);
						$('.indexBtn a').eq(quickBtnNum).focus(); // 고도화

					}
					else {
						if (currentList == 0) {
							if (preLiSize % 2 == 0) {
								var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
								var contentHeight = $(".content .list").height();
								var contentBottom = contentTop + contentHeight;
								var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
								var firstIndex = 0;

								rightContentList = rightContentList - 2;

								$.each($('.list li'), function (index, list) {

									var listTop = $(list).offset().top;

									if (listTop >= contentTop && listTop <= contentBottom) {
										firstIndex = index;
										return false;
									}
								});

								if (rightContentList == firstIndex - 2) {
									$(".list ul li a").eq(rightContentList).focus();
									$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(true);
								}
								else {
									$(".list ul li a").eq(rightContentList).focus();
									e.preventDefault();
								}
							}
							else {
								var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
								var contentHeight = $(".content .list").height();
								var contentBottom = contentTop + contentHeight; // 1060
								var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
								var firstIndex = 0;

								rightContentList = rightContentList - 1;

								$.each($('.list li'), function (index, list) {

									var listTop = $(list).offset().top;

									if (listTop >= contentTop && listTop <= contentBottom) {
										firstIndex = index;
										return false;
									}
								});

								if (rightContentList == firstIndex - 1) {
									$(".list ul li a").eq(rightContentList).focus();
									$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(true);

								}
								else {
									$(".list ul li a").eq(rightContentList).focus();
									e.preventDefault();
								}
							}
						}
						else {
							var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
							var contentHeight = $(".content .list").height();
							var contentBottom = contentTop + contentHeight; // 1060
							var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
							var firstIndex = 0;

							rightContentList = rightContentList - 2;

							$.each($('.list li'), function (index, list) {

								var listTop = $(list).offset().top;

								if (listTop >= contentTop && listTop <= contentBottom) {
									firstIndex = index;
									return false;
								}

							});

							if (rightContentList == firstIndex - 2) {
								$(".list ul li a").eq(rightContentList).focus();
								$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(true);
							}
							else {
								$(".list ul li a").eq(rightContentList).focus();
								e.preventDefault();
							}
						}
					}
				}
				else {
					if (rightContentList == 1) {
						arrowUpBtn = false;

						if (tvResolution == "FHD") {
							$(".arrow-up").css("background-position", "-120px 0px");
						}
						else {
							$(".arrow-up").css("background-position", "-80px 0px");
						}

						keyDownOn = false;
						$(".list").scrollTop(0);
						$('.indexBtn a').eq(quickBtnNum).focus();

					}
					else {
						if (currentList == 1) {
							if (preLiSize % 2 == 0) {
								var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
								var contentHeight = $(".content .list").height();
								var contentBottom = contentTop + contentHeight; // 1060
								var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
								var firstIndex = 0;

								rightContentList = rightContentList - 2;

								$.each($('.list li'), function (index, list) {

									var listTop = $(list).offset().top;

									if (listTop >= contentTop && listTop <= contentBottom) {
										firstIndex = index;
										return false;
									}
								});

								if (rightContentList == firstIndex - 1) {
									$(".list ul li a").eq(rightContentList).focus();
									$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(true);
								}
								else {
									$(".list ul li a").eq(rightContentList).focus();
									e.preventDefault();
								}
							}
							else if (preLiSize % 2 != 0) {
								if (preLiSize == 1) {
									var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
									var contentHeight = $(".content .list").height();
									var contentBottom = contentTop + contentHeight; // 1060
									var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
									var firstIndex = 0;

									rightContentList = rightContentList - 2;

									$.each($('.list li'), function (index, list) {

										var listTop = $(list).offset().top;

										if (listTop >= contentTop && listTop <= contentBottom) {
											firstIndex = index;
											return false;
										}
									});

									if (rightContentList == firstIndex - 1) {
										$(".list ul li a").eq(rightContentList).focus();
										$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(true);
									}
									else {
										$(".list ul li a").eq(rightContentList).focus();
										e.preventDefault();
									}
								}
								else {
									var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
									var contentHeight = $(".content .list").height();
									var contentBottom = contentTop + contentHeight; // 1060
									var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
									var firstIndex = 0;

									rightContentList = rightContentList - 3;

									$.each($('.list li'), function (index, list) {

										var listTop = $(list).offset().top;

										if (listTop >= contentTop && listTop <= contentBottom) {
											firstIndex = index;
											return false;
										}
									});

									if (rightContentList == firstIndex - 2) {
										$(".list ul li a").eq(rightContentList).focus();
										$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(true);
									}
									else {
										$(".list ul li a").eq(rightContentList).focus();
										e.preventDefault();
									}
								}
							}
						}
						else {
							var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
							var contentHeight = $(".content .list").height();
							var contentBottom = contentTop + contentHeight; // 1060
							var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
							var firstIndex = 0;

							rightContentList = rightContentList - 2;

							$.each($('.list li'), function (index, list) {

								var listTop = $(list).offset().top;

								if (listTop >= contentTop && listTop <= contentBottom) {
									firstIndex = index;
									return false;
								}
							});

							if (rightContentList == firstIndex - 1) {
								$(".list ul li a").eq(rightContentList).focus();
								$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(true);
							}
							else {
								$(".list ul li a").eq(rightContentList).focus();
								e.preventDefault();
							}
						}
					}
				}
			}
			else if (e.keyCode == downKey) {
				keyBtnCase = "downkey";
				if (sizeOfList % 2 == 0) {
					if (currentList % 2 == 0) {
						if (rightContentList != rightContentSize - 2) {
							var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
							var contentHeight = $(".content .list").height();
							var contentBottom = contentTop + contentHeight; // 1060
							var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
							var lastIndex = 0;

							rightContentList = rightContentList + 2;

							$.each($('.list li'), function (index, list) {

								var listTop = $(list).offset().top;
								if (listTop >= contentTop && listTop <= contentBottom) {
									lastIndex = index;
								}
							});

							if (rightContentList == lastIndex + 1) {
								
								$(".list ul li a").eq(rightContentList).focus();
								$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(false);
							}
							else {
								$(".list ul li a").eq(rightContentList).focus();
								e.preventDefault();
							}
						}
						else {
							console.log("No More ! ");
						}
					}
					else {

						if (rightContentList != rightContentSize - 1) {
							if (nextLiSize == 1 && currentList == sizeOfList - 1) {
								var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
								var contentHeight = $(".content .list").height();
								var contentBottom = contentTop + contentHeight;
								var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
								var lastIndex = 0;

								rightContentList = rightContentList + 1;

								$.each($('.list li'), function (index, list) {

									var listTop = $(list).offset().top;

									if (listTop >= contentTop && listTop <= contentBottom) {
										lastIndex = index;
									}
								});

								if (rightContentList == lastIndex + 1) {
									$(".list ul li a").eq(rightContentList).focus();
									$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(false);
								}
								else {
									$(".list ul li a").eq(rightContentList).focus();
									e.preventDefault();
								}
							}
							else {
								var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
								var contentHeight = $(".content .list").height();
								var contentBottom = contentTop + contentHeight; // 1060
								var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
								var lastIndex = 0;

								rightContentList = rightContentList + 2;

								$.each($('.list li'), function (index, list) {

									var listTop = $(list).offset().top;
									if (listTop >= contentTop && listTop <= contentBottom) {
										lastIndex = index;
									}
								});
								if (rightContentList == lastIndex + 2) {

									$(".list ul li a").eq(rightContentList).focus();
									$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(false);

								}
								else {
									$(".list ul li a").eq(rightContentList).focus();
									e.preventDefault();
								}
							}
						}
						else {
							console.log(" No More ++");
						}
					}
				}
				else {
					if (currentList % 2 == 0) {
						if (rightContentList != rightContentSize - 1) {
							if (currentList == sizeOfList - 1) {
								var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
								var contentHeight = $(".content .list").height();
								var contentBottom = contentTop + contentHeight; // 1060
								var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
								var lastIndex = 0;

								rightContentList = rightContentList + 1;

								$.each($('.list li'), function (index, list) {

									var listTop = $(list).offset().top;

									if (listTop >= contentTop && listTop <= contentBottom) {
										lastIndex = index;
									}
								});

								if (rightContentList == lastIndex + 1) {
									$(".list ul li a").eq(rightContentList).focus();
									$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(false);
								}
								else {
									$(".list ul li a").eq(rightContentList).focus();
									e.preventDefault();
								}
							}
							else {
								var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
								var contentHeight = $(".content .list").height();
								var contentBottom = contentTop + contentHeight; // 1060
								var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
								var lastIndex = 0;

								rightContentList = rightContentList + 2;

								$.each($('.list li'), function (index, list) {

									var listTop = $(list).offset().top;
									if (listTop >= contentTop && listTop <= contentBottom) {
										lastIndex = index;
									}
								});

								if (rightContentList == lastIndex + 1) {
									$(".list ul li a").eq(rightContentList).focus();
									$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(false);
								}
								else {
									$(".list ul li a").eq(rightContentList).focus();
									e.preventDefault();
								}
							}
						}
						else {
							console.log("No More ++");
						}
					}
					else {
						if (rightContentList != rightContentSize - 2) {
							if (currentList == sizeOfList - 2) {
								if (nextLiSize == 1) {
									var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
									var contentHeight = $(".content .list").height();
									var contentBottom = contentTop + contentHeight;
									var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
									var lastIndex = 0;

									rightContentList = rightContentList + 2;

									$.each($('.list li'), function (index, list) {

										var listTop = $(list).offset().top;
										if (listTop >= contentTop && listTop <= contentBottom) {
											lastIndex = index;
										}
									});

									if (rightContentList == lastIndex + 2) {
										$(".list ul li a").eq(rightContentList).focus();
										$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(false);
									}
									else {
										$(".list ul li a").eq(rightContentList).focus();
										e.preventDefault();
									}

								}
								else {
									var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
									var contentHeight = $(".content .list").height();
									var contentBottom = contentTop + contentHeight;
									var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
									var lastIndex = 0;

									rightContentList = rightContentList + 3;

									$.each($('.list li'), function (index, list) {

										var listTop = $(list).offset().top;
										if (listTop >= contentTop && listTop <= contentBottom) {

											lastIndex = index;
										}
									});

									if (rightContentList == lastIndex + 3) {
										$(".list ul li a").eq(rightContentList).focus();
										$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(false);
									}
									else {
										$(".list ul li a").eq(rightContentList).focus();
										e.preventDefault();
									}
								}
							}
							else {

								var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
								var contentHeight = $(".content .list").height();
								var contentBottom = contentTop + contentHeight;
								var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
								var lastIndex = 0;

								rightContentList = rightContentList + 2;

								$.each($('.list li'), function (index, list) {

									var listTop = $(list).offset().top;
									if (listTop >= contentTop && listTop <= contentBottom) {
										lastIndex = index;
									}
								});

								if (rightContentList == lastIndex + 2) {
									$(".list ul li a").eq(rightContentList).focus();
									$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(false);
								}
								else {
									$(".list ul li a").eq(rightContentList).focus();
									e.preventDefault();
								}
							}
						}
						else {
							var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
							var contentHeight = $(".content .list").height();
							var contentBottom = contentTop + contentHeight; // 1060
							var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
							var lastIndex = 0;

							rightContentList = rightContentList + 1;

							$.each($('.list li'), function (index, list) {

								var listTop = $(list).offset().top;

								if (listTop >= contentTop && listTop <= contentBottom) {
									lastIndex = index;
								}
							});

							if (rightContentList == lastIndex + 1) {
								$(".list ul li a").eq(rightContentList).focus();
								$(".list ul li a").eq(rightContentList).get(0).scrollIntoView(false);
							}
							else {
								$(".list ul li a").eq(rightContentList).focus();
								e.preventDefault();
							}
						}
					}
				}
			}
			else if (e.keyCode == rightKey) {
				if (isPageRtl) {
					if (currentList % 2 != 0) {
						rightContentList--;
						$(".list ul li a").eq(rightContentList).focus();
					}
				}
				else {
					if (currentList % 2 == 0) {
						if (sizeOfList % 2 == 0) {
							rightContentList++;
							$(".list ul li a").eq(rightContentList).focus();
						}
						else {
							if (currentList == sizeOfList - 1) {

								$('.topBtn').focus();
							}
							else {
								rightContentList++;
								$(".list ul li a").eq(rightContentList).focus();
							}
						}
					}
					else {

						$('.topBtn').focus();
					}
				}
			}
			else if (e.keyCode == leftKey) {
				if (isPageRtl) {
					if (currentList % 2 == 0) {

						if (sizeOfList % 2 == 0) {
							rightContentList++;
							$(".list ul li a").eq(rightContentList).focus();
						}
						else {
							if (currentList == sizeOfList - 1) {
								if (offset < detailWrap / 2) {

									
									if (arrowUpBtn == false) {
										$(".arrow-down").focus();

									}
									else if (arrowUpBtn == true) {
										$(".arrow-up").focus();
									}
								}
								else {
									$('.topBtn').focus();
								}
							}
							else {
								rightContentList++;
								$(".list ul li a").eq(rightContentList).focus();
							}
						}
					}
					else {
							$('.topBtn').focus();
					}
				}
				else {
					if (currentList % 2 == 0) {
						$(".lnb ul li a").eq(leftMenuIndex).focus();
					}
					else {
						rightContentList--;
						$(".list ul li a").eq(rightContentList).focus();
					}
				}
			}
			else if (e.keyCode == enterKey) {
				var pageLink = $(this).children("a").attr("data-navi");
				var focusIndexValue = $(".list ul li").index(this);
				var focusTextValue = $(this).text();
				var prevFocusInfo = focusIndexValue + "^" + focusTextValue;
				var iFrameLink = $(this).children("a").attr("data-link");

				window.localStorage.setItem("forJinA", iFrameLink);

				setRecentlyItem(iFrameLink);
				selectPageAccess(pageLink, prevFocusInfo);
				detailPageAccess(pageLink, iFrameLink);
			}
		}
	}).mousemove(function () {

		lastMousePosition = "list";
		sayBackBtnWhereFrom = "body";
		if (mouseOn == true) {
			rightContentList = $(".list ul li").index(this);
			$(".list li a").eq(rightContentList).focus();
		}

	}).mouseout(function () {

		if (mouseOn == true) {
			rightContentList = $(".list ul li").index(this);
			$('.title').focus();
		}

	}).focusin(function () {
		rememberFocusMenuToQuick = "indexListBtn";
		rememberFocusContentsToQuick = 'indexListBtn';
		lastMousePosition = "list";
		sayBackBtnWhereFrom = "body";
		var focusedList = $(".list ul li").index(this);
		var lastListSize = $(".index .list ul").eq(rightUlsize - 1).children().size();

		rightContentList = $(".list ul li").index(this);

		if (lastListSize % 2 == 0) {
			if (focusedList == rightContentSize - 1 || focusedList == rightContentSize - 2) {
				event.preventDefault();
				arrowDownBtn = false;
				lastListCssControl = true;

				if (tvResolution == "FHD") {
					$(".arrow-down").css("background-position", "-120px -60px");
				}
				else {
					$(".arrow-down").css("background-position", "-80px -40px");
				}
			}
		}

		else if (lastListSize % 2 != 0) {

			if (focusedList == rightContentSize - 1) {
				lastListCssControl = true;
				arrowDownBtn = false;

				if (tvResolution == "FHD") {
					$(".arrow-down").css("background-position", "-120px -60px");
				}
				else {
					$(".arrow-down").css("background-position", "-80px -40px");
				}
			}
		}
	}).on("click", function () {

		var pageLink = $(this).children("a").attr("data-navi");
		var focusIndexValue = $(".list ul li").index(this);
		var focusTextValue = $(this).text();
		var prevFocusInfo = focusIndexValue + "^" + focusTextValue;
		var iFrameLink = $(this).children("a").attr("data-link");

		window.localStorage.setItem("forJinA", iFrameLink);

		setRecentlyItem(iFrameLink);
		selectPageAccess(pageLink, prevFocusInfo);
		detailPageAccess(pageLink, iFrameLink);

	});

	$(".arrow-up").on("keydown", function (e) {

		keyDownOn = false;
		mouseOn = false;

		if (focusHideSetTimeFlag == true) {

			if (e.keyCode == leftKey) {
				if (isPageRtl) {
					$(".lnb ul li a").eq(leftMenuIndex).focus();
				}
				else {
					$('.topBtn').focus();
				}
			}
			else if (e.keyCode == rightKey) {
				if (isPageRtl) {
					$('.topBtn').focus();
				}
			}
			else if (e.keyCode == upKey) {
				$(".search").focus();
			}
			else if (e.keyCode == downKey) {
				if (arrowDownBtn == false) {
					$(".arrow-up").focus();
				}
				else if (arrowDownBtn == true) {
					$(".arrow-down").focus();
				}
			}
			else if (e.keyCode == enterKey) {
				arrowCssControl = false;
				scroll_flag = true;
				arrowBtnOn = true;
				arrowMouseDownOn = false;
				isArrowUpOrDown = "up";

				var scrollMove = $(".list").scrollTop();

				if (scrollMove <= 0) {
					arrowUpBtn = false;

					if (tvResolution == "FHD") {
						$(".arrow-up").css("background-position", "-120px 0px");
					}
					else {
						$(".arrow-up").css("background-position", "-80px 0px");
					}

					$(".arrow-down").focus();
					isEnterKeyPressed = "yes";

				}
				else {
					if (isEnterKeyPressed === "yes") {
						console.log("When Enter key is pressed, Focus move ===> Do not working");
					}
					else {
						arrowUpBtn = true;
						arrowDownBtn = true;

						if (tvResolution == "FHD") {

							$(".arrow-down").css("background-position", "0px -60px");
							$(".arrow-up").css("background-position", "-60px 0px");
						}
						else {
							$(".arrow-down").css("background-position", "0px -40px");
							$(".arrow-up").css("background-position", "-40px 0px");
						}
						
						$(".content .list").scrollTop($(".content .list").scrollTop() - ITEM_HEIGHT);

					}
				}
			}
		}
	}).mousemove(function () {

		arrowCssControl = false;

		if (mouseOn == true) {
			if (arrowUpBtn == true) {
				lastMousePosition = "arrow-up";
				sayBackBtnWhereFrom = "body";
				$(".arrow-up").focus();
			}
		}

	}).mouseout(function () {

		arrowCssControl = true;
		$('.title').focus();

	}).mousedown(function () {

		if (arrowUpBtn == true) {
			arrowBtnOn = true;
			isArrowUpOrDown = "up";
			arrowMouseDownOn = true;
			timerId = setInterval(function () {

				var scrollMove = $(".content .list").scrollTop();
				$(".content .list").scrollTop($(".content .list").scrollTop() - ITEM_HEIGHT);

			}, SCROLL_INTERVAL_TIME);
		}
		else {
			lastMousePosition = "arrow-up";
			$('.title').focus();
		}

	}).mouseup(function () {
		
		clearInterval(timerId);

	}).focusin(function () {
		lastMousePosition = "arrow-up";
		sayBackBtnWhereFrom = "body";
		rememberFocusSearchToQuick = 'quickBtn';
		if (arrowUpBtn == true) {
			arrowBtnOn = true;

			if (tvResolution == "FHD") {
				$(".arrow-up").css("background-position", "-60px 0");
			}
			else {
				$(".arrow-up").css("background-position", "-40px 0");
			}
		}
		else {
			lastMousePosition = "arrow-up";
			$('.title').focus();
		}

	}).focusout(function () {

		arrowBtnOn = false;
		clearInterval(timerId);

		if (arrowUpBtn == false) {
			if (tvResolution == "FHD") {
				$(".arrow-up").css("background-position", "-120px 0px");
			}
			else {
				$(".arrow-up").css("background-position", "-80px 0px");
			}
		}
		else if (arrowUpBtn == true) {
			$(".arrow-up").css("background-position", "0 0");
		}

	}).on('click', function () {

		arrowBtnClickBlock = true;

	}).on('keyup', function (e) {

		arrowBtnOn = false;

		if (isEnterKeyPressed == "yes") {
			isEnterKeyPressed = "no";
		}

	});

	$(".arrow-down").on("keydown", function (e) {

		keyDownOn = false;
		mouseOn = false;

		if (focusHideSetTimeFlag == true) {
			if (e.keyCode == leftKey) {
				if (isPageRtl) {
					$(".lnb ul li a").eq(leftMenuIndex).focus();
				}
				else {
					$('.topBtn').focus();
				}
			}
			else if (e.keyCode == rightKey) {
				if (isPageRtl) {
					$('.topBtn').focus();
				}
			}
			else if (e.keyCode == upKey) {
				if (arrowUpBtn == false) {
					$(".search").focus();
				}
				else if (arrowUpBtn == true) {
					$(".arrow-up").focus();
				}
			}
			else if (e.keyCode == enterKey) {
				arrowCssControl = false;
				scroll_flag = true;
				arrowBtnOn = true;
				isArrowUpOrDown = "down";
				arrowMouseDownOn = false;

				var scrollMove = $(".list").scrollTop();
				var contentHeight = $(".list").innerHeight();
				var scrollHeight = $(".list")[0].scrollHeight;

				if (scrollMove + contentHeight >= scrollHeight) {
					arrowDownBtn = false;

					if (tvResolution == "FHD") {
						$(".arrow-down").css("background-position", "-120px -60px");
					}
					else {
						$(".arrow-down").css("background-position", "-80px -40px");
					}

					$(".arrow-up").focus();
					isEnterKeyPressed = "yes";

				}
				else {
					if (isEnterKeyPressed == "yes") {

					}
					else {
						arrowDownBtn = true;
						arrowUpBtn = true;

						$(".content .list").scrollTop($(".content .list").scrollTop() + ITEM_HEIGHT);


						if (tvResolution == "FHD") {
							$(".arrow-up").css("background-position", "0px 0px");
							$(".arrow-down").css("background-position", "-60px -60px");
						}
						else {
							$(".arrow-up").css("background-position", "0px 0px");
							$(".arrow-down").css("background-position", "-40px -40px");
						}
					}
				}
			}
		}
	}).mousemove(function () {

		arrowCssControl = false;

		if (mouseOn == true) {
			if (arrowDownBtn == true) {
				lastMousePosition = "arrow-down";
				sayBackBtnWhereFrom = "body";

				if (tvResolution == "FHD") {
					$(".arrow-down").css("background-position", "-120px -60px");
				}
				else {
					$(".arrow-down").css("background-position", "-80px -40px");
				}

				$(".arrow-down").focus();

			}

		}
	}).mouseout(function () {

		arrowCssControl = true;
		$('.title').focus();

	}).mousedown(function () {
		if (arrowDownBtn == true) {
			arrowBtnOn = true;
			isArrowUpOrDown = "down";
			arrowMouseDownOn = true;
			timerId = setInterval(function () {

				$(".content .list").scrollTop($(".content .list").scrollTop() + ITEM_HEIGHT);

			}, SCROLL_INTERVAL_TIME);
		}
		else {
			lastMousePosition = "arrow-down";
			$('.title').focus();
		}

	}).mouseup(function () {
		clearInterval(timerId);
	}).focusin(function () {
		lastMousePosition = "arrow-down";
		sayBackBtnWhereFrom = "body";
		rememberFocusSearchToQuick = 'quickBtn';

		if (arrowDownBtn == true) {
			arrowBtnOn = true;

			if (tvResolution == "FHD") {
				$(".arrow-down").css("background-position", "-60px -60px");
			}
			else {
				$(".arrow-down").css("background-position", "-40px -40px");
			}
		}
		else {
			lastMousePosition = "arrow-down";
			$('.title').focus();
		}
	}).focusout(function () {

		arrowBtnOn = false;
		clearInterval(timerId);

		if (arrowDownBtn == false) {
			if (tvResolution == "FHD") {
				$(".arrow-down").css("background-position", "-120px -60px");
			}
			else {
				$(".arrow-down").css("background-position", "-80px -40px");
			}
		}
		else if (arrowDownBtn == true) {
			if (tvResolution == "FHD") {
				$(".arrow-down").css("background-position", "0px -60px");
			}
			else {
				$(".arrow-down").css("background-position", "0px -40px");
			}
		}
	}).on('click', function () {

		arrowBtnClickBlock = true;

	}).on('keyup', function (e) {

		arrowBtnOn = false;
		if (isEnterKeyPressed == "yes") {
			isEnterKeyPressed = "no";
		}
	});
});

function initialArrowBtnCheck() {

	var scrollMove = $(".content .list").scrollTop();
	var contentHeight = $('.content .list').innerHeight();
	var scrollHeight = $(".content .list")[0].scrollHeight;

	if (scrollMove <= 0) {
		arrowUpBtn = false;
		arrowDownBtn = true;

		if (tvResolution == "FHD") {
			$(".arrow-up").css("background-position", "-120px 0px");
		}
		else {
			$(".arrow-up").css("background-position", "-80px 0px");
		}
	}
	else if (scrollMove + contentHeight >= scrollHeight) {
		arrowUpBtn = true;
		arrowDownBtn = false;

		if (tvResolution == "FHD") {
			$(".arrow-down").css("background-position", "-120px -60px");
		}
		else {
			$(".arrow-down").css("background-position", "-80px -40px");
		}
	}
	else {
		arrowUpBtn = true;
		arrowDownBtn = true;

		if (tvResolution == "FHD") {
			$(".arrow-up").css("background-position", "0px 0px");
			$(".arrow-down").css("background-position", "0px -60px");

		}
		else {
			$(".arrow-up").css("background-position", "0px 0px");
			$(".arrow-down").css("background-position", "0px -40px");
		}
	}
}

function moveArrowDownToContent() {
	var contentTop = $(".content .list").offset().top;
	var contentHeight = $(".content .list").height();
	var contentBottom = contentTop + contentHeight;
	var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
	var lastIndex = 0;

	$.each($('.list li'), function (index, list) {

		var listTop = $(list).offset().top;

		if (listTop >= contentTop && listTop <= contentBottom - listMargin) {
			lastIndex = index;
		}
	});

	rightContentList = lastIndex;
	$(".list ul li a").eq(rightContentList).focus();

}

function initilaFocusCheck() {

	var initialFocusInfo;

	if (window.localStorage.getItem("prevFocusInfo") == null) {
		initialFocusInfo = "x";
	}
	else {
		initialFocusInfo = window.localStorage.getItem("prevFocusInfo").split("^")[0];
	}


		if (initialFocusInfo == "x") {
			$(".title").focus();
			lastMousePosition = "lnb";
		}
		else {
			if (initialFocusInfo == "search") {
				lastMousePosition = "search";
				$(".title").focus();
			}
			else {
				rightContentList = Number(initialFocusInfo);
				lastMousePosition = "list";
				$(".list ul li a").eq(rightContentList).focus();
				$(".title").focus();
			}
		}

		window.localStorage.setItem("prevFocusInfo", "x");

}

function moveArrowUpToContent() {
	var contentTop = $(".content .list").offset().top - $(".content .list li a").height();
	var contentHeight = $(".content .list").height();
	var contentBottom = contentTop + contentHeight;
	var listMargin = $(".content .list li").outerHeight(true) - $(".content .list li").height();
	var firstIndex = 0;

	$.each($('.list li'), function (index, list) {

		var listTop = $(list).offset().top;
		var listSize = $(list).parent().children("li").size();

		if (listTop >= contentTop && listTop <= contentBottom - listMargin) {
			if (listSize > 1) {
				firstIndex = index + 1;
				return false;
			}
			else {
				firstIndex = index;
				return false;
			}
		}
	});

	rightContentList = firstIndex;
	$(".list ul li a").eq(rightContentList).focus();

}

function checkArrowDownCss() {
	arrowBtnOn = true;
	var scrollMove = $(".content .list").scrollTop();
	var contentHeight = $('.content .list').innerHeight();
	var scrollHeight = $(".content .list")[0].scrollHeight;
	var listUlMargin = $(".content .list ul li").outerHeight(true) - $(".content .list ul li").outerHeight();

	if (scrollMove + contentHeight >= scrollHeight - listUlMargin) {
		arrowDownBtn = false;
		$(".content .list").scrollTop(scrollHeight);

		if (arrowMouseDownOn) {
			$(".title").focus();
			if (tvResolution == "FHD") {
				$(".arrow-down").css("background-position", "-120px -60px");
			}
			else {
				$(".arrow-down").css("background-position", "-80px -40px");
			}
		}
		else {
			$(".arrow-up").focus();

			if (tvResolution == "FHD") {
				$(".arrow-up").css("background-position", "-60px 0px");
				$(".arrow-down").css("background-position", "-120px -60px");
			}
			else {
				$(".arrow-up").css("background-position", "-40px 0px");
				$(".arrow-down").css("background-position", "-80px -40px");
			}
		}

		isEnterKeyPressed = "yes";

	}
	else {
		arrowDownBtn = true;
		arrowUpBtn = true;

		if (tvResolution == "FHD") {
			$(".arrow-up").css("background-position", "0px 0px");
			$(".arrow-down").css("background-position", "-60px -60px");
		}
		else {
			$(".arrow-up").css("background-position", "0px 0px");
			$(".arrow-down").css("background-position", "-40px -40px");
		}
	}
}

function checkArrowUpCss() {

	scroll_flag = true;
	arrowBtnOn = true;
	var scrollMove = $(".content .list").scrollTop();
	if (scrollMove <= 0) {
		arrowUpBtn = false;

		if (arrowMouseDownOn) {
			$(".title").focus();

			if (tvResolution == "FHD") {
				$(".arrow-up").css("background-position", "-120px 0px");
			}
			else {
				$(".arrow-up").css("background-position", "-80px 0px");
			}
		}
		else {
			$(".arrow-down").focus();

			if (tvResolution == "FHD") {
				$(".arrow-up").css("background-position", "-120px 0px");
				$(".arrow-down").css("background-position", "-60px -60px");
			}
			else {
				$(".arrow-up").css("background-position", "0px 0px");
				$(".arrow-down").css("background-position", "-40px -40px");
			}
		}

		isEnterKeyPressed = "yes";

	}
	else {
		arrowUpBtn = true;
		arrowDownBtn = true;

		if (tvResolution == "FHD") {
			$(".arrow-down").css("background-position", "0px -60px");
		}
		else {
			$(".arrow-down").css("background-position", "0px -40px");
		}
	}
}


function checkCssFromScroll() {

	var scrollMove = $(".content .list").scrollTop();
	var contentHeight = $('.content .list').innerHeight();
	var scrollHeight = $(".content .list")[0].scrollHeight;
	if (scrollMove <= 0) {
		arrowUpBtn = false;
		arrowDownBtn = true;

		if (tvResolution == "FHD") {
			$(".arrow-up").css("background-position", "-120px 0px");
			$(".arrow-down").css("background-position", "-0px -60px");
		}
		else {
			$(".arrow-up").css("background-position", "-80px 0px");
			$(".arrow-down").css("background-position", "-0px -40px");
		}
	}
	else if (scrollMove + contentHeight >= scrollHeight) {
		arrowUpBtn = true;
		arrowDownBtn = false;

		if (tvResolution == "FHD") {
			$(".arrow-up").css("background-position", "0px 0px");
			$(".arrow-down").css("background-position", "-120px -60px");
		}
		else {
			$(".arrow-up").css("background-position", "0px 0px");
			$(".arrow-down").css("background-position", "-80px -40px");
		}
	}
	else {
		arrowUpBtn = true;
		arrowDownBtn = true;

		if (tvResolution == "FHD") {
			$(".arrow-up").css("background-position", "0px 0px");
			$(".arrow-down").css("background-position", "0px -60px");
		}
		else {
			$(".arrow-up").css("background-position", "0px 0px");
			$(".arrow-down").css("background-position", "0px -40px");
		}
	}
}