/**
 * Created by yangtian on 10/01/16.
 */

function CFileUpload()
{
    BiComponent.call(this); //call super

    this.__PARAMETER_SERVICE_NAME = "SERVICE_NAME";
    this.__PARAMETER_CLASS_INSTANCE = "CLASS_INSTANCE";
    this.__PARAMETER_FUNCTION_NAME = "FUNCTION_NAME";
    this.__PARAMETER_CALL_TAG = "CALL_TAG";
    this.__PARAMETER_ELI_SESSION_ACCESS_TOKEN = "ELI_SESSION_ACCESS_TOKEN";
    this.__PARAMETER_FILE_NAME = "NAME";
    this.__PARAMETER_MD5_NAME = "MD5";
    this.__PARAMETER_SIZE_NAME = "SIZE";
    this.__PARAMETER_TYPE_NAME = "TYPE";
    this.__PARAMETER_TOTAL_CHUNKS_NAME = "TOTAL_CHUNKS";

    this.__ServerURL = "";
    this.__ServiceName = "EliAccountResourceUploadService";
    this.__ClassInstance = "CFile";
    this.__StartUplaodFunctionName = "startUpload";
    this.__callTagInitUpload = "InitUploadFile";
    this.__CallTagUploadChunk = "uploadChunk";
    this.__CallTagEndUpload = "endUpload";

    this.__AccessToken = null;


}

CFileUpload.prototype = new BiComponent;
CFileUpload.prototype._className = "CFileUpload";
CFileUpload.UPLOAD_SERVER_RESULT_INIT = 0;
CFileUpload.UPLOAD_CHUNK=1;
CFileUpload.END_UPLOAD=2;

CFileUpload.prototype.initObject = function(parent, application) {
    this.__EliApplication = application;

    this.__FileInputControlId = newGuid();
    this.__FileObject = null;
    this.__SelectedFile = null;
    this.__Parent = parent;
    this.__ErrorLabel = null;

    this.__FileSelectComponent = null;
    this.__UploadButtonComponent = null;
    this.__ProcessProgressBarComponent = null;
    this.__ProcessProgressLabelComponent = null;
    this.__FileInfoComponent = null;
    this.__FileNameLabel = null;
    this.__ErrorMessageLabel = null;
    this.__FileMd5Label = null;
    this.__ErrorMessageBox = null;
    this.__InfoMessageBox = null;

    this.__IsAllowUpload = true;
    this.__UploadBitMap = null;
    this.__UploadSessionId = null;
    this.__FileId = null;
    this.__ExtractInfoUrl = null;
    this.__ExtractFileName = null;
    this.__BlobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
    this.__CHUNK_SIZE = (1 * 1024 * 1024);
    this.__FileChunkNumber = 0;
    this.__CurrentChunkIndex = 0;
    this.__FileChunks = null;
    this.__FileMd5 = "正在计算......";
    this.__IsReadComplete = false;
    this.__IsUploadComplete = false;
    this.__FileReader = null;
    this.__SparkArrayBuffer = null;

    this.UPLOAD_FILE_MAX_SIZE = (1 * 1024 * 1024 * 1024);
    this.__START_UPLOAD_FUNCTION = "startUpload";





    this.__UPLOAD_CHUNK_FUNCTION = "uploadBlock";

    this.__PARAMETER_UPLOAD_SESSION_ID = "UPLOAD_SESSION_ID";
    this.__PARAMETER_FILE_CHUNK_INDEX = "CHUNK_INDEX";
    this.__PARAMETER_FILE_CHUNK_POS = "CHUNK_POS";
    this.__PARAMETER_FILE_CHUNK_SIZE = "CHUNK_SIZE";
    this.__PARAMETER_FILE_CHUNK_DATA = "CHUNK_DATA";

    this.__END_UPLOAD_FUNCTION = "endUpload";
    //this.__ErrorMessageBox = this.__ControlDef.ErrorMessageBox;
    //this.__InfoMessageBox = this.__ControlDef.InfoMessageBox;

    this.__METHOD_TYPE = "POST";
    this.__AjaxClient = null;

    this.__SuccessImgHash = new BiHashTable();
    this.__init();
};

