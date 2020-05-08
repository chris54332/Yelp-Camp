(() =>{
  let downloadFileButton = document.getElementById('file-download');
  let fileInput = document.getElementById('pdf-input');
  let fileCatcher = document.getElementById('pdf-form');
  let fileListDisplay = document.getElementById('file-list-display');
  let docType = document.getElementsByName('doc-type');
  let buttonProperty = document.getElementById('processingButton');
  let radioFlag = '';
  let fileList = [];
  let renderFileList, sendFile;
  let isFileFormatPDF = true;
  let isParserRunning = false;
  let isButtonDisplayed = false;

  document.addEventListener('click',(e)=>{
    if(e.target && e.target.id== 'downloadZip'){
      const url = "http://localhost:3000/parsing-in-progress/example.zip";
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.setAttribute('href', url);
      a.download = "example.zip";
      a.click();
    }
  });
  
  fileCatcher.addEventListener('submit', (evnt) =>{
      for( let i = 0; i < 2; i++){
        if(docType[i].checked){
          radioFlag = docType[i].value;
        }
      }
      evnt.preventDefault();
      if(fileList.length === 0){
        alert("ADD FILES FIRST!(PDF ONLY)");
      }else if(radioFlag === ''){
        alert("SELECT DOCUMENT TYPE");
      }else{
        if(!isParserRunning){
          buttonProperty.className = "btn btn-warning";
          buttonProperty.textContent = "Loading...";
          uploadFiles();
        }
        else{
          alert("PROCESS HAS ALREADY STARTED");
        }
      }
  });
  //upload and processing requests to the server
  function uploadFiles(){
    isParserRunning = true;
    let filesUploaded = 0;
    fileList.forEach((file)=>{
      sendFile(file,()=>{
        filesUploaded++;
      });
    });
    if(filesUploaded == fileList.length){
      var request = new XMLHttpRequest();
      let newUrl = "http://localhost:3000/parsing-in-progress?flag=" + radioFlag; 
      request.open('GET', newUrl);
      request.send();
      request.onload = ()=>{
        if (request.status != 200) { // analyze HTTP status of the response
          alert(`Error ${request.status}: ${request.statusText}`); // e.g. 404: Not Found
        } else { // show the result
          buttonProperty.className = "btn btn-info";
          buttonProperty.textContent = "Parse Files";
          alert("Process finished.");
          if(!isButtonDisplayed){
            let newDownloadButton = document.createElement("button");
            newDownloadButton.setAttribute('type','submit');
            newDownloadButton.setAttribute('class', 'btn btn-success' );
            newDownloadButton.setAttribute('id','downloadZip');
            newDownloadButton.setAttribute('style', 'margin: -3.4em 0 0 7em;');
            newDownloadButton.innerHTML = "Download ZIP";
            downloadFileButton.appendChild(newDownloadButton);
            isButtonDisplayed = true;
          }
          isParserRunning = false;
        }
      };
      request.onerror = ()=>{
        alert("Request failed");
      };
    }
  }
  //Incrementing fileList
  fileInput.addEventListener('change', (evnt)=>{
    fileList = [];
    isFileFormatPDF = true;
    for (var i = 0; i < fileInput.files.length; i++) {
        if(fileInput.files[i].name.substr(fileInput.files[i].name.length - 4) == ".pdf")
        fileList.push(fileInput.files[i]);
        else{
          isFileFormatPDF = false;
        }
    }
    if(!isFileFormatPDF){
      alert("FILE FORMAT NOT SUPPORTED");
    }else{
      renderFileList();
    }
   });
  
  //List of all the documents added
  renderFileList = ()=>{
    fileListDisplay.innerHTML = '';
    fileList.forEach((file, index) =>{
      var fileDisplayEl = document.createElement('li');
      fileDisplayEl.setAttribute('class','list-group-item');
      fileDisplayEl.innerHTML = (index + 1) + ': ' + file.name;
      fileListDisplay.appendChild(fileDisplayEl);
    });
  };
  //Sends each added file in parallel
  sendFile = (file,callback)=>{
    var formData = new FormData();
    var request = new XMLHttpRequest();
    formData.set('file', file);
    let newUrl = "http://localhost:3000/upload?flag=" + radioFlag; 
    request.open('POST', newUrl);
    request.send(formData);
    callback();
  };
  
  })();