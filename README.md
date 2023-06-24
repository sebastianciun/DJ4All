# DJ4All

Aplicația a fost dezvoltată și testată pe Ubuntu Server 22.04 LTS.

Pașii de instalare și lansare a aplicației:
1. Clonarea repository-ului de la link-ul: https://github.com/sebastianciun/DJ4All.git
2. Crearea unui Virtual Environment în directorul DJ4All folosind comanda: **python3 -m venv nume_venv**
3. Activatrea venv-ului. Fiind în directorul DJ4All se folosește comanda: **source nume_venv/bin/activate**
4. Instalarea dependințelor folosind comanda: **pip install -r requirements.txt**
5. Instalara ffmpeg folosind comanda: **sudo apt install ffmpeg**
6. Setarea path-ului directorului de melodii (variabila **MUSIC_PATH** aflată pe rândul 125 la DJ4All/src/musica/settings.py)
7. Rularea aplicației folosind comanda: **python3 manage.py runserver 0.0.0.0:8090**