CFileUpload.prototype.__init = function()
{
    this.setId(newGuid());
    this._serviceURL();
    this.__AjaxClient = new CAjax(this.__ServerURL, this.__METHOD_TYPE, this);
    this.__FileChunks = [];
    this.__UploadBitMap = [];
    this.__initFileSelectComponent();
    this.__initImgLabelHash();

    //this.__initFileInfoComponent();
};

CFileUpload.prototype._serviceURL = function()
{
    if(DEBUG)
    {
        this.__SERVICE_URL = ONLINE_SERVICE_URL;
    }
    else{
        this.__SERVICE_URL = OFFLINE_SERVICE_URL;
    }
};

CFileUpload.prototype.__initFileSelectComponent = function()
{
    this.__FileSelectComponent = new BiComponent();
    this.__FileSelectComponent.setId(newGuid());
    this.__FileSelectComponent.setCssClassName("eli-uploader-container");
    this.__FileSelectComponent.setLeft(0);
    this.__FileSelectComponent.setTop(0);
    this.__FileSelectComponent.setHtmlProperty("innerHTML", '<input id="uploadFile"  placeholder="" class="eli-file-name-box"' +
            ' disabled="disabled"/><div class="fileUpload btn btn-primary">' +
            '<span id="uploadButton" class="upload-label">选择文件</span>' +
            '<input id="uploadBtn" type="file" class="upload" /></div>');
    this.add(this.__FileSelectComponent);

    this.__FileNameLabel = new BiLabel();
    this.__FileNameLabel.setId(newGuid());
    this.__FileNameLabel.setCssClassName("upload-placeholder-text");
    this.__FileNameLabel.setStyleProperty("top", sprintf("%d%s", 0,"px"));
    this.__FileNameLabel.setStyleProperty("left", sprintf("%d%s", 0,"px"));
    this.__FileNameLabel.setBottom(0);
    this.__FileNameLabel.setStyleProperty("right", sprintf("%d%s", 20,"%"));
    this.__FileNameLabel.setText("请上传营业执照照片，小于1M");
    this.add(this.__FileNameLabel);

    this.__UploadButtonComponent = new BiLabel();
    this.__UploadButtonComponent.setId(newGuid());
    this.__UploadButtonComponent.setText("上传文件");
    this.__UploadButtonComponent.setCssClassName("upload-after-select-file");
    this.__UploadButtonComponent.setStyleProperty("right", sprintf("%d%s", 80,"%"));
    this.__UploadButtonComponent.setStyleProperty("top", sprintf("%d%s", 0,"%"));
    this.__UploadButtonComponent.setStyleProperty("width", sprintf("%d%s", 20,"%"));
    this.__UploadButtonComponent.setStyleProperty("height", sprintf("%d%s", 100,"%"));
    this.__UploadButtonComponent.addEventListener("click", function(event){
        this.__uploadFile();
    }, this);
    this.__UploadButtonComponent.setVisible(false);
    this.add(this.__UploadButtonComponent);
};

CFileUpload.prototype.getUploadButton = function()
{
    return this.__UploadButtonComponent;
};

CFileUpload.prototype.setFileSelectComponentCaller = function()
{
    this.__FileObject = document.getElementById("uploadBtn");
    if(this.__FileObject)
    {
        this.__FileObject.Caller = this;
        this.__FileObject.addEventListener("change", function(event){
            var caller = this.Caller;
            caller.onFileSelected(caller);
        }, this);
    }
};

CFileUpload.prototype.getControlType = function()
{
    return this.__ControlDef.ControlType;
};


CFileUpload.prototype.onFileSelected = function(caller)
{
    caller.__calFileMd5();
};

CFileUpload.prototype.__calFileMd5 = function()
{
    this.__FileChunks = [];
    this.__UploadBitMap = [];
    
    this.__FileObject = document.getElementById("uploadBtn");

    if(!this.__FileObject)
    {
        return;
    }

    this.__SelectedFile = this.__FileObject.files[0];
    if(this.__SelectedFile.size > this.UPLOAD_FILE_MAX_SIZE)
    {
        this.__IsAllowUpload = false;
        this.__showFileInfo();
        return;
    }

    this.__IsAllowUpload = true;
    this.__CurrentChunkIndex = 0;
    this.__IsUploadComplete = false;
    this.__IsReadComplete = false;
    this.__FileChunkNumber = 0;
    if(this.__SparkArrayBuffer)
    {
        this.__SparkArrayBuffer.destroy();
    }
    this.__SparkArrayBuffer = null;
    this.__FileChunks = [];

    this.__showFileInfo();
    this.__readAndCalFileMd5();
};

