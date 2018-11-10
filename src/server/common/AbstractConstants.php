<?php


class AbstractConstants
{
    /**
     * @var array|null
     */
    protected $map = null;

    /**
     * @var array|null
     */
    protected $names = null;

    /**
     * @var array|null
     */
    protected $values = null;

    /**
     * @var array|null
     */
    protected $valuesMap = null;

    protected static $instances = array();

    /**
     * @return string
     */
    static function className()
    {
        return get_called_class();
    }

    public static function getInstance()
    {
        $fqn = get_called_class();
        if (!array_key_exists($fqn, static::$instances))
        {
            static::$instances[$fqn] = new static();
        }

        return static::$instances[$fqn];
    }

    /**
     * @return array
     */
    public function getArrayCopy()
    {
        if ($this->map === null)
        {
            $this->map = (new \ReflectionClass(get_called_class()))->getConstants();
        }

        return $this->map;
    }

    /**
     * @return array
     */
    public function getNames()
    {
        if ($this->names === null)
        {
            $this->names = array_keys($this->getArrayCopy());
        }

        return $this->names;
    }

    /**
     * @return array
     */
    public function getValues()
    {
        if ($this->values === null)
        {
            $this->values = array_values($this->getArrayCopy());
        }

        return $this->values;
    }

    /**
     * @return array
     */
    public function getValuesMap()
    {
        if ($this->valuesMap === null)
        {
            $this->valuesMap = array_fill_keys($this->getValues(), null);
        }

        return $this->valuesMap;
    }

    /**
     * @param string|int|float $name
     * @return mixed
     */
    public function getValueForName($name)
    {
        $copy = $this->getArrayCopy();
        return array_key_exists($name, $copy) ? $copy[$name] : null;
    }

    /**
     * @param string|int|float $name
     * @return bool
     */
    public function isValid($name)
    {
        return array_key_exists($name, $this->getArrayCopy());
    }

    /**
     * @param string|int|float $value
     * @return bool
     */
    public function isValidValue($value)
    {
        return array_key_exists($value, $this->getValuesMap());
    }
}