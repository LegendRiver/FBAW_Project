<?php

    /**
     * Created by IntelliJ IDEA.
     * User: zengtao
     * Date: 1/3/16
     * Time: 11:03 AM
     */
    class CDbParameter
    {
        public $Name = null;
        public $Value = null;
        public $Type = null;
        public $Index = 0;

        function __construct($name, $value, $type)
        {
            $this->Name = $name;
            $this->Value = $value;
            $this->Type = $type;
        }

        function __destruct()
        {
            unset($this);
        }
    }