
function empty_folders() {
    folder_list = document.getElementById("folders")
    while(folder_list.firstChild) {
        folder_list.removeChild(folder_list.firstChild)
    }
}


function refresh_page() {
    query_folders(curr_path);
}

function query_folders(path) {
    empty_folders();
    let xhr = new XMLHttpRequest();
    let url = window.location.href + "../folders/";
    
    xhr.open("POST", url, true);
    
    xhr.setRequestHeader("Content-Type", "text/plain")
    
    xhr.onreadystatechange = function () {
        if(xhr.readyState != 4) {
            return;
        }
        if (xhr.status === 200) {
            folders = JSON.parse(xhr.responseText)
            folder_list = document.getElementById("folders")
            folders = ['..'].concat(folders);
            for(i = 0; i < folders.length; i++) {
                el = document.createElement("li");
                a = document.createElement("a");
                a.setAttribute("id", "/" + folders[i])
                a.innerText = folders[i];
                a.addEventListener("click", (e) => {
                    curr_path = curr_path + e.target.id;
                    refresh_page();
                })

                el.appendChild(a);
                folder_list.appendChild(el);
            }
        }
        else {
            curr_path = MUSIC_PATH;
            refresh_page();
        }
    }
    
    var data = JSON.stringify(path);
    
    xhr.send(data);
}

function download_song() {
    let link = document.getElementById("yt_link").value;
    let xhr = new XMLHttpRequest();
    let url = window.location.href;
    let params = "yt_link=" + link + "&path=" + curr_path; 
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
    xhr.send(params);
    
    location.reload();
}

function init() {
    refresh_page();
}

window.onload = init