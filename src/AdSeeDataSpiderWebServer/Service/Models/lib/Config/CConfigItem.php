<?php

class CConfigItem
{
	public $Name;
	public $Value;

	function CConfigItem($name,$value)
	{
		$this->Name = $name;
		$this->Value = $value;
	}
}
?>