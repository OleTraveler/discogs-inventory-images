
function filePath(itemNumber) {
  return itemFolder = "/" + itemNumber + "/images/";
}

/**
* dragToElement - The element to enable to drag file to feature.
* itemNumber - The discog inventory item number, will be used to upload to that directory.
*/
function initUpload(dragToElement, itemNumber, reloadCallback) {

  console.log("dte: " + dragToElement);
  dragToElement.ondragenter = dragToElement.ondragover = function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
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


function uploadToDropbox(file, itemNumber, reloadCallback) {
  var filePath = filePath(itemFolder) + file.name;
  console.log("starting upload of " + filePath);
  dbx.filesUpload({path: filePath, contents: file})
    .then(function(response) {
      console.log('finished upload of filePath: ' + filePath + ':' + response);
      reloadCallback(itemNumber);
    })
    .catch(function(error) {
      console.error(error);
    });

}

