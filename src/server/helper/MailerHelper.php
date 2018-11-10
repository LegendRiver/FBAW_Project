<?php


class MailerHelper
{
    private static $instance = null;

    private $mailer;

    private $signatureImagePath;

    private function __construct()
    {
        $this->initMailer();

        $confDir = EL_SERVER_PATH . BasicConstants::DIRECTORY_CONF . DIRECTORY_SEPARATOR;
        $this->signatureImagePath = $confDir . 'mail_signature.jpg';
    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    private function initMailer()
    {
        $this->mailer = new PHPMailer();
        $this->mailer->isSMTP();
        $this->mailer->Host = 'smtp.mxhichina.com';
        $this->mailer->SMTPAuth = true;
        $this->mailer->Username = 'report@eliads.com';
        $this->mailer->Password = 'Eli16Ads';
        $this->mailer->Port = 465;
        $this->mailer->SMTPSecure = 'ssl';
        $this->mailer->CharSet = 'UTF-8';
        $this->mailer->setFrom('report@eliads.com', 'Report');
        $this->mailer->isHTML(true);
    }

    public function resetAccountInfo($userName, $password, $fromAddress, $fromName='')
    {
        $this->mailer->Username = $userName;
        $this->mailer->Password = $password;
        $this->mailer->setFrom($fromAddress, $fromName);
    }

    public function sendMail($toAddressList, $subject, $message, $ccAddressList = array(),
                             $attachmentFilePath = array(), $signature=BasicConstants::MAIL_SIGNATURE_TYPE_IMAGE)
    {
        $this->addToAddress($toAddressList);
        $this->addCCAddress($ccAddressList);

        $this->mailer->Subject = $subject;

        $appendMessage = $this->appendSignature($signature, $message);
        $this->mailer->Body    = $appendMessage;

        $this->addAttachment($attachmentFilePath);

        if(!$this->mailer->send())
        {
            ServerLogger::instance()->writeLog(Error, 'Mailer Error: ' . $this->mailer->ErrorInfo) ;
            return false;
        }

        return true;
    }

    private function appendSignature($signature, $message)
    {
        if(empty($message))
        {
            return $message;
        }

        if($signature == BasicConstants::MAIL_SIGNATURE_TYPE_TEXT)
        {
            $message .= $this->getTextSignature();
        }
        else if($signature == BasicConstants::MAIL_SIGNATURE_TYPE_IMAGE)
        {
            $message .= $this->getImageSignature();
        }
        else
        {
            $message .= $signature;
        }

        return $message;
    }

    private function getTextSignature()
    {
        $signature = "<br /><br/>————————————————————————————————————<br />";
        $signature .= '<b>EliAds Reporter</b><br />';
        $signature .= '亿栗科技 | www.eliads.com <br />';

        return $signature;
    }

    private function getImageSignature()
    {
        $this->mailer->addEmbeddedImage($this->signatureImagePath,'signature');
        $signature = "<br /><br/>————————————————————————————————————<br />";
        $signature .= '<img src="cid:signature" hight="100" width="255"/>';

        return $signature;
    }

    private function addToAddress($addressList)
    {
        if(empty($addressList))
        {
            return;
        }
        foreach($addressList as $address)
        {
            $this->mailer->addAddress($address);
        }
    }

    private function addCCAddress($addressList)
    {
        if(empty($addressList))
        {
            return;
        }
        foreach($addressList as $address)
        {
            $this->mailer->addCC($address);
        }
    }

    private function addAttachment($filePathList)
    {
        if(empty($filePathList))
        {
            return;
        }
        $this->mailer->clearAttachments();
        foreach($filePathList as $filePath)
        {
            $this->mailer->addAttachment($filePath);
        }
    }

}