<?php


class StrategyCheckManager
{
    private $checkerArray;

    public function __construct(StrategyFileParser $parser, ImageProcesser $imageProcesser)
    {
        $campaignChecker = new CampaignSTChecker($parser);
        $this->checkerArray[] = $campaignChecker;

        $adsetChecker = new AdsetSTChecker($parser);
        $this->checkerArray[] = $adsetChecker;

        $creativeChecker = new CreativeSTChecker($parser, $imageProcesser);
        $this->checkerArray[] = $creativeChecker;
    }

    public function checkStrategyJson()
    {
        foreach($this->checkerArray as $checker)
        {
            $checkResult = $checker->checkStrategyFile();
            if(OK != $checkResult)
            {
                return $checkResult;
            }

            ServerLogger::instance()->writeStrategyLog(Info, 'Pass the checking by ' . get_class($checker));
        }

        return OK;
    }
}