const fs = require('fs');
const path = require('path');

async function testPost() {
    try {
        const formData = new FormData();
        formData.append('title', 'Test Form Title');
        formData.append('category', 'general');
        formData.append('content', 'Test content');
        
        const response = await fetch('http://localhost:5005/api/current-affairs', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errText = await response.text();
            console.log('Error:', response.status, errText);
        } else {
            const data = await response.json();
            console.log('Success:', data);
        }
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

testPost();
