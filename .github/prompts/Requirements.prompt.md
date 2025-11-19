---
mode: agent
---

## Overall Requirements:
- Create a site using HTML, CSS, Bootstrap 5, and JavaScript for a rental car business that includes the following features:
- The site should be in spanish language.

## Landing Page Requirements:
- Hero Section:
   - A full-width hero section with a background image, overlay text, and a Login button.
- Services Section:
   - A section that highlights at least three services offered, each with an icon, title, and brief description.
        Service 1: Car Rentals
        Service 2: Chauffeur Services
        Service 3: Executive Transport
- About Section:
   - A section with a brief company history, mission statement.
- Contact Form:
   - A contact form with fields for name, email, subject, and message.
   - Include form validation and a success message upon submission.
- Footer:
   - A footer with social media links, contact information, and copyright notice.
- Interactivity:
   - Use JavaScript to add interactivity, such as smooth scrolling for navigation links and form validation.
- Accessibility:
   - Ensure the site is accessible, including proper use of ARIA roles and keyboard navigation.

## Login Page Requirements:
- Create a login page with fields for username, password, and a submit button.
- Use email as the username.
- Include form validation and error messages for incorrect login attempts.
- if the User is a client (client@rentalcar.com), redirect the user to the Client Area.
- if the user is an admin (admin@rentalcar.com), redirect to the Admin Area.

## Client Area Requirements:
 - Show the user a welcome message with their email.
 - Display a form to request a service, including fields for:
    - Date for the Service (date picker)
    - Time for the Service (time picker)
    - Service Type (dropdown with options: Car Rental, Chauffeur Service, Executive Transport)
    - Number of Passengers (number input)    
    - Origin Location (text input)
    - Destination Location (text input)
    - Contact Name (text input)
    - Contact Phone Number (tel input)
 - Include a submit button to send the service request.

## Admin Area Requirements:

- Responsive Navigation Bar:
   - A side navigation bar that collapses into a hamburger menu on smaller screens.
   - Include links to Home (dashboard), Service Requests, Services Calendar, Clients, Cars, Chauffeurs,  Reports, and Catalogs.
- Dashboard Overview:
   - Display 4 key metrics such as total service requests, pending requests, and completed requests.
   - Show a bar chart with services per week day using a JavaScript charting library.
   - Show a pie chart on services per car
   - Show a pie chart on services per chauffeur
   - Show a list view with today's service requests including client name, service type, date, and status.
- Service Requests Management:
   - A table listing all service requests with columns for Client Name, Service Type, Date, Status, and Actions (View, Edit, Delete).
   - Include pagination, search, and sorting functionality.
   - Provide a modal or separate page for viewing and editing service request details.
- Services Calendar:
   - A calendar view displaying all scheduled services.
   - Allow admin to click on a date to view services scheduled for that day.
- Clients Management:
   - A table listing all clients with columns for Name, Email, Phone Number, and Actions (View, Edit, Delete).
   - Include pagination, search, and sorting functionality.
   - Provide a modal or separate page for viewing and editing client details.
- Cars Management:
   - A table listing all cars with columns for Make, Model, Year, Availability Status, and Actions (View, Edit, Delete).
   - Include pagination, search, and sorting functionality.
   - Provide a modal or separate page for viewing and editing car details.
- Chauffeurs Management:
   - A table listing all chauffeurs with columns for Name, Phone Number, Availability Status, and Actions (View, Edit, Delete).
   - Include pagination, search, and sorting functionality.
   - Provide a modal or separate page for viewing and editing chauffeur details.
- Reports Section:
   - Generate reports based on service requests, clients, cars, and chauffeurs.
   - Allow exporting reports in PDF and CSV formats.
- Catalogs Section:
   - Manage catalogs for countries, states, city, car type, service types, and chauffeurs status, Request Status, Users, and Roles.
   - Include options to add, edit, and delete catalog entries.
