from django.shortcuts import render
from django.http import HttpResponse
from os import getenv
import requests
import json
import random

# Create your views here.
def index(request):
    return HttpResponse('Hello World')
def color(request):
    ind = random.randint(0, 137)
    return HttpResponse(json.dumps({"index": ind}))
def get_access_token(request):

    ## Get request parameter arguments. Not used in this method but placed here for example purposes.
    # arguments = request.args.get(<paramenter>)

    # Retrieve sensitive information (like client ID and secret) from environment variables
    client_id = getenv('VITE_DISCORD_CLIENT_ID')
    client_secret = getenv('DISCORD_CLIENT_SECRET')

    # Send a POST request to Discord API to get access token
    response = requests.post('https://discord.com/api/oauth2/token', data={
        'client_id': client_id,
        'client_secret': client_secret,
        'grant_type': 'authorization_code',
        'code': request.headers['code']  # Retrieve authorization code from the request
    })

    # Return the access token extracted from the response in JSON format
    print(response)
    return json.loads(response)['access_token']