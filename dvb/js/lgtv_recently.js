function getRecentlyItem(){
	
	var savedRecentlyList = window.localStorage.getItem("recentlyItem"); // 클릭을 한 수 만큼 저장해준다.
	if (savedRecentlyList != null || savedRecentlyList != undefined) {
		$("#noneListDiv").hide();
		$("#recentlyListDiv").show();
		var recentlyList = savedRecentlyList.split("#");
		var tagitem;
		for (var i = 0; recentlyList.length > i ; i++) {
			$.each(window.param, function(key, val) {
				if (val.link ==recentlyList[i]){
					var Linksplit = val.link.split("/");
					var pageLink = Linksplit[4];
					var idxSummary = val.summary;
					
					if (pageLink.match("_")) { 
						pageLink = Linksplit[3];
					} 
					if (checkByte(val.search_body)){
						idxSummary +="...";
					} 
						tagitem += "<li>" + "<a href='#' data-navi=\"" + pageLink +"\" data-link=\""+  val.link +"\" id=\"recentlyList" + i + "\"\>" + 
								  "<h4 class='contents-title'>" + val.navi + "<em>" + val.title + "</em></h4>" +
								  "<p class='desc'>" + idxSummary + "</p>" +"</a>" + 
								  "</li>";
						$("#recentlyListDiv ul").append(tagitem);

						
					}				
				tagitem = "";
				
				
			});
		}
		if ($("#recentlyListDiv").height() < $("#recentlyListDiv ul").height()){
			isArrowBarExist = true;
			$("#arrowDiv").show();
		};
	} else if (savedRecentlyList === null || savedRecentlyList === undefined) {
		$("#recentlyListDiv").hide();
		$("#arrowDiv").hide();
		$("#noneListDiv").show();
	}
}