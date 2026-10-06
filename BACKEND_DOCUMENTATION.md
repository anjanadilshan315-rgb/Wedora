# Backend Integration Guide: Open Invitation System

This document outlines the system flow, database requirements, and API structure required for the PHP/MySQL backend developers to connect with the Next.js frontend.

---

## 1. System Flow Overview

The business model for this platform operates on an **Admin-Led Flow** (clients do not register themselves):

1. **Client Onboarding:** A client contacts the business. The Admin manually creates the client's invitation profile in the backend.
2. **Template Selection:** The Admin selects which template (e.g., `Classic Elegance` or `Royal Kandyan`) the couple will use.
3. **Link Generation:** The Admin inputs a list of guests. The backend generates custom URLs for each guest (e.g., `https://domain.com/invite/kaveen-ishara?guest=Nimal`).
4. **Guest Experience:** The guest clicks the custom link on WhatsApp, sees the invitation, and submits their RSVP & wishes. 
5. **Data Collection:** The frontend sends the RSVP (Yes/No + headcount) and Wishes via POST requests to the PHP backend.

---

## 2. Admin Dashboard Requirements (PHP/MySQL)

The backend developer needs to build an Admin Panel with the following capabilities:

### A. Couple / Invitation Management
* Form to create a new invitation link (`slug` must be unique, e.g., `kaveen-ishara`).
* Form fields: Groom Name, Bride Name, Wedding Date, Wedding Time, Venue Name, Google Maps URL.
* **Template Dropdown:** Save a `template_id` (e.g., `1` for Classic, `2` for Kandyan) to the database so the frontend knows which design to render.
* **Photo Upload:** Upload the couple's photo, save the actual file to a server folder (e.g., `/uploads/couples/`), and save *only the URL string* in the database.

### B. Guest Link Generator
* An input area where the Admin can type a guest's name.
* The system should output the custom link to be copied and pasted into WhatsApp.
* *Frontend format required:* `yourdomain.com/invite/{slug}?guest={Encoded_Guest_Name}`

### C. RSVP & Wish Tracking
* A dashboard table for the Admin/Couple to view all RSVP submissions.
* Display: Guest Name, Attending (Yes/No), Number of Guests (Integer).
* Total Headcount calculation.
* A section to view, approve, or delete Guestbook wishes.

---

## 3. Connecting to the Next.js Frontend (REST APIs)

The Next.js frontend currently uses hardcoded mock data. To make it live, the PHP backend must provide the following JSON API endpoints. The frontend will `fetch()` these URLs.

### API 1: Get Invitation Details (GET)
**Endpoint:** `GET /api/invitation.php?slug=kaveen-ishara`
**Expected JSON Response:**
```json
{
  "status": "success",
  "data": {
    "template_id": 2,
    "slug": "kaveen-ishara",
    "groomName": "Kaveen",
    "brideName": "Ishara",
    "weddingDate": "28TH NOVEMBER 2026",
    "weddingDateLong": "Saturday, November 28th, 2026",
    "weddingTime": "4:30 PM",
    "venue": "The Grand Ballroom, Kingsbury Hotel",
    "mapUrl": "https://maps.google.com/?q=Kingsbury",
    "couplePhotoUrl": "https://backend.com/uploads/couples/kaveen-ishara.jpg"
  }
}
```

### API 2: Fetch Guest Wishes (GET)
**Endpoint:** `GET /api/wishes.php?slug=kaveen-ishara`
**Expected JSON Response:**
```json
{
  "status": "success",
  "data": [
    { "id": 1, "name": "Nimal", "text": "Wishing you the best!" },
    { "id": 2, "name": "Amali", "text": "Can't wait to celebrate." }
  ]
}
```

### API 3: Submit RSVP (POST)
**Endpoint:** `POST /api/rsvp.php`
**Payload from Frontend:**
```json
{
  "slug": "kaveen-ishara",
  "guestName": "Nimal",
  "isAttending": true,
  "guestCount": 2
}
```
*Note: `isAttending` is a boolean (true/false) and `guestCount` is strictly an Integer.*

### API 4: Submit Wish (POST)
**Endpoint:** `POST /api/submit_wish.php`
**Payload from Frontend:**
```json
{
  "slug": "kaveen-ishara",
  "guestName": "Nimal",
  "message": "Congratulations on your big day!"
}
```

---

## 4. Cross-Origin Resource Sharing (CORS)
Since the Next.js frontend and PHP backend might be hosted on different ports or subdomains, the backend developer MUST enable CORS headers in the PHP API files:
```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
```

## 5. Important Notes on Images
* Do **NOT** save binary image data (BLOBs) into the MySQL database.
* Save the static template graphics (gold arches, flowers, etc.) in the frontend Next.js `/public/assets/` folder. They do not belong in the database.
* Only the dynamic user photos (the couple's picture) should be uploaded through the PHP Admin panel and saved as URL strings in the database.
