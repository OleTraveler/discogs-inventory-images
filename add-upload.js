
$('table.sell > thead > tr').append("<th>Dropbox Images</th>");

var dbx = new Dropbox({ accessToken: accessToken });

function filePath(itemNumber) {
  return itemFolder = "/" + itemNumber + "/images";
}

function uploadToDropbox(file, itemNumber) {

  var fp = filePath(itemNumber) + "/" + file.name;
  console.log("starting upload of " + fp);
  dbx.filesUpload({path: fp, contents: file})
    .then(function(response) {
      console.log('finished upload of filePath: ' + fp + ':' + response);
      updateUploadHtml(itemNumber);
    })
    .catch(function(error) {
      console.error(error);
    });

}

function initUpload(dragToElement, itemNumber) {
  dragToElement.style="border:solid";
  dragToElement.ondragenter = dragToElement.ondragover = function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    e.style="border-color:green";
    return false;
  }


  dragToElement.ondrop = function (e) {
    e.preventDefault();
    var funcItemNumber = itemNumber;
    // e.dataTransfer is a DataTransfer object (https://developer.mozilla.org/En/DragDrop/DataTransfer), e.dataTransfer.files is a FileList object (https://developer.mozilla.org/en/DOM/FileList)
    for (var i = 0; i < e.dataTransfer.files.length; i++) {
      var file = e.dataTransfer.files[i]; // file is a File object (https://developer.mozilla.org/en/DOM/File)
      uploadToDropbox(file, itemNumber);
    }

    return false;
  }
}

/** Adds the 'Drop Here' message to the sell page.*/
function addImage(tr) {
  var itemNumber = $(tr).children('td:nth-child(2)').text()
  if (itemNumber !== null) {
    itemNumber = itemNumber.trim();
    var html = '<div id="uploadItem' + itemNumber + '" style="width: 100%; border: 1px solid blue">Drop here</div>'

    $(tr).children('td:last').html(html);
    initUpload(document.getElementById('uploadItem' + itemNumber), itemNumber);

  }
}


function updateUploadHtml(itemNumber) {
  var element = document.getElementById('uploadItem' + itemNumber);
  if (element) {
    var path = filePath(itemNumber) ;
    dbx.filesListFolder({path: path + "/"})
      .then(function(response) {
	dbx.sharingCreateSharedLink({path:path}).then(function(response2) {
          $(element).html('<a href="https://www.dropbox.com/home/Apps/discogs-inventory-images' + path + '">DB</a> ');
	  var copyFrom = $('<span>CP </span>');
	  $(element).append(copyFrom);
	  //clicking on the CP copies the URL to the clipboard.
	  copyFrom.click(function() { 
	    var $temp = $("<input>");
	    $("body").append($temp);
	    $temp.val(response2.url).select();
	    document.execCommand("copy");
	   $temp.remove();
	  }); 
	  $(element).append("<span>" + response.entries.length + " files</span>");
          
	  
          $(element).mouseover(function(event) {
            $('<div id="tooltip' + itemNumber + '"></div>').appendTo('body');
	    var div = document.getElementById("tooltip" + itemNumber);
            $(div).append('<ul>');
	    var ul = $(div).find('ul');
            for (var i = 0; i < response.entries.length; i++) {
              $(ul).append('<li>' + response.entries[i].name + '</li>');
            }
	    var tPosX = event.pageX - 10;
	    var tPosY = event.pageY - 100;
	    $('div.tooltip').css({'position': 'absolute', 'top': tPosY, 'left': tPosX});
          }).mouseout(function(){
            //create a hidefunction on the callback if you want
	   $('#tooltip' + itemNumber).remove();
          });

          
        });
      })
      .catch(function(error) {
        console.error(error);
      }); 
  }

}

var tr = $('table.sell > tbody > tr').append('<td>') ;

for (var i = 0; i < tr.length; i++) {
  addImage(tr[i]);
}



function initialFileList() {
  dbx.filesListFolder({path: ''})
    .then(function(response) {
      for (var i = 0; i < response.entries.length; i++) {
        updateUploadHtml(response.entries[i].name);
      }
    })
    .catch(function(error) {
      console.error(error);
    });  
}

initialFileList();


function uploadFile(itemNumber, form) {
  var dbx = new Dropbox({ accessToken: accessToken, clientId: CLIENT_ID });

  var fileInput = form.getElementByClassName('file-upload');
  var file = fileInput.files[0];

  dbx.filesUpload({path: '/' + itemNumber + '/' + file.name, contents: file})
    .then(function(response) {
    })
    .catch(function(error) {
      console.error('error' + error);
    });
  return false;
}
