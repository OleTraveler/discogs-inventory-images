var dbx = new Dropbox({ accessToken: accessToken });

function filePath(itemNumber) {
  return itemFolder = "/" + itemNumber + "/images/";
}

function uploadToDropbox(file, itemNumber) {

  var fp = filePath(itemNumber) + file.name;
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
    console.log("I");
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    e.style="border-color:green";
    return false;
  }


  dragToElement.ondrop = function (e) {
    e.preventDefault();
    console.log("ondrop");
    var funcItemNumber = itemNumber;
    // e.dataTransfer is a DataTransfer object (https://developer.mozilla.org/En/DragDrop/DataTransfer), e.dataTransfer.files is a FileList object (https://developer.mozilla.org/en/DOM/FileList)
    for (var i = 0; i < e.dataTransfer.files.length; i++) {
      var file = e.dataTransfer.files[i]; // file is a File object (https://developer.mozilla.org/en/DOM/File)
      uploadToDropbox(file, itemNumber);
    }

    return false;
  }
}

function updateUploadHtml(itemNumber) {
  var element = document.getElementById('draghere');
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

var aside = $(".marketplace_aside");

var itemNumber = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

console.log("itemNumber:" + itemNumber);

aside.append('<div style="border:solid" class="section" id="draghere">Drag Here</div>');

var drag = document.getElementById("draghere");

console.log("drag:" + drag);

initUpload(drag, itemNumber);

updateUploadHtml(itemNumber);
