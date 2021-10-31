var current_edit_id;
var edit_name;

function isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
}

function uploadProfilePic() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = "image/png, image/jpeg";

    input.onchange = e => { 
       var file = e.target.files[0];
        
       if (!isFileImage(file)) {
           $("#account").modal("hide");
           
           setTimeout(function() {
               Flux.showPopup("Invalid", "The file is invalid: must be .png or .jpeg");
           }, 250);
           
           return;
       }

       var reader = new FileReader();
       reader.readAsDataURL(file);

       reader.onload = readerEvent => {
          var content = readerEvent.target.result;
           
          var formData = new FormData();
          var imagefile = content;
          formData.append("picture", imagefile); 
          formData.append("pin", getCookie("auth"));

          axios.post(
              "https://brixybot.bubbleapps.io/version-test/api/1.1/wf/uploadpfp",
              formData
          ).then(response => {
              $("#account").modal("hide");
              loadData();
          });
       }

    }

    input.click();
}

function changeSetting(settingName, hide) {
    current_edit_id = uuid.v4();
    edit_name = settingName;
    // set form data
    var data = `
        <div id="edit-content">
            <p style="margin-bottom: 5px;">Please choose a new <strong>account ${settingName}</strong>.</p>
            <form><input id="${current_edit_id}" type=${hide ? "password" : "text"} class="form-control" placeholder="Please enter a new ${settingName}..." /></form>
        </div>
    `;
    
    document.getElementById("edit-content").innerHTML = data;
    document.getElementById("edit-title").innerHTML = `Configuring ${settingName.charAt(0).toUpperCase() + settingName.slice(1)}`;
    
    $("#account").modal("hide");
    
    setTimeout(function() {
        $("#editaccount").modal("show");
    }, 300);
}

async function submitData() {
    var response = document.getElementById(current_edit_id);
    var alertedit = document.getElementById("alert-edit");
    var button = document.getElementById("btnsubmitdata");
    
    button.disabled = true;
    
    async function alert() {
        alertedit.style.display = "inherit";
        button.disabled = false;
            
        setTimeout(function() {
            alertedit.style.display = "none";
        }, 2500);
    }
    if (response.type == "password") {
        if (response.value.length != 6) {
            await alert();
            
            return;
        }
    }
    
    spinner.style.display = "inherit";
    
    var post = {};
    
    post.auth = getCookie("auth");
    
    if (response.type == "password") {
        post.pincode = response.value;
    }
    
    if (response.type != "password") {
        post.name = response.value;
    }
    
    axios.post(
        "https://brixybot.bubbleapps.io/version-test/api/1.1/wf/bank_update",
        post
    ).then(function(response) {
        if (post.pincode) {
            setCookie("auth", post.pincode, 60);    
        }
        
        spinner.style.display = "none";
        
        loadData();
        
        button.disabled = false;
        $("#editaccount").modal("hide");
    });
}