CFileUpload.prototype.__readAndCalFileMd5 = function()
{
    if(!this.__SelectedFile)
    {
        return;
    }

    this.__UploadButtonComponent.setEnabled(false);
    this.__FileChunkNumber = Math.ceil(this.__SelectedFile.size / this.__CHUNK_SIZE);
    this.__CurrentChunkIndex = 0;
    this.__SparkArrayBuffer = new SparkMD5.ArrayBuffer();
    this.__FileReader = new FileReader();
    this.__FileReader.Caller = this;
    this.__FileReader.onload = function(event)
    {
        var data = event.target.result;
        this.Caller.processLoadEvent(data);
    };

    this.__FileReader.onerror = function () {
        this.__UploadButtonComponent.setEnabled(false);
        this.__UploadButtonComponent.setVisible(false);
    };
    this.loadNextChunk();
};

CFileUpload.prototype.loadNextChunk = function()
{
    var start = this.__CurrentChunkIndex * this.__CHUNK_SIZE;
    var end = (start + this.__CHUNK_SIZE >= this.__SelectedFile.size ? this.__SelectedFile.size : start + this.__CHUNK_SIZE);
    var fileChunk = new CFileChunk();
    fileChunk.ChunkIndex = this.__CurrentChunkIndex;
    fileChunk.BlockSize = (end - start);
    fileChunk.Pos = start;
    fileChunk.BlockData = null;
    this.__FileChunks.push(fileChunk);
    this.__FileReader.readAsArrayBuffer(this.__BlobSlice.call(this.__SelectedFile, start, end));
};

CFileUpload.prototype.updateReadProgress = function()
{
    this.__ProcessProgressBarComponent.setValue(this.__CurrentChunkIndex + 1);
    this.__ProcessProgressLabelComponent.setText(sprintf("%d%s",
        ((this.__CurrentChunkIndex + 1) * 100)/ this.__FileChunkNumber, "%"));
};

CFileUpload.prototype.updateUploadProgress = function(chunkIndex)
{
    this.__ProcessProgressBarComponent.setValue(chunkIndex + 1);
    this.__ProcessProgressLabelComponent.setText(sprintf("%d%s",
        ((chunkIndex + 1) * 100)/ this.__FileChunkNumber, "%"));
};

CFileUpload.prototype.processLoadEvent = function(chunkData)
{
    this.__SparkArrayBuffer.append(chunkData);                 // append array buffer
    this.__FileChunks[this.__CurrentChunkIndex].BlockData = chunkData;
    this.__CurrentChunkIndex += 1;
    if (this.__CurrentChunkIndex < this.__FileChunkNumber) {
        this.loadNextChunk();
    } else {
        this.__IsReadComplete = true;
        this.__UploadButtonComponent.setEnabled(this.__IsReadComplete);
        this.__UploadButtonComponent.setVisible(this.__IsReadComplete);

        this.__FileMd5 = this.__SparkArrayBuffer.end();
        this.__UploadBitMap = [];
        this.__showFileInfo();
        this.__Parent.getFileUploadMsgLabel().setText("点击上传文件按钮");
    }
};

CFileUpload.prototype.__showFileInfo = function()
{

    //this.__FileNameLabel.setText(sprintf("文件名:%s", this.__SelectedFile.name));

    //this.__FileNameLabel = document.getElementById("uploadFile");
    this.__FileNameLabel.setText(sprintf("%s", this.__SelectedFile.name));
    this.__ErrorLabel = this.__Parent.getFileUploadMsgLabel();
    this.__ErrorLabel.setText("");
    if(!this.__IsAllowUpload)
    {
       // this.__ErrorLabel.setText(sprintf("文件大小超过限定值,最大上传文件大小:%d字节,%dMB字节",
         //   this.UPLOAD_FILE_MAX_SIZE, (this.UPLOAD_FILE_MAX_SIZE/ 1024 /1024)));
        this.__ErrorLabel.setText("文件大小超限");
        this.__ErrorLabel.setForeColor("#FF0000");
        return 1;
        //this.__FileMd5Label.setText(sprintf("检验值:%s", ""));
    }
    return 0;
    /*else
    {
        this.__ErrorLabel.setText(sprintf("大小:%d字节 分块数量:%d 分块大小:%d字节",
            this.__SelectedFile.size, this.__FileChunkNumber, this.__CHUNK_SIZE));
        this.__ErrorLabel.setForeColor("#000000");
        this.__FileMd5Label.setText(sprintf("检验值:%s", this.__FileMd5));
    }*/
};

