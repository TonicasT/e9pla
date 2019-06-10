var iframeVal;

var topscroll=0;
var subMenu;
var prevsubMenu;
var subMenuFocusSize;
var currentNum;
var currentNumber;
var currentsubNumber;
var listclick=false;
var doubleFocus=false;

var mousescroll=false;
var returnFocus="";

var scrollmouseFocus=false;

var returnMenu="";
var returnMenuF="";

var leftMenuindex=0;
var subMenuFocusList=0;
var subMenuindex;

var focusedList = 0;

var prevdetailHistory = "";

var FocusHeight = 0;
var isMenuSlideUp = false;
var allHeightli = 0;
var scrollAnimation = false;
var moveDownAmount = 0;
var moveUpAmount = 0;
var nextItemHeight = 0;
var prevItemHeight = 0;
var attrIndex = 0;
var pc =false;
var mouseClick = false;
var firstEnterscrollbarCreate;


$.fn.hasScrollBar = function () {
	if (firstEnterscrollbarCreate == true) {
		return allHeightli > this.innerHeight() ? true : false;
	}
	return this.children('ul').innerHeight() > this.innerHeight() ? true : false;
}

$(document).ready(function() {

	var lnbOffsetTop = $(".lnb").offset().top;
	var lnbHeight = $(".lnb").height();
	var ulHeight = 0;
	var lastIndex ;
	var firstIndex ;
	var itemMargin = $(".lnb li ").eq(0).outerHeight(true) - $(".lnb li ").eq(0).outerHeight();
	var itemsetMargin = $(".lnb > .menu > ul > li > ul:eq(1) > li").eq(1).outerHeight(true) - $(".lnb > .menu > ul > li > ul:eq(1) > li").eq(1).outerHeight(); //= 16;
	var curretnScrollPosition = 0;
	var subPrevFocusHeight = 0;

	var prevFocusInfo = window.localStorage.getItem("forJinA");

	$(".lnb > .menu > ul > li > a, .lnb > .menu > ul > li > ul > li > a").each(function(){
		if($(this).text().indexOf(" ") == -1){
			$(this).children(".text").css("word-break", "break-all");
		}
		allHeightli += $(this).parent().innerHeight();
	});

	$(".lnb ul li a").on("focusin", function(e){
		focusedList = $(".lnb ul li a").index(this);

		subPrevFocusHeight =  $(this).parent('li').prev('li').height();
	});

	var leftMenuFocusSize=$(".lnb > .menu > ul > li > a").size() -1;
	var AllMenuSize=$(".lnb .menu ul li a").size()-1;


		if(window.localStorage.getItem("prevFocusInfo") === "kja"){
			searchFocus=true;
			$(".search").focus();
			$(".lnb .menu ul li a").eq(leftMenuindex).children("span").show();
		}else{
			firstEnterscrollbarCreate = true;
			if(prevFocusInfo =='x'||prevFocusInfo==null||prevFocusInfo==undefined|| prevFocusInfo == "" ){

				subMenu = $(".lnb .menu ul li a").eq(0).siblings('.a');
				if (subMenu.length <= 0) {

					iFramelink = $(".lnb .menu ul li a").eq(0).attr("href");
					$("#iframetest").attr("src",iFramelink);
				}

				MenuFlag();
				leftMenuindex=0;
				window.localStorage.setItem("leftMenuindex", leftMenuindex);

				$(".lnb .menu ul li a").eq(leftMenuindex).children("span").show();

				scrollHandler(function() {
					$(".lnb > .menu > ul > li > a").eq(leftMenuindex).focus();
				});

			}else{
				$("#iframetest").attr("src",prevFocusInfo);
				setRecentlyItem(prevFocusInfo);

				var lnbFocusedHref = "";

				var mainIndex =0;
				var ulmainIndex =0;
				var subIndex =0;
				var jindex=0;

				$(".lnb .menu ul li a").each(function(index, list){
					lnbFocusedHref = $(list).attr("href");

					if(prevFocusInfo === lnbFocusedHref){
						mainIndex = $(".lnb .menu ul li a").eq(index).parent().parent().parent().attr("index");
						ulmainIndex = $(".lnb .menu ul li a").eq(index).parent().parent().attr("ulindex");
						$(".lnb .menu ul li a").eq(index).parent().parent().css("display","block");
						$(".lnb .menu ul li a").eq(index).parent().parent().prev().addClass('open');
						jindex=index;
						return false;
					}

				});

				$($(".lnb .menu ul:eq("+ulmainIndex+")").children('li')).each(function(index,list){
					lnbFocusedHref = $(list).children('a').attr("href");

					if(prevFocusInfo == lnbFocusedHref){
						subIndex = index;
						return false;
					}
				});
				if($(".lnb .menu ul:eq("+ulmainIndex+")").children('li').length){
					twoMenuFlag();
					leftMenuindex=mainIndex;

					subMenuindex=subIndex;
					window.localStorage.setItem("leftMenuindex2", leftMenuindex);
					window.localStorage.setItem("subMenuindex", subMenuindex);
					$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).children(".point").show();
					scrollHandler(function() {
						$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).focus();
					});
				}else{
					MenuFlag();
					leftMenuindex=jindex;

					$(".lnb .menu ul li a").eq(leftMenuindex).children("span").show();
					scrollHandler(function() {
						$(".lnb .menu ul li a").eq(leftMenuindex).focus();
					});
				}
				window.localStorage.setItem("forJinA","x");
			}
		}

	$('.wrap.detailWrap').mousemove(function(e){
		scrollmouseFocus= true;
	});

	$(".lnb .menu").on("scroll",function(){
		if($('.menu').hasScrollBar()) {
			ListScroll();
			$('.scroll-hide').hide();
			$('.scroll-hide').stop(true,true);
			$('.scroll-hide').fadeIn(1500);
		} else {
			$(".wrap .lnb .scroll-hide").css('display','none');
		}
	});

	$("body").keydown(function(){
		if(document.activeElement == $(this).get(0)){
			if(leftMenuFocus== true ) {
				$(".lnb > .menu > ul > li > a").eq(leftMenuindex).focus();
				e.preventDefault();
			}else if(submenuFocus==true){
				$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).focus();
				e.preventDefault();
				subMenuFocusList = subMenuindex;
			}else if(backkeyFocus==true){
				$(".backBtn a").focus();
			}
		}
	});
	$('.wrap.detailWrap').on("keydown", function(e) {
			if(pc==false){

			}else{

				if(leftMenuFocus == true ) {
					$(".lnb > .menu > ul > li > a").eq(leftMenuindex).focus();
					e.preventDefault();
				}else if(submenuFocus == true){
					$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).focus();
					e.preventDefault();
					subMenuFocusList = subMenuindex;
				}else if(backkeyFocus == true){
					$(".backBtn a").focus();
				}
			}

	});

	$(".lnb > .menu > ul > li > a").on("keydown",function(e){
		mouseClick = false;
		if(doubleFocus){return false;}
		scrollmouseFocus=true;
		leftMenuindex = $(".lnb > .menu > ul > li > a").index(this);
		subMenuFocusSize = $(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").size()-1;
		if (!scrollAnimation) {
		if(e.keyCode == downKey){

			$.each($('.lnb li'), function(index, list) {

				var listTop = $(list).offset().top ;

				if( listTop >= lnbOffsetTop && listTop < lnbOffsetTop+lnbHeight )
				{
					lastIndex = index ;
				}
			});

				subMenu = $(this).siblings('.a');
				if (subMenu.length > 0) {
					if(subMenu.is(':hidden')){
						if(leftMenuindex < leftMenuFocusSize){
							MenuFlag();
							if(focusedList != lastIndex){
								leftMenuindex++;
								var preFocusScrolltop = $('.lnb .menu').scrollTop();
								$(".lnb > .menu > ul > li > a").eq(leftMenuindex).focus();
								var nextFocusScrolltop = $('.lnb .menu').scrollTop();
								if (preFocusScrolltop != nextFocusScrolltop) {
									$('.lnb .menu').scrollTop(preFocusScrolltop);
									scrollAnimation = true;
									$(".lnb .menu").stop().animate({scrollTop:nextFocusScrolltop},300, function() {
										scrollAnimation = false;
									});
								}
							}
							else{
								leftMenuindex++;
								if(leftMenuindex==leftMenuFocusSize){
									moveDownAmount = $(".lnb .menu").scrollTop($(".lnb .menu")[0].scrollHeight);
									$(".lnb .arrow .arrow-down").css("background-position", "-120px -60px");

								}
								curretnScrollPosition = $('.lnb .menu').scrollTop();
								moveDownAmount = curretnScrollPosition + nextItemHeight ;


								scrollAnimation = true;
								$(".lnb > .menu > ul > li > a").eq(leftMenuindex).css('position', 'fixed').focus().css('position', 'static');

								$(".lnb .menu").stop().animate({scrollTop:moveDownAmount},300, function() {
									scrollAnimation = false;
								});
							}
						}
					}else{
						if(!isMenuSlideUp) {
							subMenuFocusList=0;
							if(subMenuFocusList < subMenuFocusSize){
								twoMenuFlag();
								if(focusedList != lastIndex){
									subMenuindex=subMenuFocusList;
									$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).focus();
								}
								else{
									subMenuindex=subMenuFocusList;
									curretnScrollPosition = $('.lnb .menu').scrollTop();
									nextItemHeight = $(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li").eq(subMenuindex).outerHeight()+itemsetMargin;
									moveDownAmount = curretnScrollPosition + nextItemHeight ;

									scrollAnimation = true;
									$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).css('position', 'fixed').focus().css('position', 'static');
									$(".lnb .menu").stop().animate({scrollTop:moveDownAmount},300, function() {
										scrollAnimation = false;
									});
								}
							}
						}else{
							MenuFlag();
							leftMenuindex++;
							$(".lnb > .menu > ul > li > a").eq(leftMenuindex).focus();
						}

					}
				}else{
					if(leftMenuindex < leftMenuFocusSize){

						MenuFlag();
						if(focusedList != lastIndex){
							leftMenuindex++;
							var preFocusScrolltop = $('.lnb .menu').scrollTop();
							$(".lnb > .menu > ul > li > a").eq(leftMenuindex).focus();
							var nextFocusScrolltop = $('.lnb .menu').scrollTop();
							if (preFocusScrolltop != nextFocusScrolltop) {
								$('.lnb .menu').scrollTop(preFocusScrolltop);
								scrollAnimation = true;
								$(".lnb .menu").stop().animate({scrollTop:nextFocusScrolltop},300, function() {
									scrollAnimation = false;
								});
							}
						}
						else{
							leftMenuindex++;
							curretnScrollPosition = $('.lnb .menu').scrollTop();
							nextItemHeight = $(".lnb > .menu > ul > li").eq(leftMenuindex).outerHeight()+itemMargin;
							moveDownAmount = curretnScrollPosition + nextItemHeight ;
							scrollAnimation = true;
							$(".lnb > .menu > ul > li > a").eq(leftMenuindex).css('position', 'fixed').focus().css('position', 'static');

							$(".lnb .menu").stop().animate({scrollTop:moveDownAmount},300, function() {
								scrollAnimation = false;
							});
						}
					}
				}
				e.preventDefault();
			}
		}
			if(e.keyCode == upKey){
				subMenu = $(this).siblings('.a');
				currentNumber = $(".lnb > .menu > ul > li > a").index(this);
				currentsubNumber = $(".lnb > .menu > ul > li > ul > li > a").index(this);
				prevsubMenu = $(".lnb > .menu > ul > li > a").eq(currentNumber-1).siblings('.a');
				if(prevsubMenu.length>0){
					$.each($('.lnb li'), function(index, list) {
						var listBottom = $(list).offset().top + $(".lnb li").eq(0).height();
						if( listBottom > lnbOffsetTop && listBottom < lnbOffsetTop + lnbHeight )
						{
							firstIndex = index ;
							return false;

						}
					});
				}else{
					$.each($('.lnb li'), function(index, list) {
						var listBottom = $(list).offset().top + $(list).height() ;

						if( listBottom > lnbOffsetTop && listBottom < lnbOffsetTop + lnbHeight )
						{
							firstIndex = index ;
							return false;

						}
					});
				}
				if (subMenu.length > 0) {
					if(subMenu.is(':hidden')){

							if(prevsubMenu.is(':visible')){
								twoMenuFlag();
								if(focusedList != firstIndex){
									leftMenuindex--;
									$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li:last-child a").focus();
								}
								else{
									leftMenuindex--;
									curretnScrollPosition = $('.lnb .menu').scrollTop();
									prevItemHeight = $(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li:last-child a").outerHeight()+itemsetMargin
									moveUpAmount = curretnScrollPosition - prevItemHeight ;

									scrollAnimation = true;
									$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li:last-child a").css('position', 'fixed').focus().css('position', 'static');
									$(".lnb .menu").stop().animate({scrollTop:moveUpAmount},300, function() {
										scrollAnimation = false;
									});

								}
							}else{

								MenuFlag();
								if(focusedList != firstIndex){
									leftMenuindex--;
									var preFocusScrollTop = $('.lnb .menu').scrollTop();
									$(".lnb > .menu > ul > li > a").eq(leftMenuindex).focus();
									var nextFocusScrollTop = $('.lnb .menu').scrollTop();

									if (preFocusScrollTop != nextFocusScrollTop) {
										$('.lnb .menu').scrollTop(preFocusScrollTop);

										scrollAnimation = true;

										$(".lnb .menu").stop().animate({scrollTop:nextFocusScrollTop},300, function() {
											scrollAnimation = false;
										});
									}
								}
								else{
									leftMenuindex--;
									curretnScrollPosition = $('.lnb .menu').scrollTop();
									moveUpAmount = curretnScrollPosition - prevItemHeight ;

									scrollAnimation = true;
									$(".lnb > .menu > ul > li > a").eq(leftMenuindex).css('position', 'fixed').focus().css('position', 'static');
									$(".lnb .menu").stop().animate({scrollTop:moveUpAmount},300, function() {
										scrollAnimation = false;
									});
								}
							}
					}else{
							MenuFlag();
							if(focusedList != firstIndex){
								leftMenuindex--;
								var preFocusScrollTop = $('.lnb .menu').scrollTop();
								$(".lnb > .menu > ul > li > a").eq(leftMenuindex).focus();
								var nextFocusScrollTop = $('.lnb .menu').scrollTop();

								if (preFocusScrollTop != nextFocusScrollTop) {
									$('.lnb .menu').scrollTop(preFocusScrollTop);

									scrollAnimation = true;

									$(".lnb .menu").stop().animate({scrollTop:nextFocusScrollTop},300, function() {
										scrollAnimation = false;
									});
								}
							}
							else{
								leftMenuindex--;
								curretnScrollPosition = $('.lnb .menu').scrollTop();

								moveUpAmount = curretnScrollPosition - prevItemHeight ;

								scrollAnimation = true;
								$(".lnb > .menu > ul > li > a").eq(leftMenuindex).css('position', 'fixed').focus().css('position', 'static');
								$(".lnb .menu").stop().animate({scrollTop:moveUpAmount},300, function() {
									scrollAnimation = false;
								});

							}
						}
				}else{

						if(prevsubMenu.is(':visible')){
							twoMenuFlag();
							if(focusedList != firstIndex){
								leftMenuindex--;
								$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li:last-child a").focus();
							}else{
								leftMenuindex--;
								curretnScrollPosition = $('.lnb .menu').scrollTop();
								prevItemHeight = $(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li:last-child a").outerHeight()+itemsetMargin
								moveUpAmount = curretnScrollPosition - prevItemHeight ;

								scrollAnimation = true;
								$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li:last-child a").css('position', 'fixed').focus().css('position', 'static');
								$(".lnb .menu").stop().animate({scrollTop:moveUpAmount},300, function() {
									scrollAnimation = false;
								});
							}

						}else{
							var getMenuIndex = window.localStorage.getItem("leftMenuindex");
							if(getMenuIndex == 0){

							}else{
							MenuFlag();
							if(focusedList != firstIndex){
								leftMenuindex--;
								var preFocusScrollTop = $('.lnb .menu').scrollTop();
								$(".lnb > .menu > ul > li > a").eq(leftMenuindex).focus();
								var nextFocusScrollTop = $('.lnb .menu').scrollTop();

								if (preFocusScrollTop != nextFocusScrollTop) {
									$('.lnb .menu').scrollTop(preFocusScrollTop);

									scrollAnimation = true;

									$(".lnb .menu").stop().animate({scrollTop:nextFocusScrollTop},300, function() {
										scrollAnimation = false;
									});
								}
							}
							else{
								leftMenuindex--;
								curretnScrollPosition = $('.lnb .menu').scrollTop();
								moveUpAmount = curretnScrollPosition - prevItemHeight ;
								var preFocusScrollTop = $('.lnb .menu').scrollTop();
								$(".lnb > .menu > ul > li > a").eq(leftMenuindex).css('position', 'fixed').focus().css('position', 'static');
								var nextFocusScrollTop = $('.lnb .menu').scrollTop();
								if (preFocusScrollTop != nextFocusScrollTop) {
									$('.lnb .menu').scrollTop(preFocusScrollTop);
								}

								scrollAnimation = true;
								$(".lnb .menu").stop().animate({scrollTop:moveUpAmount},300, function() {
									scrollAnimation = false;
								});
							}
							}
						}
				}
				e.preventDefault();
		}
		if(e.keyCode == rightKey){
				returnMenu = true; // 메인메뉴와 서브메뉴 구분을 위한 Flag
				iframeFlag();
				$("#iframetest").focus();
		}
		if(e.keyCode == leftKey){

			returnMenu = true;
			backFlag();
			$(".backBtn a").focus();
		}
		if(e.keyCode == enterKey){
			firstEnterscrollbarCreate = false;
			if(mouseClick == false){
			listclick=true;
		FocusHeight=$(".lnb > .menu > ul > li > a").eq(leftMenuindex).height();


		subMenu = $(this).siblings('.a');

		if (subMenu.length > 0) {
			if (subMenu.is(':hidden')) {

				$('.scroll-hide').stop(true,true);
				$('.a').slideUp(150,function() {
					$('.lnb li a').removeClass('open');
					scrollHandler();
				});

				subMenu.slideDown(150,function() {
					$(this).prev().addClass('open');
					scrollHandler();
				});

			} else {

				isMenuSlideUp = true ;
				setTimeout(function() {
					isMenuSlideUp = false ;
				}, 200);
				$('.scroll-hide').stop(true,true);
				subMenu.slideUp(150,function() {
					$(this).prev().removeClass('open');
					scrollHandler();
				});
			}

		}else{
			topscroll = 0;
			ulHeight = $(".lnb ul").height();

			iFramelink=$(this).attr("href");
			$("#iframetest").attr("src",$(this).attr("href"));
			//leftMenuindex = $(".lnb > .menu > ul > li > a").index(this);
			setRecentlyItem(iFramelink);
			MenuFlag();
			$(".lnb > .menu > ul > li > a").each(function(){
				$(".lnb > .menu > ul > li > a").children(".point").hide();
			});
			$(".lnb > .menu > ul > li > ul > li > a").children(".point").hide();
			$(".lnb > .menu > ul > li > a").eq(leftMenuindex).children(".point").show();
			var clickscrollTop = $(".lnb .menu").scrollTop();
			$.each($('.lnb li'), function(index, list) {
				var listTop = $(list).offset().top ;
				if( listTop >= lnbOffsetTop && listTop < lnbOffsetTop+lnbHeight ) {
					lastIndex = index ;
				}
			});
			if(focusedList == lastIndex){
				if(leftMenuindex == leftMenuFocusSize ){
					if(ulHeight < lnbHeight ){
						scrollAnimation = true;
						$(".lnb > .menu > ul > li > a").eq(leftMenuindex).css('position', 'fixed').focus().css('position', 'static');
						$(".lnb .menu").stop().animate({scrollTop: $(".lnb .menu")[0].scrollHeight},300,function(){
							scrollAnimation = false;
						});
						ulHeight =  $(".lnb ul").height();
					}else{
						if(($(".lnb > .menu > ul > li > a").eq(leftMenuindex).height()-FocusHeight) !== 0){
							scrollAnimation = true;
							$(".lnb > .menu > ul > li > a").eq(leftMenuindex).css('position', 'fixed').focus().css('position', 'static');
							$('.lnb .menu').scrollTop(clickscrollTop);
							$(".lnb .menu").stop().animate({scrollTop:clickscrollTop + ($(".lnb > .menu > ul > li > a").eq(leftMenuindex).height()-FocusHeight)},300,function(){
								scrollAnimation = false;
							});
						}
					}
				}else if(leftMenuindex !== leftMenuFocusSize){
					if(($(".lnb > .menu > ul > li > a").eq(leftMenuindex).height()-FocusHeight) !== 0){
						scrollAnimation = true;
						$(".lnb > .menu > ul > li > a").eq(leftMenuindex).css('position', 'fixed').focus().css('position', 'static');
						$(".lnb .menu").stop().animate({scrollTop:clickscrollTop + ($(".lnb > .menu > ul > li > a").eq(leftMenuindex).height()-FocusHeight)},300,function(){
							scrollAnimation = false;
						});
					}
				}
			}else{
				if(ulHeight < lnbHeight ){
					if( $(".lnb > .menu > ul > li > a").eq(leftMenuindex).offset().top + $(".lnb > .menu > ul > li > a").eq(leftMenuindex).height() > lnbHeight ){
						if(($(".lnb > .menu > ul > li > a").eq(leftMenuindex).height()-FocusHeight) !== 0){
							scrollAnimation = true;
							$(".lnb > .menu > ul > li > a").eq(leftMenuindex).css('position', 'fixed').focus().css('position', 'static');

							$(".lnb .menu").stop().animate({scrollTop: ($(".lnb > .menu > ul > li > a").eq(leftMenuindex).offset().top + $(".lnb > .menu > ul > li > a").eq(leftMenuindex).height()-lnbHeight )},300,function(){
								scrollAnimation = false;
							});
						}
					}
				}
			}
			scrollHandler();
		}
		}
		}
	}).on('mousewheel', function() {
		scrollmouseFocus=false;
		$('.wrap.detailWrap').focus();

	}).click(function(){
		firstEnterscrollbarCreate = false;
		if(mouseClick == true){

		listclick=true;
		FocusHeight=$(".lnb > .menu > ul > li > a").eq(leftMenuindex).height();


		subMenu = $(this).siblings('.a');


		if (subMenu.length > 0) {
			if (subMenu.is(':hidden')) {
				$('.scroll-hide').stop(true,true);
				$('.a').slideUp(150,function() {
					$('.lnb li a').removeClass('open');
					scrollHandler();
				});

				subMenu.slideDown(150,function() {
					$(this).prev().addClass('open');
					scrollHandler();
				});

			} else {
				isMenuSlideUp = true ;
				setTimeout(function() {
					isMenuSlideUp = false ;
				}, 200);
				$('.scroll-hide').stop(true,true);
				subMenu.slideUp(150,function() {
					$(this).prev().removeClass('open');
					scrollHandler();
				});
			}

		}else{
			topscroll = 0;
			ulHeight = $(".lnb ul").height();

			iFramelink=$(this).attr("href");
			$("#iframetest").attr("src",$(this).attr("href"));
			//leftMenuindex = $(".lnb > .menu > ul > li > a").index(this);
			setRecentlyItem(iFramelink);
			MenuFlag();
			$(".lnb > .menu > ul > li > a").each(function(){
				$(".lnb > .menu > ul > li > a").children(".point").hide();
			});
			$(".lnb > .menu > ul > li > ul > li > a").children(".point").hide();
			$(".lnb > .menu > ul > li > a").eq(leftMenuindex).children(".point").show();
			var clickscrollTop = $(".lnb .menu").scrollTop();
			$.each($('.lnb li'), function(index, list) {
				var listTop = $(list).offset().top ;
				if( listTop >= lnbOffsetTop && listTop < lnbOffsetTop+lnbHeight ) {
					lastIndex = index ;
				}
			});
			if(focusedList == lastIndex){
				if(leftMenuindex == leftMenuFocusSize ){
					if(ulHeight < lnbHeight ){
						scrollAnimation = true;
						$(".lnb > .menu > ul > li > a").eq(leftMenuindex).css('position', 'fixed').focus().css('position', 'static');
						$(".lnb .menu").stop().animate({scrollTop: $(".lnb .menu")[0].scrollHeight},300,function(){
							scrollAnimation = false;
						});
						ulHeight =  $(".lnb ul").height();
					}else{
						if(($(".lnb > .menu > ul > li > a").eq(leftMenuindex).height()-FocusHeight) !== 0){
							scrollAnimation = true;
							$(".lnb > .menu > ul > li > a").eq(leftMenuindex).css('position', 'fixed').focus().css('position', 'static');
							$('.lnb .menu').scrollTop(clickscrollTop);
							$(".lnb .menu").stop().animate({scrollTop:clickscrollTop + ($(".lnb > .menu > ul > li > a").eq(leftMenuindex).height()-FocusHeight)},300,function(){
								scrollAnimation = false;
							});
						}
					}
				}else if(leftMenuindex !== leftMenuFocusSize){
					if(($(".lnb > .menu > ul > li > a").eq(leftMenuindex).height()-FocusHeight) !== 0){
						scrollAnimation = true;
						$(".lnb > .menu > ul > li > a").eq(leftMenuindex).css('position', 'fixed').focus().css('position', 'static');
						$(".lnb .menu").stop().animate({scrollTop:clickscrollTop + ($(".lnb > .menu > ul > li > a").eq(leftMenuindex).height()-FocusHeight)},300,function(){
							scrollAnimation = false;
						});
					}
				}
			}else{
				if(ulHeight < lnbHeight ){
					if( $(".lnb > .menu > ul > li > a").eq(leftMenuindex).offset().top + $(".lnb > .menu > ul > li > a").eq(leftMenuindex).height() > lnbHeight ){
						if(($(".lnb > .menu > ul > li > a").eq(leftMenuindex).height()-FocusHeight) !== 0){
							scrollAnimation = true;
							$(".lnb > .menu > ul > li > a").eq(leftMenuindex).css('position', 'fixed').focus().css('position', 'static');

							$(".lnb .menu").stop().animate({scrollTop: ($(".lnb > .menu > ul > li > a").eq(leftMenuindex).offset().top + $(".lnb > .menu > ul > li > a").eq(leftMenuindex).height()-lnbHeight )},300,function(){
								scrollAnimation = false;
							});
						}
					}
				}
			}
			scrollHandler();
		}
		}
	}).mousemove(function() {
		if(scrollmouseFocus ==true){
			pc=false;
			returnMenu = true;
			mouseClick = true;
			MenuFlag();
			leftMenuindex = $(".lnb > .menu > ul > li > a").index(this);
			$(".lnb > .menu > ul > li > a").eq(leftMenuindex).focus();
		}
	}).mouseout(function(){
		if(scrollmouseFocus ==true){
			mouseClick = true;
			pc=true;
			MenuFlag();
			$('.wrap.detailWrap').focus();
		}
	}).on("focusin", function(e){
		listclick=true;
		nextItemHeight = $(".lnb > .menu > ul > li").eq(leftMenuindex + 1).outerHeight()+itemMargin;
		prevItemHeight = $(".lnb > .menu > ul > li").eq(leftMenuindex - 1).outerHeight()+itemMargin;
		curretnScrollPosition = $('.lnb .menu').scrollTop();
		window.localStorage.setItem("leftMenuindex", leftMenuindex);
	});

	$(".lnb > .menu > ul > li > ul > li > a").on("keydown",function(e){
		if(doubleFocus){return false;}
		scrollmouseFocus=true;
		subMenuFocusSize = $(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").size()-1;
		if (!scrollAnimation) {
		if(e.keyCode==downKey){
			$.each($('.lnb li '), function(index, list) {

				var listTop = $(list).offset().top ;
				if( listTop >= lnbOffsetTop && listTop < lnbOffsetTop+lnbHeight )
				{
					lastIndex = index ;
				}
			});

			currentNum = $(".lnb > .menu > ul > li > ul > li > a").index(this) + leftMenuFocusSize +1;
			if(subMenuindex < subMenuFocusSize){
				twoMenuFlag();

				if(focusedList != lastIndex){
					subMenuindex++;
					var preFocusScrolltop = $('.lnb .menu').scrollTop();
					$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).focus();
					var nextFocusScrolltop = $('.lnb .menu').scrollTop();
					if (preFocusScrolltop != nextFocusScrolltop) {
						$('.lnb .menu').scrollTop(preFocusScrolltop);
						scrollAnimation = true;
						$(".lnb .menu").stop().animate({scrollTop:nextFocusScrolltop},280, function() {
							scrollAnimation = false;
						});
					}
				}
				else {
					subMenuindex++;
					curretnScrollPosition = $('.lnb .menu').scrollTop();
					nextItemHeight =$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li").eq(subMenuindex).outerHeight()+itemsetMargin;

					moveUpAmount = curretnScrollPosition + nextItemHeight ;

					scrollAnimation = true;
					$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).css('position', 'fixed').focus().css('position', 'static');
					$(".lnb .menu").stop().animate({scrollTop:moveUpAmount},300, function() {
						scrollAnimation = false;
					});
				}
			}else if(leftMenuindex<leftMenuFocusSize){
				MenuFlag();

				if(focusedList != lastIndex){
					leftMenuindex++;
					var preFocusScrolltop = $('.lnb .menu').scrollTop();
					$(".lnb > .menu > ul > li > a").eq(leftMenuindex).focus();
					var nextFocusScrolltop = $('.lnb .menu').scrollTop();
					if (preFocusScrolltop != nextFocusScrolltop) {
						$('.lnb .menu').scrollTop(preFocusScrolltop);
						scrollAnimation = true;

						$(".lnb .menu").stop().animate({scrollTop:nextFocusScrolltop},300, function() {
							scrollAnimation = false;

						});
					}
				}
				else {
					leftMenuindex++;
					curretnScrollPosition = $('.lnb .menu').scrollTop();
					nextItemHeight = $(".lnb > .menu > ul > li").eq(leftMenuindex).outerHeight()+itemMargin;
					moveUpAmount = curretnScrollPosition + nextItemHeight ;

					scrollAnimation = true;

					$(".lnb > .menu > ul > li > a").eq(leftMenuindex).css('position', 'fixed').focus().css('position', 'static');
					$(".lnb .menu").stop().animate({scrollTop:moveUpAmount},300, function() {
						scrollAnimation = false;

					});
				}
			}else if(currentNum == AllMenuSize){
				MenuFlag();
				$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).focus();
			}
			e.preventDefault();
		}

		if(e.keyCode == upKey){

			subMenuindex =$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").index(this);
				$.each($('.lnb li'), function(index, list) {
					var listBottom = $(list).offset().top + subPrevFocusHeight;
					if( listBottom > lnbOffsetTop && listBottom < lnbOffsetTop + lnbHeight ) {
						firstIndex = index ;
						return false;
					}
				});

			subMenuindex =$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").index(this);
			if(subMenuindex == 0){
				MenuFlag();

				var preFocusScrollTop = $('.lnb .menu').scrollTop();
				$(".lnb > .menu > ul > li > a").eq(leftMenuindex).focus();
				var nextFocusScrollTop = $('.lnb .menu').scrollTop();
				var calculate = preFocusScrollTop - nextFocusScrollTop;
				if (preFocusScrollTop != nextFocusScrollTop) {
					$('.lnb .menu').scrollTop(preFocusScrollTop);
					prevItemHeight = $(".lnb > .menu > ul > li").eq(leftMenuindex - 1).outerHeight()+itemMargin;
					if(nextFocusScrollTop === 0 || calculate > prevItemHeight) {
						curretnScrollPosition = $('.lnb .menu').scrollTop();
						nextFocusScrollTop = curretnScrollPosition - prevItemHeight ;
					}

					scrollAnimation = true;

					$(".lnb .menu").stop().animate({scrollTop:nextFocusScrollTop},300, function() {
						scrollAnimation = false;

					});
				}
			}else{
				twoMenuFlag();
				if(focusedList != firstIndex){
					subMenuindex--;
					var preFocusScrollTop = $('.lnb .menu').scrollTop();
					$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).focus();
					var nextFocusScrollTop = $('.lnb .menu').scrollTop();
					if (preFocusScrollTop != nextFocusScrollTop) {
						$('.lnb .menu').scrollTop(preFocusScrollTop);

						scrollAnimation = true;

						$(".lnb .menu").stop().animate({scrollTop:nextFocusScrollTop},300, function() {
							scrollAnimation = false;
						});
					}
				}
				else{
					subMenuindex--;
					curretnScrollPosition = $('.lnb .menu').scrollTop();

					prevItemHeight = $(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li").eq(subMenuindex).outerHeight()+itemsetMargin;
					moveUpAmount = curretnScrollPosition - prevItemHeight ;
					var preFocusScrollTop = $('.lnb .menu').scrollTop();
					$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).css('position', 'fixed').focus().css('position', 'static');
					var nextFocusScrollTop = $('.lnb .menu').scrollTop();
					if (preFocusScrollTop != nextFocusScrollTop) {
						$('.lnb .menu').scrollTop(preFocusScrollTop);
					}
					scrollAnimation = true;
					$(".lnb .menu").stop().animate({scrollTop:moveUpAmount},300, function() {
						scrollAnimation = false;
					});
				}
			}
			e.preventDefault();
		}
		}
		if(e.keyCode == rightKey){
				returnMenu = false; // 메인메뉴와 서브메뉴 구분을 위한 Flag
				iframeFlag();
				$("#iframetest").focus();
		}
		if(e.keyCode == leftKey){
			returnMenu = false;
			backFlag();
			$(".backBtn a").focus();
		}
		if(e.keyCode == enterKey){
			firstEnterscrollbarCreate= false;
			listclick=true;
		FocusHeight=$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).height();

		iFramelink=$(this).attr("href");
		$("#iframetest").attr("src",$(this).attr("href"));
		setRecentlyItem(iFramelink);

		twoMenuFlag();

		$(".lnb > .menu > ul > li > a").each(function(){
			$(".lnb > .menu > ul > li > a").children(".point").hide();
			$(".lnb > .menu > ul > li > ul > li > a").children(".point").hide();
		});

		$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).children(".point").show();
		var clickscrollTop = $(".lnb .menu").scrollTop();
		$.each($('.lnb li'), function(index, list) {

			var listTop = $(list).offset().top ;

			if( listTop >= lnbOffsetTop && listTop < lnbOffsetTop+lnbHeight ) {
				lastIndex = index ;
			}
		});
		if(focusedList == lastIndex){
			if($(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).height()>FocusHeight){
				scrollAnimation = true;
				$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).css('position', 'fixed').focus().css('position', 'static');
				$(".lnb .menu").stop().animate({scrollTop:clickscrollTop + ($(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).height()-FocusHeight)},300,function(){
					scrollAnimation = false;
				});
			}
		}

		scrollHandler();
		}
	}).on('mousewheel', function() {
		scrollmouseFocus=false;
		$('.wrap.detailWrap').focus();

	}).click(function(){
		firstEnterscrollbarCreate= false;
		listclick=true;
		FocusHeight=$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).height();

		iFramelink=$(this).attr("href");
		$("#iframetest").attr("src",$(this).attr("href"));
		setRecentlyItem(iFramelink);

		twoMenuFlag();

		$(".lnb > .menu > ul > li > a").each(function(){
			$(".lnb > .menu > ul > li > a").children(".point").hide();
			$(".lnb > .menu > ul > li > ul > li > a").children(".point").hide();
		});

		$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).children(".point").show();
		var clickscrollTop = $(".lnb .menu").scrollTop();
		$.each($('.lnb li'), function(index, list) {

			var listTop = $(list).offset().top ;

			if( listTop >= lnbOffsetTop && listTop < lnbOffsetTop+lnbHeight ) {
				lastIndex = index ;
			}
		});
		if(focusedList == lastIndex){
			if($(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).height()>FocusHeight){
				scrollAnimation = true;
				$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).css('position', 'fixed').focus().css('position', 'static');
				$(".lnb .menu").stop().animate({scrollTop:clickscrollTop + ($(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).height()-FocusHeight)},300,function(){
					scrollAnimation = false;
				});
			}
		}

		scrollHandler();

	}).on("focusin", function(e){
		listclick=true;
		nextItemHeight = $(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li").eq(subMenuindex+1).outerHeight()+itemsetMargin;
		prevItemHeight = $(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li").eq(subMenuindex-1).outerHeight()+itemsetMargin;
		curretnScrollPosition = $('.lnb .menu').scrollTop();
		window.localStorage.setItem("leftMenuindex2", leftMenuindex);
		window.localStorage.setItem("subMenuindex", subMenuindex);

	}).mousemove(function() {
		attrIndex = $(this).parent().parent().attr("index");
		if(scrollmouseFocus ==true){

			pc =false;
			returnMenu = false;
			twoMenuFlag();

			leftMenuindex = attrIndex;
			subMenuindex =$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").index(this);
			$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).focus();
		}
	}).mouseout(function() {
		if(scrollmouseFocus ==true){
			pc=true;
			twoMenuFlag();
			$('.wrap.detailWrap').focus();
		}
	});


	// backbutton event
	$(".backBtn a").on("keydown",function(e){

		if(doubleFocus){doubleFocus =false; return false;}

		if(e.keyCode==rightKey){
			if(returnMenu ==false){
				twoMenuFlag();
				$(".lnb > .menu > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).focus();
			}else if(returnMenu ==true){
				MenuFlag();
				$(".lnb > .menu > ul > li > a").eq(leftMenuindex).focus();
			}else{
				MenuFlag();
				leftMenuindex=0;
				$(".lnb > .menu > ul > li > a").eq(leftMenuindex).focus();
			}
		}
		if(e.keyCode==CURSOR_SHOW){
			backkeyFocus=true;
			$(".wrap.detailWrap").focus();
		}
		if(e.keyCode == CURSOR_HIDE){
			backkeyFocus=true;
		}
	}).mouseover(function() {
		pc=false;
		backFlag();
		$(".backBtn a").focus();
	}).mouseout(function() {
		pc=true;
		backFlag();
		$(".wrap.detailWrap").focus();
	});

	/* iOS iframe 스크롤 버그 수정 */
	var userAgent = navigator.userAgent.toLowerCase();
	if ((userAgent.search('iphone') > -1) || (userAgent.search('ipod') > -1) || (userAgent.search('ipad') > -1)) {
		$('.content').css({'overflow':'auto', '-webkit-overflow-scrolling':'touch'});
	}
});

