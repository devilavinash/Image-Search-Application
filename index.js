const accessKey = "qaOF_LVXA1LcqjhYWAALKsLNg99bKE61uBTFjhjZIqQ";
const formElement = document.querySelector("form");
const inputElement = document.querySelector("#search-input");
const searchResults = document.querySelector(".search-results");

let inputData = "";
let page = 1;

async function searchImages() {
    inputData = inputElement.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    const results = data.results;
    if (page === 1) {
        searchResults.innerHTML = "";
    }
    
    results.forEach((result) => {
        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("search-result");
        
        const image = document.createElement('img');
        image.src = result.urls.small;
        image.alt = result.alt_description;
        
        const viewButton = document.createElement('button');
        viewButton.textContent = "View & Download";
        viewButton.addEventListener("click", function() {
            openImagePage(result.urls.full, result.alt_description, result.id);
        });
      
        imageWrapper.appendChild(image);
        imageWrapper.appendChild(viewButton);
        searchResults.appendChild(imageWrapper);
    });
    
    page++;
}

async function openImagePage(imageUrl, imageDescription, imageName) {
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>View Image</title>
            <style>
                body {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                }
                .image-section, .download-section {
                    width: 48%;
                }
                .image-section img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 0 auto;
                }
                .download-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .download-section button {
                    text-decoration: none;
                    padding: 10px 20px;
                    background-color: #007BFF;
                    color: white;
                    font-size: 16px;
                    border-radius: 5px;
                    border: none;
                    cursor: pointer;
                }
                
                .download-section button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="image-section">
                <img src="${imageUrl}" alt="${imageDescription}" id="image-to-download">
            </div>
            <div class="download-section">
                <button id="download-button">Download Image</button>
            </div>
        </body>
        </html>
    `);

    newWindow.document.getElementById('download-button').addEventListener('click', async function() {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = newWindow.document.createElement('a');
        link.href = url;
        link.download = `${imageName}.jpg`; 
        newWindow.document.body.appendChild(link);
        link.click();
        newWindow.document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url); 
    });
}

formElement.addEventListener("submit", function(event) {
    event.preventDefault();
    page = 1;
    searchImages();
});
