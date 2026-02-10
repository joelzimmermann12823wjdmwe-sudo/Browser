function navigate() {
    let url = document.getElementById('url-input').value;
    
    if (url === 'neon://history') {
        // Lädt die lokale Verlaufsseite statt einer Website
        webview.src = 'history.html'; 
    } else {
        // Normale URL-Logik
        if (!url.startsWith('http')) url = 'https://' + url;
        webview.src = url;
    }
}