function ListScroll(){
	if(tvResolution == "FHD"){
		if($(".lnb .menu").scrollTop() <= 0){
			$(".lnb .scroll-arrow .arrow-down").css("background-position", "0px -60px");
			$(".lnb .scroll-arrow .arrow-up").css("background-position", "-120px 0px");
		} else if ($(".lnb .menu").scrollTop() > 0 && $(".wrap .lnb .menu").scrollTop()+ $(".lnb .menu").height() < $(".lnb .menu")[0].scrollHeight){
			$(".lnb .scroll-arrow .arrow-up").css("background-position", " 0px 0px");
			$(".lnb .scroll-arrow .arrow-down").css("background-position", "0px -60px");
		} else if ($(".lnb .menu").scrollTop() + $(".lnb .menu").height() >= $(".lnb .menu")[0].scrollHeight){
			$(".lnb .scroll-arrow .arrow-up").css("background-position", " 0px 0px");
			$(".lnb .scroll-arrow .arrow-down").css("background-position", "-120px -60px");
		}
	}else{
		if($(".lnb .menu").scrollTop() <= 0){
			$(".lnb .scroll-arrow .arrow-down").css("background-position", "0px -40px");
			$(".lnb .scroll-arrow .arrow-up").css("background-position", "-80px 0px");
		} else if ($(".lnb .menu").scrollTop() > 0 && $(".wrap .lnb .menu").scrollTop()+ $(".lnb .menu").height() < $(".lnb .menu")[0].scrollHeight){
			$(".lnb .scroll-arrow .arrow-up").css("background-position", " 0px 0px");
			$(".lnb .scroll-arrow .arrow-down").css("background-position", "0px -40px");
		} else if ($(".lnb .menu").scrollTop() + $(".lnb .menu").height() >= $(".lnb .menu")[0].scrollHeight){
			$(".lnb .scroll-arrow .arrow-up").css("background-position", " 0px 0px");
			$(".lnb .scroll-arrow .arrow-down").css("background-position", "-80px -40px");
		}
	}
}
function iframeHeightFunc(param){//함수에 param 값을 가져오겟다.
	iframeVal = param;
	$("#iframetest").attr("height",iframeVal);
	//프로그래밍 위치 매개 변수에 대한 내용을 스크롤 할 scrollTo 메소드를 호출
	setTimeout(function(){
		$('.content').css('visibility','visible');
	}, 1);
}

function backFlag(){
	leftMenuFocus = false;
	submenuFocus = false;
	backkeyFocus=true;
	iframeFocus=false;
}

function twoMenuFlag(){
	leftMenuFocus = false;
	submenuFocus = true;
	backkeyFocus=false;
	iframeFocus=false;
}

function MenuFlag(){
	leftMenuFocus = true;
	submenuFocus = false;
	backkeyFocus=false;
	iframeFocus=false;
}

function iframeFlag(){
	leftMenuFocus = false;
	submenuFocus = false;
	backkeyFocus=false;
	iframeFocus=true;
}

function scrollHandler(callback) {
	if($('.menu').hasScrollBar()) {

		ListScroll();
		$('.menu').css('overflow-Y', 'auto');
		$(".wrap .lnb .scroll-hide").css('display','block');
		$(".wrap .lnb .scroll-arrow").css('display','block');
	} else {
		$('.menu').css('overflow-Y', 'hidden');
		$(".wrap .lnb .scroll-hide").css('display','none');
		$(".wrap .lnb .scroll-arrow").css('display','none');
	}

	if(typeof callback === 'function') {
		callback();
	}
}
