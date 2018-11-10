import sys
import urllib2
import json

class AppInfo:
    def __init__(self, title, description, imagePaths, genre, price, rating, os, minimumOsVersion,
                releaseDate = "", supportedDevices = [], genreDetails = []):
        self.title = title
        self.description = description
        self.imagePaths = imagePaths
        self.genre = genre.lower()
        self.price = self.getPrice(price)
        self.rating = rating
        self.releaseDate = releaseDate
        # for targeting
        self.os = os
        self.minimumOsVersion = minimumOsVersion
        self.supportedDevices = supportedDevices
        self.genreDetails = [g.lower() for g in genreDetails]

    def getPrice(self, strPrice):
        price = 0
        try:
            price = float(strPrice)
        except ValueError:    
            s, e = 0, len(strPrice)-1
            while s < e and not strPrice[s].isdigit():
                s += 1
            while e > s and not strPrice[e].isdigit():
                e -= 1
            
            if e >= s:
                price = float(strPrice[s:e+1])
        finally:
            return price
        

