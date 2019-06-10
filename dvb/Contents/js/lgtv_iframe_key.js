
$( document ).bind( 'keydown', function (e) {
	if(e.keyCode == leftKey){
		console.log("zzzzzzzzzz");
		console.log("leftMenuindex"+leftMenuindex);
		console.log("subMenuindex"+subMenuindex);
		//window.parent.$(".lnb .point:visible").parent().focus();
		//leftMenuindex = window.parent.$(".lnb .point:visible").parent().index();
		//window.parent.$(".lnb > div > ul > li > a").eq(0).focus();
 		if(parent.returnMenu == false){//서브메뉴
			console.log("11");
			var leftMenuindex = window.localStorage.getItem("leftMenuindex2");
			var subMenuindex = window.localStorage.getItem("subMenuindex");
			parent.twoMenuFlag();
			window.parent.$(".lnb > div > ul > li:eq("+leftMenuindex+") > ul > li > a").eq(subMenuindex).focus();
		}else if(parent.returnMenu == true){//메인메뉴
			console.log("22");
			var leftMenuindex = window.localStorage.getItem("leftMenuindex");
			console.log("leftMenuindex"+leftMenuindex);
			parent.MenuFlag();
			window.parent.$(".lnb > div > ul > li > a").eq(leftMenuindex).focus();
		}else{
			console.log("00");
			parent.MenuFlag();
			window.parent.$(".lnb > div > ul > li > a").eq(0).focus();
		}
	}
});

$(document).ready(function() {

	$(window).load(function() {

		var iframeHeight = $('html').height();
		
	});
	
	
});