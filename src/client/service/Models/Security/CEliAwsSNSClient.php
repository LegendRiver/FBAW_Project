<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 2016-10-05
 * Time: 20:54
 */
 
 use Aws\Common\Credentials\Credentials;
 use Aws\Sns\SnsClient;

class CEliAwsSNSClient extends CBaseObject
{
    private $AwsSNSClient = null;
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CEliAwsSNSClient";
        $this->TableName = "NONE_TABLE";
        $this->AwsSNSClient = SnsClient::factory(array(
        'credentials'=>[
            'key'    => 'AKIAJ4FURZRP4EKVJDLQ',
            'secret' => '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'],
        'version' => 'latest',
        'region' => 'us-west-2'
        ));

        parent::__construct($config, $log, $dbInterface);
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function sendSms($mobileNumber, $messageContent, &$messageId, &$requestId)
    {   
        $displayName = DISPLAY_NAME;
        $topicArn = TOPIC_ARN;
        $errorCode = $this->setSNSTopicDisplayName($topicArn, $displayName);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error,__FILE__, __FUNCTION__, __LINE__, 
            sprintf("Set sns display name <%s> failed, error code <%d>.", $displayName, $errorCode));
            return $errorCode;
        }

        $subscriptionArn = false;
        $errorCode = $this->subscribeToTopic($topicArn, 'sms', sprintf("+86%s", $mobileNumber), $subscriptionArn);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error,__FILE__, __FUNCTION__, __LINE__, 
            sprintf("Subscribe topic <%s,%s> failed, error code <%d>.", $topicArn, $mobileNumber, $errorCode));
            return $errorCode;
        }
        
        $subscriptionArn = $subscriptionArn['SubscriptionArn'];
        
        $smsAttributes  = array();
        $smsAttributes['SenderID'] = 'ELI';
        $smsAttributes['MonthlySpendLimit'] = '10';
        $smsAttributes['SMSType'] = 'Transactional';
        
        $publishRequest = array();
        $publishRequest['TopicArn'] = $topicArn;
        $publishRequest['Message'] = $messageContent;
        $publishRequest['SmsAttributes'] = $smsAttributes;
        
        try
        {
            $publishResult = $this->AwsSNSClient->publish($publishRequest);
            $messageId = $publishResult['MessageId'];   
            $requestId = $publishResult['ResponseMetadata']['RequestId'];
            $this->Log->writeLog(Info,__FILE__, __FUNCTION__, __LINE__, 
            sprintf("Send message <%s> to <%s,%s,%s> success.",
            $messageContent, $mobileNumber, $messageId, $requestId));
            
            $errorCode = $this->unsubscibe($subscriptionArn);
            
            return OK;
        }
        catch(Exception $ex)
        {
            $this->Log->writeLog(Error,__FILE__, __FUNCTION__, __LINE__, 
            sprintf("Send message <%s> to <%s> failed, error message <%s>.",
            $messageContent, $mobileNumber, $ex->getMessage()));
            return ERR_AWS_CLIENT_SEND_MESSAGE_FAILED;
        }
    }
    
    private function unsubscibe($subscriptionArn)
    {
        try
            {
                $this->AwsSNSClient->unsubscribe(array('SubscriptionArn' => $subscriptionArn));
                return OK;
            }
            catch(Exception $ex)
            {
                $this->Log->writeLog(Error,__FILE__, __FUNCTION__, __LINE__, 
                sprintf("Delete subscribe <%s> failed, error message <%s>.",
                $subscriptionArn, $ex->getMessage()));
                return ERR_AWS_CLIENT_DELETE_SUBSCRIBE_FAILED;
            }
    }

    private function createSNSTopic(&$topicArn) 
    {
        try
        {
            $topicArn = $this->AwsSNSClient->createTopic(array('Name'=>TOPIC_NAME)); 
            return OK;  
        }
        catch(Exception $ex)
        {
            
            return ERR_AWS_CLIENT_CREATE_TOPIC_FAILED;
        }
    }
    
    private function setSNSTopicDisplayName($topicArn, $displayName)
    {
        try
        {
            $this->AwsSNSClient->setTopicAttributes(array(
                                        'TopicArn' => $topicArn,
                                        'AttributeName' => 'DisplayName',
                                        'AttributeValue' => $displayName));
            return OK;
        }
        catch(Exception $ex)
        {
            $this->Log->writeLog(Error,__FILE__, __FUNCTION__, __LINE__, 
            sprintf("Set sns topic displayname failed <%s,%s> failed, error message <%s>.",
            $topicArn, $displayName, $ex->getMessage()));
            return ERR_AWS_CLIENT_SET_TOPIC_DISPLAY_NAME_FAILED;
        }
    }
    
    private function subscribeToTopic($topicArn, $protocol, $endpoint, &$subscriptionArn) 
    {	
        
        try
        {
            $subscriptionArn = $this->AwsSNSClient->subscribe(array('TopicArn'=>$topicArn,
            'Protocol'=>$protocol,
            'Endpoint'=>$endpoint));
            return OK;
        }
        catch(Exception $ex)
        {
            $this->Log->writeLog(Error,__FILE__, __FUNCTION__, __LINE__, 
            sprintf("Create subribe failed <%s,%s,%s> failed, error message <%s>.",
            $topicArn, $protocol, $endpoint, $ex->getMessage()));
            return ERR_AWS_CLIENT_CREATE_SUBCRIBE_FAILED;
        }
    }


    protected function initResultFields()
    {
        // TODO: Implement initResultFields() method.
    }

    protected function initTableFields()
    {
        // TODO: Implement initTableFields() method.
    }
}