from django.shortcuts import render
from pytube import YouTube
from django.http import HttpResponse
import tempfile
import os

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