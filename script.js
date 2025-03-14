
document.addEventListener("DOMContentLoaded", async function () {
    const db = firebase.database();
    const grid = document.querySelector(".image-grid");

    const imageSources = ["https://i.postimg.cc/vm3j97Jg/1.jpg","https://i.postimg.cc/fLqG475n/10.jpg","https://i.postimg.cc/Y0fQGRPT/11.jpg","https://i.postimg.cc/FRHMnCyV/12.jpg","https://i.postimg.cc/SKd0dbMK/13.jpg","https://i.postimg.cc/q74V2vgY/14.png","https://i.postimg.cc/YCcwq37t/15.jpg","https://i.postimg.cc/zGnYLgDK/16.jpg","https://i.postimg.cc/CLngg2Wv/17.jpg","https://i.postimg.cc/gcTW1pBX/18.png","https://i.postimg.cc/D08Kmpmw/19.jpg","https://i.postimg.cc/SKy3J1vb/2.jpg","https://i.postimg.cc/wMZYN5sc/20.jpg"];

    async function loadImages() {
        grid.innerHTML = "";
        const snapshot = await db.ref("imageOrder").once("value");
        let savedOrder = snapshot.val() || imageSources;

        if (typeof savedOrder === "object" && !Array.isArray(savedOrder)) {
            savedOrder = Object.values(savedOrder);
        }

        savedOrder.forEach(src => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("image-wrapper");
            wrapper.setAttribute("draggable", "true");

            const img = document.createElement("img");
            img.src = src;
            img.alt = "Projektbild";
            wrapper.appendChild(img);
            grid.appendChild(wrapper);
        });

        addDragAndDropListeners();
    });

    function addDragAndDropListeners() {
        let draggedItem = null;
        document.querySelectorAll(".image-wrapper").forEach(item => {
            item.addEventListener("dragstart", () => draggedItem = item);
            item.addEventListener("dragend", saveImageOrder);
            item.addEventListener("dragover", e => e.preventDefault());
            item.addEventListener("drop", e => {
                e.preventDefault();
                if (draggedItem === item) return;
                grid.insertBefore(draggedItem, item);
                saveImageOrder();
            });
        });
    }

    async function saveImageOrder() {
        const newOrder = [...document.querySelectorAll(".image-wrapper img")].map(img => img.src);
        await db.ref("imageOrder").set(newOrder);
    }

    loadImages();
});
