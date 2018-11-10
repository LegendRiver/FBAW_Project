# -*- coding: utf-8 -*-
import sys
import os
import unittest
sys.path.append('../')

# this_dir = os.path.dirname(__file__)
# repo_dir = os.path.join(this_dir, os.pardir)
# sys.path.insert(1, repo_dir)
# print(sys.path)

from AppCrawler.AppInfo import AppInfo
from AppCrawler.AppCrawler import AppCrawler
from AppCrawler.AppCrawlerFactory import AppCrawlerFactory

class TestAppCrawlerMethods(unittest.TestCase):

    def setUp(self): 
        pass

    # Can use assertFalse and assertRaises
    # self.assertFalse('Foo'.isupper())
    # # check that s.split fails when the separator is not a string
    # with self.assertRaises(TypeError):
    #     s.split(2)

    def testAppleStoreCrawler(self):        
        c = AppCrawlerFactory.createAppCrawler("https://itunes.apple.com/us/app/solitaire/id1100578622?mt=8")
        
        app = c.getAppInfo()
        self.assertEqual(app.title, u"Solitaire ∞")
        self.assertEqual(app.genre, "games")
        self.assertEqual(app.price, 0.0)

    def testGooglePlayCrawler(self):        
        c = AppCrawlerFactory.createAppCrawler("https://play.google.com/store/apps/details?id=com.surpax.ledflashlight.panel&hl=en&gl=us")
        
        app = c.getAppInfo()
        self.assertEqual(app.title, "Super-Bright LED Flashlight")
        self.assertEqual(app.genre, "productivity")
        self.assertEqual(app.price, 0)

if __name__ == '__main__':
    unittest.main()