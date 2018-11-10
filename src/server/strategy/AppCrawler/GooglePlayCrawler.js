var gplay = require('google-play-scraper');

// gplay.app({appId: 'com.dxco.pandavszombies'})

appId = process.argv[2]
gplay.app({appId: appId}) //'com.surpax.ledflashlight.panel'})
  .then(function(app){

// {
//   appId: 'com.dxco.pandavszombies',
//   title: 'Panda vs Zombie: Elvis rage',
//   summary: 'Help Rocky the Panda warrior to fight zombie games and save the Panda kind.',
//   url: 'https://play.google.com/store/apps/details?id=com.dxco.pandavszombies&hl=en',
//   icon: 'https://lh6.ggpht.com/5mI27oolnooL__S3ns9qAf_6TsFNExMtUAwTKz6prWCxEmVkmZZZwe3lI-ZLbMawEJh3=w300',
//   minInstalls: 10000,
//   maxInstalls: 50000,
//   score: 4.9,
//   reviews: 2312,
//   histogram: { '1': 12, '2': 7, '3': 16, '4': 40, '5': 231 },
//   description: 'Everyone in town has gone zombie.',
//   descriptionHTML: 'Everyone in town has gone <b>zombie</b>.',
//   developer: 'DxCo Games',
//   developerEmail: 'dxcogames@gmail.com',
//   developerWebsite: 'http://www.dxco-games.com/',
//   updated: 'May 26, 2015',
//   genre: 'Action',
//   genreId: 'GAME_ACTION',
//   familyGenre: undefined,
//   familyGenreId: undefined,
//   version: '1.4',
//   size: '34M',
//   androidVersionText: '2.3 and up',
//   androidVersion: '2.3',
//   contentRating: 'Mature 17+',
//   price: '0',
//   free: true,
//   screenshots: ['https://lh3.ggpht.com/le0bhlp7RTGDytoXelnY65Cx4pjUgVjnLypDGGWGfF6SbDMTkU6fPncaAH8Ew9RQAeY=h310']
//   video: 'https://www.youtube.com/embed/PFGj-W8Pe5s',
//   comments: ['Great! Its a great time waster'],
//   recentChanges: [ '- Added a hint system' ]
// }

  	// var app = {
  	// 	'title': app.title, 
  	// 	'description': app.summary,
  	// 	'screenshotUrls': app.screenshots,
   //    'genre': app.genre,
   //    'price': app.price,
   //    'rating': score,
   //    'minimumOsVersion': androidVersion,
   //    'releaseDate': updated,
   //    'supportedDevices': 
  	// }
    console.log(JSON.stringify(app))
    process.exit(0);   
  })
  .catch(function(e){
    console.log('There was an error fetching the application!' + appId + '\n' + e);
    process.exit(1);
  });