CFileUpload.prototype.__uploadFile = function()
{
    //this.__ProcessProgressBarComponent.setValue(0);
    //this.__ProcessProgressLabelComponent.setText("");
    if(!this.__IsReadComplete)
    {
        return;
    }

    this.__UploadButtonComponent.setEnabled(false);
    this.__AccessToken = this.__EliApplication.getAccessToken();
    this.__initUploadBitMap();
    this.__initUploadSession(this.__callTagInitUpload, this.__AccessToken, this.__SelectedFile.name,
        this.__FileMd5, this.__SelectedFile.size, this.getFileType(), this.__FileChunkNumber);
};

CFileUpload.prototype.__initUploadBitMap = function()
{
    for(var index = 0; index < this.__FileChunkNumber; ++index)
    {
        this.__UploadBitMap[index] = false;
    }
};

CFileUpload.prototype.__initUploadSession = function(callTag, accessToken, fileName, md5, size, type, chunks)
{
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__StartUplaodFunctionName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FILE_NAME, fileName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_MD5_NAME, md5);
    this.__AjaxClient.registerParameter(this.__PARAMETER_SIZE_NAME, size);
    this.__AjaxClient.registerParameter(this.__PARAMETER_TYPE_NAME, type);
    this.__AjaxClient.registerParameter(this.__PARAMETER_TOTAL_CHUNKS_NAME, chunks);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, callTag);
    this.__AjaxClient.registerParameter(this.__PARAMETER_ELI_SESSION_ACCESS_TOKEN, accessToken);

    this.__AjaxClient.callAjax();
};

CFileUpload.prototype.getFileType = function()
{
    var fileType = this.__SelectedFile.type;
    if(fileType.trim().length == 0)
    {
        return "UNKNOWN";
    }

    return fileType.replace("/", "_").toUpperCase();
};

CFileUpload.prototype.setData = function(data)
{
    var resultValue = null;
    try
    {
        resultValue = eval('(' + data + ')');
    }
    catch (e)
    {
        writeLogMessage("ERROR", sprintf("[<%s>%s]","Invalid data,error message",e.message));
        return;
    }

    switch (resultValue.data.UPLOAD_STATUS)
    {
        case CFileUpload.UPLOAD_SERVER_RESULT_INIT:
            this.__processInitUpload(resultValue);
            break;
        case CFileUpload.UPLOAD_CHUNK:
            this.__processUploadChunk(resultValue);
            break;
        case CFileUpload.END_UPLOAD:
            this.__processEndUpload(resultValue);
            break;
        default :
            writeLogMessage("ERROR", sprintf("Unknown type <%d>", resultValue.UPLOAD_STATUS));
            this.__uploadError();
            break;
    }

    return;
};

CFileUpload.prototype.__uploadError = function()
{
    this.__Parent.getFileUploadMsgLabel().setText("文件上传失败，请重新上传");
    this.__UploadButtonComponent.setEnabled(true);
    this.__UploadButtonComponent.setVisible(false);
};

CFileUpload.prototype.__processInitUpload = function(resultObject)
{
    var errorCode = parseInt(resultObject.errorCode);
    if(errorCode != 0)
    {
        this.__ErrorMessageLabel.setText(sprintf("上传文件初始化失败,错误信息:%s", resultObject.message));
        this.__ErrorMessageLabel.setForeColor("#FF0000");
        //this.__ErrorMessageBox.showMessage("错误信息","文件上传初始化失败!");
        //this.__ErrorMessageBox.setVisible(true);
        return;
    }

    this.__UploadSessionId = resultObject.data.SESSION_ID;
    this.__ExtractInfoUrl = resultObject.data.EXTRACT_FILE_URL;
    this.__ExtractFileName = resultObject.data.EXTRACT_FILE;
    this.__FileId = resultObject.data.ID;
    this.__Parent.setBusinessLicence(this.__FileId);
    this.__CurrentChunkIndex = 0;
    this.__uploadFileChunk();
    return;
};

CFileUpload.prototype.__uploadSuccess = function()
{
    var label = this.__SuccessImgHash.item("uploadFile");
    this.__Parent.getFileUploadMsgLabel().setVisible(false);
    this.__Parent.setUploadSuccessLabelVisible(label,true);
};

