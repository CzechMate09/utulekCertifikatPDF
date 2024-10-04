window.jsPDF = window.jspdf.jsPDF;

let today = new Date();
let hour = today.getHours();
let day = today.getDate();
let month = today.getMonth() + 1; // JavaScript months are 0-11
let year = today.getFullYear();
var dateToday = `${day}.${month}.${year}`

var body = document.body;

if (hour >= 6 && hour < 19) {
    body.className = 'light-mode';
} else {
    body.className = 'dark-mode';
}

var customDateInput = document.getElementById('customDateInput');
var lockedInput = document.getElementById('customLockedInput');

var vlastniRadio = document.getElementById('vlastni');
var dnesniRadio = document.getElementById('dnesni');
var zadneRadio = document.getElementById('zadne');

document.getElementById('lockedInput').placeholder = dateToday;

function showCustomDateInput() {

  if (vlastniRadio.checked) {
      customDateInput.style.display = 'block';
  } else {
      customDateInput.style.display = 'none';
  }

  if (dnesniRadio.checked || zadneRadio.checked) {
      customDateInput.style.display = 'none';
  }
}


function showLockedInput() {
  
  if (dnesniRadio.checked) {
    lockedInput.style.display = 'block';
  } else {
    lockedInput.style.display = 'none';
  }
  
  if (vlastniRadio.checked || zadneRadio.checked) {
    lockedInput.style.display = 'none';
  }
}

var radioButtons = document.querySelectorAll('input[name="fDatum"]');
radioButtons.forEach(function (radioButton) {
  radioButton.addEventListener('change', showCustomDateInput);
  radioButton.addEventListener('change', showLockedInput);
  
});

function CreatePDF(print) {
  
  if (document.getElementById("fName").value == "" || 
      document.getElementById("fAnimal").value == "" || 
      document.getElementById("fAnimalName").value == "" ||
      !document.querySelector('input[name="fGender"]:checked') ||
    !document.querySelector('input[name="fDatum"]:checked')){
      var modal = document.getElementById("myModal");
      var span = document.getElementsByClassName("close")[0];
  
      modal.style.display = "block";
  
      span.onclick = function() {
        modal.style.display = "none";
      }
  
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
  
      return;
  }
  
  else {
    const doc = new jsPDF();
    var name = (document.getElementById('fName').value).toUpperCase();
    var animal = (document.getElementById('fAnimal').value).toUpperCase();
    var animalName = (document.getElementById('fAnimalName').value).toUpperCase();
    var selectedDate = document.querySelector('input[name="fDatum"]:checked').value;
    var selectedGender = document.querySelector('input[name="fGender"]:checked').value;
  

    switch (selectedDate) {
      case 'dnesni':
        var date = dateToday;
        break;
      case 'vlastni':
        var date = document.getElementById('customDate').value;
        break;
      case 'zadne':
        var date = " "
        break;
      default:
        break;
    }

    var gender;
    switch (selectedGender) {
      case 'muz':
        gender = "STAL";
        break;
      case 'zena':
        gender = "STALA";
        break;
    }

    const image = new Image();
    image.src = "img/utulekPDF3.png";
    doc.addImage(image, "png", 0, 0, 210, 297);
    
    //fonts
    doc.addFileToVFS('Georgia-normal.ttf', georgia);
    doc.addFont('Georgia-normal.ttf', 'Georgia', 'normal');

    doc.addFileToVFS('Franklin Gothic Medium Regular-normal.ttf', franklin);
    doc.addFont('Franklin Gothic Medium Regular-normal.ttf', 'Franklin Gothic Medium Regular', 'normal');
    
    //certifikát
    doc.setFont('Georgia', 'normal');
    doc.setFontSize(36)
    doc.text("CERTIFIKÁT", 105, 30, "center");

    //virtuální adopce
    doc.setFont('Georgia', 'normal');
    doc.setFontSize(28)
    doc.text("VIRTUÁLNÍ ADOPCE", 105, 45, "center");

    //potvrzujeme že
    doc.setFont("Franklin Gothic Medium Regular", "normal")
    doc.setFontSize(15)
    doc.text("POTVRZUJEME, ŽE", 105, 60, "center");

    // jmeno
    doc.setFont('Georgia', 'normal');
    doc.setFontSize(22)
    doc.text(name, 105, 75, "center");

    //se stala
    doc.setFont("Franklin Gothic Medium Regular", "normal")
    doc.setFontSize(15)
    doc.text(`SE ${gender} ADOPTIVNÍM RODIČEM ${animal}`, 105, 90, "center");

    // jmeno zvirete
    doc.setFont('Georgia', 'normal');
    doc.setFontSize(22)
    doc.text(animalName, 105, 105, "center");

    //z utulku
    doc.setFont("Franklin Gothic Medium Regular", "normal")
    doc.setFontSize(15)
    doc.text("Z ÚTULKU MLADÁ BOLESLAV", 105, 120, "center");

    //date
    doc.setFont('Georgia', 'normal');
    doc.setFontSize(22)
    doc.text(date, 52.5, 269, "center");
    
    doc.setFont('Georgia', 'normal');
    doc.setFontSize(18)
    doc.text("Datum", 52.5, 281, "center");

    
    doc.setFont('Georgia', 'normal');
    doc.setFontSize(18)
    doc.text("Útulek MB z.s.", 158, 281, "center");
    

    var pdf_width = doc.internal.pageSize.getWidth();
    var pdf_height = doc.internal.pageSize.getHeight();
    var max_height = 90; 
    var scaled_height = Math.min(max_height, pdf_height / 2);
    var scaled_width = (image_width * scaled_height) / image_height;

    var x_position = (pdf_width - scaled_width) / 2;
    var y_position = (pdf_height - scaled_height);

    if(uploaded_image !== "") {
      doc.addImage(uploaded_image, "PNG", x_position, y_position - 50, scaled_width, scaled_height);
    };
      
    //doc.addImage(uploaded_image, "PNG", 105, 200, 80, 80);

    console.log(print)
    if (print == true) {
      window.open(doc.output('bloburl'), '_blank');
    } else {
      name = name.replace(/ /g, "_")
      doc.save(`certifikat_${animalName.toLowerCase()}_${name.toLowerCase()}.pdf`);
    }
  };
}

var image_input = document.querySelector("#image_input");
var uploaded_image = "";
var image_width = 0;
var image_height = 0;

image_input.addEventListener("change", function(){
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        uploaded_image = reader.result;
        document.querySelector("#display_image").style.backgroundImage = `url(${uploaded_image})`;
        document.querySelector("#display_image").style.display = "block";

        var img = new Image();
        img.onload = function() {
            
            image_width = this.width;
            image_height = this.height;
        };
        img.src = reader.result;
    });
    console.log(image_input.value);
    reader.readAsDataURL(image_input.files[0]);
});
