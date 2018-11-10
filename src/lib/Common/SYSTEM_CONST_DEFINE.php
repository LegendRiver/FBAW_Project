<?php

    define("DB_CHARSET", "utf8");

    /* 系统默认配置 */
    define('APP_NAME',"ELISystem");
    define('SystemConfFile',"system.conf");
    define('SystemConfDir',"conf");
    define('LOG_ROOT_PATH', "");
    define('DefaultLogPath',"log");
    define('LogFile',"message.log");

    /* 配置文件配置项列表 */
    define('DbServerIp',"DbServerIp");
    define('DbServerPort',"DbServerPort");
    define('DbUserId',"DbUserId");
    define('DbUserPassword',"DbUserPassword");
    define('DbDatabaseName',"DbDatabaseName");
    define('UploadFileStorePath',"UploadFileStorePath");
    define('ReportStorePath',"ReportStorePath");
    define('LogTarget',"LogTarget");
    define('LogPath',"LogPath");
    define('LogLevel',"LogLevel");

    define('SYSLOG',0);
    define('PHPLOG',1);

    /* 错误日志等级 */
    define('Emergency',0);
    define('Alert',1);
    define('Critical',2);
    define('Error',3);
    define('Warning',4);
    define('Notic',5);
    define('Info',6);
    define('Debug',7);
    define('DefaultLogLevel', Debug);

    /* 常用字符串,用于配置文件解析 */
    define('EqualSign',"=");//配置项分隔符,KEY=VALUE
    define('NoteSign',"#");//注释符,该字符开始的行为注释行

    define('SERVICE_NAME', 'SERVICE_NAME');
    define('CLASS_INSTANCE', 'CLASS_INSTANCE');
    define('FUNCTION_NAME', 'FUNCTION_NAME');

    define('ELI_ACCOUNT_MANAGER_SERVICE', 'EliAccountManagerService');//eli account manager service
    define('ELI_SYSTEM_MANAGER_SERVICE', 'EliSystemManagerService');//eli system manager service
    define('ELI_ACCOUNT_RESOURCE_UPLOAD_SERVICE', 'EliAccountResourceUploadService');//eli account resource upload service
    define('ELI_SECURITY_SERVICE', 'EliSecurityService');//eli verification service
    define('ELI_REPORT_SERVICE', 'EliReportService');//eli report service

    define('PARAMETER_CALL_TAG', 'CALL_TAG');//用户AJAX请求标识，用户AJAX数据处理
    define('PARAMETER_ACCESS_TOKEN', 'ELI_SESSION_ACCESS_TOKEN');//用户访问TOKEN
    define('PARAMETER_CLIENT_IP', 'CLIENT_IP');//用户访问IP
    define('PARAMETER_RECHARGE_PASSWORD', 'RECHARGE_PASSWORD');//充值密码
    define('PARAMETER_ELI_ACCOUNT_BALANCE', 'ELI_ACCOUNT_BALANCE');//账户余额
    define('PARAMETER_ELI_ACCOUNT_ID', 'ELI_ACCOUNT_ID');//账户编号
    define('PARAMETER_RECHARGE_AMOUNT', 'RECHARGE_AMOUNT');//充值金额
    define('PARAMETER_ELI_PUBLISHER_SPENT_RECORDS', 'ELI_PUBLISHER_SPENT_RECORDS');//账户消费数据记录
    define('PARAMETER_ELI_CAMPAIGN_CONFIG_SPENT_DATA', 'ELI_CAMPAIGN_CONFIG_SPENT_DATA');//账户消费数据
    define('PARAMETER_ELI_FIELDS', 'FIELDS');//字段定义
    define('PARAMETER_ELI_RECORDS', 'RECORDS');//数据记录集
    define('PARAMETER_ELI_RECORDS_NUMBER', 'NUMBER');//数据记录数
    define('PARAMETER_START_DATE', 'START_DATE');//账户消费开始日期
    define('PARAMETER_END_DATE', 'END_DATE');//账户消费结束日期
    define('PARAMETER_USER_ACCOUNT', 'ACCOUNT');//用户账号
    define('PARAMETER_ELI_PUBLISHER_OWNER_ID', 'ELI_PUBLISHER_OWNER_ID');//Publisher owner id
    define('PARAMETER_ELI_AUDIENCE_TYPE', 'ELI_AUDIENCE_TYPE');//audience type
    define('PARAMETER_ELI_PASSWORD', 'PASSWORD');//password
    define('PARAMETER_ELI_NEW_PASSWORD', 'NEW_PASSWORD');//new password

    define('PARAMETER_ELI_CELL_PHONE', 'CELL_PHONE');//cell phone
    define('PARAMETER_ELI_NEW_CELL_PHONE', 'NEW_CELL_PHONE');//new cell phone

    define("SERVICE_URL_CHECK_USERTOKEN", "http://www.eliads.com:9090/EliSystemManagerService.php");

    define("SERVICE_URL_STRATEGY_SERVER", "http://192.168.1.101/service/SyncInterfaceService.php");
    /* encrypt */
    //define('IV_SIZE', mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC));
    define('ENCRYPT_DEBUG', false);// encrypt debug mode
    define('PARAMETER_ELI_DATA', 'DATA');//encrypt data
    define('PARAMETER_ELI_DATA_BASE64', 'DATA_BASE64');//data base64
    define('PARAMETER_ELI_IV_BASE64', 'IV_BASE64');//iv base64
    define('PARAMETER_ELI_KEY_BASE64', 'KEY_BASE64');//key base64

    /* File upload */
    define('UPLOAD_FILE_MAX_SIZE', (5 * 1024 * 1024));
    define('UPLOAD_SERVER_RESULT_INIT', 0);
    define('UPLOAD_CHUNK', 1);
    define('UPLOAD_END_UPLOAD', 2);

    define('ATTACHMENT_UPLOAD_INIT', 0);
    define('ATTACHMENT_UPLOAD_SUCCESS', 1);
    define('ATTACHMENT_UPLOAD_FAILED', 2);

    define('FILE_URL', 'FILE_URL');
    define('FILE_NAME', 'FILE_NAME');

    /* Account type */
    define('ELI_ACCOUNT_TYPE_COMPANY', 0);
    define('ELI_ACCOUNT_TYPE_PROXY', 1);

    /* Account status */
    define('ELI_ACCOUNT_STATUS_INIT', -1);
    define('ELI_ACCOUNT_STATUS_APPROVE_PASS', 0);
    define('ELI_ACCOUNT_STATUS_WAIT_COMPLETE_INFORMATION', 1);
    define('ELI_ACCOUNT_STATUS_WAIT_APPROVE_INFORMATION', 2);
    define('ELI_ACCOUNT_STATUS_APPROVE_NG', 3);

    /* 用户登录有效期 */
    define('USER_LOGIN_VALIDITY', (7 * 24 * 60 * 60));

    /*用户登录状态*/
    define('USER_ACCESS_TOKEN_STATUS_VALID', 1);
    define('USER_ACCESS_TOKEN_STATUS_INVALID', 2);
    define('USER_ACCESS_TOKEN_STATUS_EXPIRED', 3);

    /* 验证码状态 */
    define('SECURITY_CODE_STATUS_INIT', 0);
    define('SECURITY_CODE_STATUS_VALID', 1);
    define('SECURITY_CODE_STATUS_USED', 2);
    define('SECURITY_CODE_STATUS_EXPIRED', 3);
    define('SECURITY_CODE_STATUS_SEND_FAILED', 4);

    /* 验证码有效期 */
    define('TOPIC_ARN', 'arn:aws:sns:us-west-2:303413143558:ELI_VERIFICATION');
    define('ELI_VERIFICATION_CODE_DEBUG', true);
    define('ELI_VERIFICATION_CODE_VALIDITY', (3 * 60));
    define('ELI_VERIFICATION_CODE_LENGTH', 4);
    define('PARAMETER_ELI_VERIFICATION_TOKEN', 'VERIFICATION_TOKEN');
    define('PARAMETER_ELI_VERIFICATION_CODE', 'VERIFICATION_CODE');


    /* 系统用户状态 */
    define('SYSTEM_USER_NORMAL', 0);
    define('SYSTEM_USER_DISABLED', 1);
    define('SYSTEM_USER_DELETED', 2);

    /* campaign status */
    define('ELI_CAMPAIGN_ACTIVE', 0); //active
    define('ELI_CAMPAIGN_COMPLETE', 1);//pause
    define('ELI_CAMPAIGN_DELETE', 2);//delete
    define('ELI_CAMPAIGN_ARCHIVE', 3);//archive


    define('ELI_CAMPAIGN_SYNC_INIT', 999);//init
    define('ELI_CAMPAIGN_SYNC_SUCCESS', 1000);//1000 + 0
    define('ELI_CAMPAIGN_SYNC_FAILED', 1001);//1000 + 1
    define('ELI_CAMPAIGN_SYNC_UNKNOWN', 1002);

    /* Campaign type */
    define('CAMPAIGN_TYPE_APP', 0);
    define('CAMPAIGN_TYPE_WEBSITE', 1);


    /* Eli audience type */
    define('AUDIENCE_TYPE_UNKNOWN', -1);
    define('AUDIENCE_TYPE_GENDER', 0);
    define('AUDIENCE_TYPE_AGE', 1);
    define('AUDIENCE_TYPE_LOCATION', 2);

    define('GENDER_ALL', 'All');
    define('GENDER_MALE', 'Male');
    define('GENDER_FEMALE', 'Female');

    /* AWS CLIENT */
    define('DISPLAY_NAME', 'ELIADS');
    define('TOPIC_NAME','ELI_VERIFICATION');
    define('VERIFICATION_CODE_SMS_TEMPLATE', '您的手机动态码：%s，此密码用于用户注册验证，请勿向任何单位或个人泄漏。');
?>