CFileUpload.prototype.__processEndUpload = function(resultObject)
{
    var errorCode = parseInt(resultObject.errorCode);
    if(errorCode != 0)
    {
        this.__ErrorMessageLabel.setText(sprintf("上传文件初始化失败,错误信息:%s!", resultObject.message));
        this.__ErrorMessageLabel.setForeColor("#FF0000");
        //this.__ErrorMessageBox.showMessage("错误信息","文件上传失败!");
        //this.__ErrorMessageBox.setVisible(true);
        return;
    }

    this.__uploadSuccess();


    //this.__FileId = resultObject.data.ID;
    //this.__Parent.setBusinessLicence(this.__FileId);
    //this.__ExtractInfoUrl = resultObject.data.EXTRACT_FILE_URL;
    //this.__ExtractFileName = resultObject.data.EXTRACT_FILE;

    //downloadFile(this.__ExtractInfoUrl, this.__ExtractFileName);
    return;
};

CFileUpload.prototype.getFileName = function()
{
    return this.__SelectedFile.name;
};

CFileUpload.prototype.getFileId = function()
{
    return this.__FileId;
};

CFileUpload.prototype.__initImgLabelHash = function()
{
    this.__SuccessImgHash = this.__Parent.getUploadSuccessLabelHash();
}

CFileUpload.prototype.__processUploadChunk = function(resultObject)
{
    var chunkIndex = parseInt(resultObject.data.CHUNK_INDEX);
    var errorCode = parseInt(resultObject.errorCode);
    if(errorCode != 0)
    {
        this.__ErrorMessageLabel.setText(sprintf("文件分片索引:%04d上传失败,错误信息:%s!", chunkIndex, resultObject.message));
        this.__ErrorMessageLabel.setForeColor("#FF0000");
        this.__UploadBitMap[chunkIndex] = false;
       /** this.__ErrorMessageBox.showMessage("错误信息",
            sprintf("文件分片索引:%04d上传失败,错误信息:%s!", chunkIndex, resultObject.message));
        //this.__ErrorMessageBox.setVisible(true);*/
        return;
    }

    //this.updateUploadProgress(chunkIndex);
    this.__UploadBitMap[chunkIndex] = true;
    this.__checkIsUploadComplete();
};

CFileUpload.prototype.__uploadFileChunk = function()
{
    var fileChunk = this.__FileChunks[this.__CurrentChunkIndex];
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__UPLOAD_CHUNK_FUNCTION);
    this.__AjaxClient.registerParameter(this.__PARAMETER_UPLOAD_SESSION_ID, this.__UploadSessionId);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FILE_CHUNK_INDEX, fileChunk.ChunkIndex);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FILE_CHUNK_POS, fileChunk.Pos);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FILE_CHUNK_SIZE, fileChunk.BlockSize);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FILE_CHUNK_DATA, this.__arrayBufferToBase64(fileChunk.BlockData));
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, this.__CallTagUploadChunk);
    this.__AjaxClient.callAjax();
};

CFileUpload.prototype.__arrayBufferToBase64=function( arrayBuffer )
{
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var lookup = new Uint8Array(256);
    for (var i = 0; i < chars.length; i++) {
        lookup[chars.charCodeAt(i)] = i;
    }

    var bytes = new Uint8Array(arrayBuffer),
        i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
        base64 += chars[bytes[i] >> 2];
        base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
        base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
        base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
        base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
};

CFileUpload.prototype.__endUpload = function()
{
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__END_UPLOAD_FUNCTION);
    this.__AjaxClient.registerParameter(this.__PARAMETER_UPLOAD_SESSION_ID, this.__UploadSessionId);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, this.__CallTagEndUpload);
    this.__AjaxClient.callAjax();
};

CFileUpload.prototype.__checkIsUploadComplete = function()
{
    var isComplete = true;

    for(var index = 0; index < this.__FileChunkNumber; ++index)
    {
        isComplete  = isComplete && this.__UploadBitMap[index];
    }

    this.__IsUploadComplete = isComplete;
    if(this.__IsUploadComplete)
    {
        this.__endUpload();
        return;
    }
    else
    {
        this.__CurrentChunkIndex += 1;
        this.__uploadFileChunk();
    }

    return;
};