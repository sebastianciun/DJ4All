function empty_folders() {
    folder_list = document.getElementById("folders")
    while(folder_list.firstChild) {
        folder_list.removeChild(folder_list.firstChild)
    }
}

function refresh_page() {
    query_folders(curr_path);
}

function delete_song(event) {
    var clickedElement = event;
    var message = confirm("Do you want to delete this song?");
    if(!message) {
       return;
    }
     
    let xhr = new XMLHttpRequest();
    let url = window.location.href + '../delete_song/';
    let params = "&path=" + curr_path + '/' + event.firstChild.title; 
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = () => {
        if(xhr.status == 200 && xhr.readyState == 4) {
            clickedElement.remove();
        }
    }

    xhr.send(params);
    
}

function query_folders(path) {
    empty_folders();
    let xhr = new XMLHttpRequest();
    let url = window.location.href + "../folders/";
    let params = "&path=" + curr_path;

    xhr.open("POST", url, true);
    
    xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
    
    xhr.onreadystatechange = function () {
        if(xhr.readyState != 4) {
            return;
        }
        if (xhr.status === 200) {
            files = JSON.parse(xhr.responseText)
            file_list = document.getElementById("folders")
            files.sort((a, b) => {
                if(a[1] > b[1]) {
                    return -1;
                }
                if(a[1] < b[1]) {
                    return 1;
                }
                if(a[1] == b[1]) {
                    if(a[0] < b[0]) {
                        return -1;
                    }
                    if(a[0] == b[0]) {
                        return 0;
                    }
                    return 1;
                }
            });
            files = [['..', true]].concat(files);
            for(i = 0; i < files.length; i++) {
                el = document.createElement("li")
                a = document.createElement("a")
                a.setAttribute("id", "/" + files[i][0])
            
                if(files[i][1]) {
                    el.setAttribute("class", "fld")
                    if (i === 0) {
                        el.style.padding = "1px";
                        el.style.paddingLeft = "8px";
                        a.innerText = "drive_folder_upload"
                        a.setAttribute("class", "material-symbols-outlined back_folder")
                    }
                    else {
                        a.setAttribute("class", "fas fa-folder")
                    }
                    a.setAttribute("style", "color: #fff")
                    if (files[i][0] !== '..') {
                        a.innerText = ' ' + files[i][0];
                    }
                
                    el.setAttribute("id", "/" + files[i][0]);
                    el.addEventListener("click", (e) => {
                        curr_path = curr_path + e.target.id;
                        refresh_page();
                    })
                }
                else {
                    a.innerText = ' ' + files[i][0];
                    a.setAttribute("class", "fas fa-music song");
                    el.setAttribute("class", "fld song");
                    a.setAttribute("data-bs-toggle", "tootip");
                    a.setAttribute("title", files[i][0]);
                    el.setAttribute("onClick", "delete_song(this)");
                }
                el.appendChild(a);
                file_list.appendChild(el);
            }
        }
        else {
            curr_path = MUSIC_PATH;
            refresh_page();
        }
    }
    
    xhr.send(params);
}

function download_song() {
    let link = document.getElementById("yt_link").value;
    document.getElementById("yt_link").value = "";
    let xhr = new XMLHttpRequest();
    let url = window.location.href;
    let params = "yt_link=" + link + "&path=" + curr_path; 
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            refresh_page();
        }
    }
    xhr.send(params);
}

function init() {
    refresh_page();
}

window.onload = init