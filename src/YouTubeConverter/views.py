import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import tempfile
import os
from musica.settings import MUSIC_PATH
from django.views.decorators.csrf import csrf_exempt
from .decorators import unauthenticated_user
# Create your views here.
from pathlib import Path
from yt_dlp import YoutubeDL


def check_path(path):
    path = os.path.abspath(path)
    return path.startswith(MUSIC_PATH)

def download_video(link, path):
    ydl_opts = {
        'format': 'mp3/bestaudio/best',
        'postprocessors': [{  
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
        }],
        'quiet': True,
        'outtmpl': {
            'default': path + '/%(title)s.%(ext)s'
        },
        'noplaylist': True,
    }
    with YoutubeDL(ydl_opts) as ydl:
        ydl.download(link)


@csrf_exempt
@unauthenticated_user
def download_view(request):
    if (request.method == 'POST'):
        link = request.POST.get('yt_link')
        path = request.POST.get('path')
        if(not check_path(path)):
            return HttpResponse(status=403)
        download_video(link, path)
        return HttpResponse("Downloaded!")
        
    context = {
        'MUSIC_PATH': MUSIC_PATH
    }   
        
    return render(request, "download.html", context=context)

@csrf_exempt
@unauthenticated_user
def delete_song(request):
    if (request.method == 'POST'):
        path = request.POST.get('path')
        if(not check_path(path)):
            return HttpResponse(status=403)
        if not os.path.isfile(path):
            return HttpResponse(status=403)
        os.remove(path)
        return HttpResponse(status=200)
    return HttpResponse(status=404)
 

@csrf_exempt
@unauthenticated_user
def show_directory(request):
    if(request.method == 'POST'):
        path = request.POST.get('path')
        
        if(not check_path(path)):
            return HttpResponse(status=403)
        
        file_array = []
        for item in os.listdir(path):
            fullpath = os.path.join(path, item)
            if os.path.isdir(fullpath):
                file_array.append([item, True])
            else:
                file_array.append([item, False])
        return HttpResponse(json.dumps(file_array))
    return HttpResponse(status=404)

