from Naked.toolshed.shell import execute_js, muterun_js
import json

# response = muterun_js('GooglePlayCrawler.js', 'com.surpa.ledflashlight.panel')    #execute_js does not return response

appname = 'com.kongregate.mobile.throwdown.google'
response = muterun_js('GooglePlayCrawler.js', appname)    #execute_js does not return response
filename = appname + '.json'
if response.exitcode == 0:
    # the command was successful (returned 0 exit code)

    with open(filename, 'w') as f:
        appInfo = json.loads(response.stdout)
        f.write(json.dumps(appInfo, sort_keys=True, indent=4, separators=(',', ': ')))


    # print("successful")
    # print json.dumps(response.stdout, sort_keys=True, indent=4, separators=(',', ':'))
    # print("end")
    # appInfo = json.loads(response.stdout)
    
    # title = appInfo["title"]
    # description = appInfo["description"]
    #images = appInfo["images"]
    #print title
    #print description
    #print images

else:
    # the command was not successful (returned non-0 exit code)
    raise Exception(response.stderr)


