let enEdition = null;

const message = document.getElementById("message");
const errNote = document.querySelector("#errNote");
const form = document.querySelector(".e");
const btnSubmit = document.getElementById("btnSubmit"); 

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const email = document.getElementById("email").value;
    const noteBrute = document.getElementById("note").value;
    const classe = document.getElementById("class").value;

    if (nom === "" || prenom === "" || email === "" || classe === "" || noteBrute === "") {
        message.textContent = "Champs incomplets !!";
        message.style.color= "red";
        return;
    }

    const note = parseFloat(noteBrute);
    if (note < 0 || note > 20) {
        alert("Les notes doivent être entre 0 et 20");
        return;
    } 

    message.textContent = "etudiant ajouté avec succès";
    message.style.color = "green"
    note.textContent = "";

    const admission = note < 10 ? "ECHEC" : "ADMIS";

    const nouveauEtudiant = { nom, prenom, email, note, classe, admission };

    const etudiants = JSON.parse(localStorage.getItem("etudiants")) || [];

    if (enEdition === null) {
        etudiants.push(nouveauEtudiant);
    } else {
        etudiants[enEdition] = nouveauEtudiant;
        enEdition = null;
        if (btnSubmit) btnSubmit.textContent = "Ajouter";
    }

    localStorage.setItem("etudiants", JSON.stringify(etudiants));

    AfficherEtudiants();
    form.reset();
});

function AfficherEtudiants() {
    const tab = document.getElementById("tab");
    const etudiants = JSON.parse(localStorage.getItem("etudiants")) || [];
    tab.innerHTML = "";

    etudiants.forEach(function (etudiant, index) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${etudiant.prenom} ${etudiant.nom}</td>
            <td>${etudiant.email}</td>
            <td>${etudiant.classe}</td>
            <td>${etudiant.note}</td>
           <td><span class="${etudiant.admission === 'ADMIS' ? 'admin' : 'ajourne'}">${etudiant.admission}</span></td>
            <td>
                <button class="btn-modifier" onclick="modifierEtudiant(${index})">Modifier</button>
                <button class= "btn-sup" onclick="supprimerEtudiant(${index})">Supprimer</button>
            </td>`;
        tab.appendChild(tr);
    });

    afficherStats();
}

function supprimerEtudiant(index) {
     if(confirm("voulez vous continuer?")){
        console.log("validé");
        
    const etudiants = JSON.parse(localStorage.getItem("etudiants")) || [];
    etudiants.splice(index, 1);
    localStorage.setItem("etudiants", JSON.stringify(etudiants));

    } else{
        console.log("annulé");
        
    }
    AfficherEtudiants();
}

function modifierEtudiant(index) {
    const etudiants = JSON.parse(localStorage.getItem("etudiants")) || [];
    const e = etudiants[index];

    document.getElementById("nom").value = e.nom;
    document.getElementById("prenom").value = e.prenom;
    document.getElementById("email").value = e.email;
    document.getElementById("note").value = e.note;
    document.getElementById("class").value = e.classe;

    enEdition = index;
    // if (btnSubmit) btnSubmit.textContent = "Enregistrer les modifications";

    form.scrollIntoView({ behavior: "smooth" });
    document.getElementById("nom").focus();
    form.querySelector("button[type=submit]").textContent = "Enregistrer les modifications";
}

function afficherStats() {
    const etudiants = JSON.parse(localStorage.getItem("etudiants")) || [];
    document.getElementById("total").textContent = etudiants.length;

    if (etudiants.length > 0) {
        const somme = etudiants.reduce((acc, e) => acc + parseFloat(e.note), 0);
        const moyenne = (somme / etudiants.length).toFixed(2);
        const admis = etudiants.filter(e => e.admission === "ADMIS").length;
        document.getElementById("moyenne").textContent = `${moyenne} /20`;
        document.getElementById("admis").textContent = admis;
    } else {
        document.getElementById("moyenne").textContent = "0.00 /20";
        document.getElementById("admis").textContent = "0";
    }
}

AfficherEtudiants();

const root = document.documentElement;
const bouton = document.getElementById("theme-toggle");

const enregistrer = localStorage.getItem("theme");
const systemeSombre= window.matchMedia("(prefers-color-scheme: dark)").matches;
root.dataset.theme = enregistrer || (systemeSombre ? "dark" : "light");

bouton.addEventListener("click", () => {
    const nouveau = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nouveau;
    localStorage.setItem("theme",nouveau);
});