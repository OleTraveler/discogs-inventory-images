
$('table.sell > thead > tr').append("<th>IMG</th>");

var dbx = new Dropbox({ accessToken: accessToken });

function uploadToDropbox(file, itemNumber) {
  var itemFolder = "/" + itemNumber;

  //First we create the folder /itemNumber if it doesn't exist
  function isItemNumberFolder(x) {
    return x.path_lower === itemFolder; 
  }

  var filePath = filePath(itemFolder) + file.name;
  console.log("starting upload of " + filePath);
  dbx.filesUpload({path: filePath, contents: file})
    .then(function(response) {
      console.log('finished upload of filePath: ' + filePath + ':' + response);
      updateUploadHtml(itemNumber);
    })
    .catch(function(error) {
      console.error(error);
    });

}

function initUpload(dragToElement, itemNumber) {
  dragToElement.ondragenter = dragToElement.ondragover = function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    return false;
  }


  dragToElement.ondrop = function (e) {
    var funcItemNumber = itemNumber;
    // e.dataTransfer is a DataTransfer object (https://developer.mozilla.org/En/DragDrop/DataTransfer), e.dataTransfer.files is a FileList object (https://developer.mozilla.org/en/DOM/FileList)
    for (var i = 0; i < e.dataTransfer.files.length; i++) {
      var file = e.dataTransfer.files[i]; // file is a File object (https://developer.mozilla.org/en/DOM/File)
      uploadToDropbox(file, itemNumber);
    }

    e.preventDefault();
    return false;
  }
}

function addImage(tr) {
  var itemNumber = $(tr).children('td:nth-child(2)').text()
  if (itemNumber !== null) {
    itemNumber = itemNumber.trim();
    var html = '<div id="uploadItem' + itemNumber + '" style="width: 100%; border: 1px solid blue">Drop here</div>'

    $(tr).children('td:last').html(html);
    initUpload(document.getElementById('uploadItem' + itemNumber), itemNumber);

  }
}

function filePath(itemNumber) {
  return itemFolder = "/" + itemNumber + "/images/";
}

function updateUploadHtml(itemNumber) {
  var element = document.getElementById('uploadItem' + itemNumber);
  if (element) {
    var path = filePath(itemNumber);
    dbx.filesListFolder({path: path})
      .then(function(response) {
        $(element).html('<a href="https://www.dropbox.com/home/Apps/discogs-inventory-images' + path + '">DB</a>');
        $(element).append('<ul>');
        for (var i = 0; i < response.entries.length; i++) {
          console.log(response.entries[i]);
          $(element).append('<li>' + response.entries[i].name + '</li>');
        }
        $(element).append('</ul>');
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
