import json
from django.shortcuts import render
from pytube import YouTube
from django.http import HttpResponse, JsonResponse
import tempfile
import os
from musica.settings import MUSIC_PATH
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

def download_view(request):
    if (request.method == 'POST'):
        link = request.POST.get('yt_link')
        temp_dir = tempfile.mkdtemp()
        yt = YouTube(link)
        path = yt.streams.get_audio_only().download(temp_dir)
        with open(path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type="application/mp4")
            response['Content-Disposition'] = f'inline; filename={os.path.basename(path)}'
            os.system(f"rm -rf {temp_dir}")
            return response
        
    return render(request, "download.html", {})

@csrf_exempt
def show_directory(request):
    if(request.method == 'POST'):
        path = request.body
        path = path.decode()
        path = path[1:-1]
        print(path)
        directory_array = []
        for item in os.listdir(path):
            fullpath = os.path.join(path, item)
            if os.path.isdir(fullpath):
                directory_array.append(item)
        
        return HttpResponse(json.dumps(directory_array))
    return HttpResponse("Salut")

