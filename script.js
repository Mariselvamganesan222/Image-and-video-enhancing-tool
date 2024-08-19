ocument.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const imagePreview = document.getElementById('imagePreview');
    const videoPreview = document.getElementById('videoPreview');
    const downloadButton = document.getElementById('downloadButton');

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const filePath = `http://localhost:5000${data.filePath}`;

            if (file.type.startsWith('image/')) {
                imagePreview.src = filePath;
                imagePreview.style.display = 'block';
                videoPreview.style.display = 'none';
                applyFilters(); // Ensure filters are applied immediately
                downloadButton.style.display = 'inline-block';
                downloadButton.addEventListener('click', () => downloadImage(imagePreview));
            } else if (file.type.startsWith('video/')) {
                videoPreview.src = filePath;
                videoPreview.style.display = 'block';
                imagePreview.style.display = 'none';
                downloadButton.style.display = 'inline-block';
                downloadButton.href = filePath;
                downloadButton.download = data.fileName;
            }
        })
        .catch(error => console.error('Error uploading file:', error));
    }
});

const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');

[brightness, contrast].forEach(input => {
    input.addEventListener('input', applyFilters);
});

function applyFilters() {
    const imagePreview = document.getElementById('imagePreview');
    const videoPreview = document.getElementById('videoPreview');

    const brightnessValue = brightness.value;
    const contrastValue = contrast.value;

    const filter = `brightness(${brightnessValue}%) contrast(${contrastValue}%)`;

    if (imagePreview.style.display === 'block') {
        imagePreview.style.filter = filter;
    }

    if (videoPreview.style.display === 'block') {
        videoPreview.style.filter = filter;
    }
}

function downloadImage(imageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;

    ctx.filter = imageElement.style.filter;
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function(blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'enhanced_image.png';
        link.click();
    }, 'image/png');
}
