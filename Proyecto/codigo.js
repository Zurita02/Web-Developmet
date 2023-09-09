estudianteForm.style.display='none';
tutorForm.style.display='none';
loginBox.style.display='none';

function mostrarTutor(){
    tutorForm.style.display = 'block';
    estudianteForm.style.display = 'none';
}

function registro(){
    infoJuego.style.display='none';
    estudianteForm.style.display='block';
}

function login(){
    infoJuego.style.display='none';
    loginBox.style.display = 'block';
    estudianteForm.style.display ='none';
    tutorForm.style.display = 'none';
}
    

