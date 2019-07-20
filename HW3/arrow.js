function slideup() {
    let bluebox = document.getElementById("bluebox");
    bluebox.style.display= "none";
    let whitebox = document.getElementById("slideup");
    whitebox.style.webkitAnimationName="goupeffect";
    whitebox.style.webkitAnimationDuration="2s";
    whitebox.style.display="flex";
}

function slidedown() {
    let whitebox = document.getElementById("slideup");
    whitebox.style.display = "none"; 
    let bluebox = document.getElementById("bluebox");
    bluebox.style.webkitAnimationName="godowneffect";
    bluebox.style.webkitAnimationDuration="2s";
    bluebox.style.display = "flex";
}