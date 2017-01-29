$( document ).ready(function() {
    document.getElementById("gobutton").addEventListener("click", go);
});

var rootDir = "/Users/tstevens/Dropbox/Apps/discogs-inventory-images/";

function go() {
  var albumDetails = "<font rwr='1' size='4' style='font-family:Arial'><div>";
  var trackList = "<div><div><u>Track List</u></div>";
  var listingIdInput = $("#listingIds").val();
  var listingIds = listingIdInput.split(" ").map(function(s) { return s.trim() });; 
  var img = "<pre>" + genImagikConvert(listingIds) + "</pre>";
  var finders = genFinder(listingIds);
  var listings = listingIds.map(function(listingId) { 
    return Promise.resolve( $.ajax('https://api.discogs.com/marketplace/listings/' + listingId) ).then(function(listing) {
      return Promise.resolve( $.ajax('https://api.discogs.com/releases/' + listing.release.id)).then(function(release) {
        albumDetails = albumDetails + genAlbumDetails(listing, release);
        trackList = trackList + genTrackList(release);
      });
    });
  });

  Promise.all(listings).then(function() {
    trackList = trackList + "</div>";
    albumDetails = albumDetails + "</div></font>";
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

function genTrackList(release) {
  var output = "<div><u>" + release.title + "</u><ul>";
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

