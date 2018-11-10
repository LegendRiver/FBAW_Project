<?php


class PathManager
{
    private $projectPath;

    private $srcPath;

    private $serverPath;

    private $fbInterfacePath;

    private $awInterfacePath;

    private $interfacePath;

    private $spiderPythonPath;

    private $analysisPythonPath;

    private static $instance = null;

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    private function __construct()
    {
        $this->serverPath = dirname(dirname(__FILE__)) . DIRECTORY_SEPARATOR;
        $this->srcPath = dirname($this->serverPath) . DIRECTORY_SEPARATOR;
        $this->projectPath = dirname($this->srcPath) . DIRECTORY_SEPARATOR;
        $this->interfacePath = $this->serverPath . BasicConstants::DIRECTORY_SERVER_INTERFACE . DIRECTORY_SEPARATOR;
        $this->fbInterfacePath = $this->interfacePath . BasicConstants::DIRECTORY_SERVER_FBINTERFACE . DIRECTORY_SEPARATOR;
        $this->awInterfacePath = $this->interfacePath . BasicConstants::DIRECTORY_SERVER_AWINTERFACE . DIRECTORY_SEPARATOR;
        $this->spiderPythonPath = $this->projectPath . BasicConstants::DIRECTORY_PYTHON_SPIDER . DIRECTORY_SEPARATOR;
        $this->analysisPythonPath = $this->projectPath . BasicConstants::DIRECTORY_PYTHON_ANALYSIS . DIRECTORY_SEPARATOR;
    }

    /**
     * @return string
     */
    public function getAwInterfacePath()
    {
        return $this->awInterfacePath;
    }

    public function getLibPath()
    {
        return $this->srcPath . BasicConstants::DIRECTORY_LIB . DIRECTORY_SEPARATOR;
    }

    /**
     * @return string
     */
    public function getFbInterfacePath()
    {
        return $this->fbInterfacePath;
    }

    /**
     * @return string
     */
    public function getInterfacePath()
    {
        return $this->interfacePath;
    }

    /**
     * @return string
     */
    public function getProjectPath()
    {
        return $this->projectPath;
    }

    /**
     * @return string
     */
    public function getServerPath()
    {
        return $this->serverPath;
    }

    /**
     * @return string
     */
    public function getSrcPath()
    {
        return $this->srcPath;
    }

    /**
     * @return string
     */
    public function getSpiderPythonPath()
    {
        return $this->spiderPythonPath;
    }

    /**
     * @return string
     */
    public function getAnalysisPythonPath()
    {
        return $this->analysisPythonPath;
    }

}