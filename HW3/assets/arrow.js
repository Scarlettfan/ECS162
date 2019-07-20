function slideup() {
    let bluebox = document.getElementById("bluebox");
    bluebox.style.display="none";
    let whitebox = document.getElementById("slideup");
    whitebox.style.display="flex";
}

function slidedown() {
    let bluebox = document.getElementById("bluebox");
    bluebox.style.display = "flex";
    let whitebox = document.getElementById("slideup");
    whitebox.style.display = "none"; 
}