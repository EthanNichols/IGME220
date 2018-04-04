    // 1
  	window.onload = (e) => {document.querySelector("#search").onclick = getData};
	
	// 2
	let displayTerm = "";
	
	// 3
	function getData(){
		console.log("getData() called");
	}
      
    function getData() {
        const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";
        
        const GIPHY_KEY = "dc6zaTOxFJmzC";
        
        let url = GIPHY_URL;
        
        url += "api_key=" + GIPHY_KEY;
        
        let term = document.querySelector("#searchterm").value;
        displayTerm = term;
        
        term = term.trim();
        
        term = encodeURIComponent(term);
        
        if (term.length < 1) return;
        
        url += "&q=" + term;
        
        let limit = document.querySelector("#limit").value;
        url += "&limit=" + limit;
        
        document.querySelector("#content").innerHTML = "<b>Searching for " + displayTerm + "</b>";
        
        console.log(url);
        
        $.ajax({
            dataType: "json",
            url: url,
            data: null,
            success: jsonLoaded
        });
        
        $("#content").fadeOut(100);
    }
      
    function jsonLoaded(obj) {
        console.log("obj = " + obj);
        console.log("obj stringified = " + JSON.stringify(obj));
        
        if (!obj.data || obj.data.length == 0) {
            document.querySelector("#content").innerHTML = '<p><i>No results found for "${displayTerm}"</i></p>';
            return;
        }
        
        let results = obj.data;
        console.log("Results.length = " + results.length);
        let bigString  = "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
        
        for (let i=0; i<results.length; i++) {
            let result = results[i];
            
            let smallURL = result.images.fixed_width_small.url;
            if (!smallURL) smallURL = "images/no-image-found.png";
            let rating = result.rating.toUpperCase();
            
            let url = results.url;
            
            let line = `<div class="result"><img src="${smallURL}" title ="${result.id}" />`;
            line += `<span><a target="_blank" href="${url}">View on Giphy</a></span>`;
            line += `<span>Rating: ${rating}</span></div>`;
            
            bigString += line;
        }
        
        document.querySelector("#content").innerHTML = bigString;
        $("#content").fadeIn(500);
    }