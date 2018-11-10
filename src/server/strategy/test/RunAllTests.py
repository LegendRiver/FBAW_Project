#!/usr/bin/env python
#encoding: utf-8

import unittest
import re
import os
import sys

sys.path.append('../')

def testAllinCurrent():
    path = os.path.abspath(os.path.dirname(sys.argv[0]))
    files = os.listdir(path)
    test = re.compile("^[(test)].*[(\.py)]$", re.IGNORECASE)
    files = filter(test.search, files)
    print("test fiels:" + str(files))
    filenameToModuleName = lambda f: os.path.splitext(f)[0]
    moduleNames = map(filenameToModuleName, files)
    modules = map(__import__, moduleNames)
    load = unittest.defaultTestLoader.loadTestsFromModule
    return unittest.TestSuite(map(load, modules))

if __name__ == "__main__":
    unittest.main(defaultTest="testAllinCurrent")