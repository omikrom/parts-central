
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function (e) {
        e.preventDefault();
        this.classList.toggle("active_accordion");
        let icon = this.querySelector(".accordion--icon");
        console.log(icon);
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
            panel.style.paddingBottom = "0px";
            panel.style.paddingTop = "0px";
            icon.style.rotate = "0deg";

        } else {
            panel.style.maxHeight = panel.scrollHeight + 100 + "px";
            panel.style.paddingBottom = "25px";
            panel.style.paddingTop = "20px";
            icon.style.rotate = "180deg";
        }
    });
}