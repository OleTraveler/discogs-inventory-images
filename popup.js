$( document ).ready(function() {
    document.getElementById("gobutton").addEventListener("click", go);
});

var rootDir = "/Users/tstevens/Dropbox/Apps/discogs-inventory-images/";

function sleepFor( sleepDuration ){
	    var now = new Date().getTime();
	    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

function go() {
  var albumDetails = "<font rwr='1' size='4' style='font-family:Arial'><div>";
  var trackList = "<div><div><u>Track List</u></div>";
  var listingIdInput = $("#listingIds").val();
  var listingIds = listingIdInput.split(" ").map(function(s) { return s.trim() });; 
  var img = "<pre>" + genImagikConvert(listingIds) + "</pre>";
  var finders = genFinder(listingIds);
  listingIds.map(function(listingId, i) { 
    console.log("listing: " + listingId + " i: " + i);
    var listing = $.ajax({ async: false, url: 'https://api.discogs.com/marketplace/listings/' + listingId});
    var release = $.ajax({ async: false, url: 'https://api.discogs.com/releases/' + listing.responseJSON.release.id});
    if ((i % 2) == 1) {
      sleepFor(60000);
    }
	  
    albumDetails = albumDetails + genAlbumDetails(listing.responseJSON, release.responseJSON) + "</div></font>";
    trackList = trackList + genTrackList(listing.responseJSON, release.responseJSON) + "</div>";
    
    $("#imagik").html(img);
    $("#finder").html(finders);
    $("#output").html(albumDetails + trackList);
  });
}

function genFinder(listingIds) {
	var open = "open";
	listingIds.forEach(function(f) { open = open + " " + rootDir + f + "/images";})
	return open;
};

function genImagikConvert(listingIds) {
  var files = listingIds.map(function(li) { return rootDir + li + "/images/cover.jpg";});  
  if (files.length <= 1) {
	  return "";
  } else if (files.length == 2) {
	  return "convert +append " + files[0] + " " + files[1] + " /Users/tstevens/tmp/cover.jpg";
  } else if (files.length == 3) {
	  return "convert +append " +  files[0] + " " + files[1] + " /Users/tstevens/tmp/cover.jpg\n" +
		  "convert -append /Users/tstevens/tmp/cover.jpg " + files[2] + " /Users/tstevens/tmp/cover.jpg\n";
  } else if (files.length == 4) {
	  return "convert +append " +  files[0] + " " + files[1] + " /Users/tstevens/tmp/cover1.jpg\n" +
	         "convert +append " +  files[2] + " " + files[3] + " /Users/tstevens/tmp/cover2.jpg\n" +
		  "convert -append /Users/tstevens/tmp/cover1.jpg /Users/tstevens/tmp/cover2.jpg /Users/tstevens/tmp/cover.jpg\n";
  } else {
	  return files.toString();
  }

  
}

function genTrackList(listing, release) {
  var output = "<div><u>" + release.title + "</u> (" + listing.id + ")<ul>";
  var tl = release.tracklist;
  for (var i = 0; i < tl.length; i++) {
    output += "<li>" + tl[i].position + " " + tl[i].title + " " + tl[i].duration + "</li>";
  }  
  return output + "</ul></div>";
}

function genAlbumDetails(listing, release) {
  var condition = listing.comments.split("..");	
  var conditionOut = "<ul><li>" + condition[0] + "</li>";
  if (condition.length > 1) {
    conditionOut += "<li>" + condition[1] + "</li>";
  }
  var labelText = null;
  
  if (release.labels.length > 0) {
  	labelText = release.labels.map(function (l) { return l.name + " -- " + l.catno }).toString();
  } else {
  	labelText = "";
  }

  var year = null;
  if (release.year) { year = release.year + " " }
  else year = "";

  var output = "<div><div><h2>" + listing.release.description + "</h2>" + year + labelText + "</div><div>"  + conditionOut + "</div></div>";

  return output;
}

function onDelete() {
   var checkedItems = $("input[name=item]:checked");
   for (var i = 0; i < checkedItems.length; i++) {
      
   } 
}

