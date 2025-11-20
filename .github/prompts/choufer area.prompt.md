---
agent: agent
---
# Chauffeur Area Implementation Prompt
create a new area for the chauffeurs
when a chauffeur user logs in redirect the user to the chauffeur area
the main chauffeur area should be fully responsibe since it will be accessed from mobile devices mostly
the main page should show the services assinged to the chauffeur
show each service in a card with the following details:
- service id
- scheduled time and date
- origen location
- destinatio location
- number of passengers
- main contact name
- main contact phone number
sort the cards by scheduled time ascending
each card should have a button to view more details about the service
the details page should show all the information about the service
the details page should also have a button to add event logs for the service
the event log should have the following fields:
- timestamp (auto generated)
- event type (dropdown with the following options: picked up, dropped off, border cleared, high traffic, road accident delay, service emergency, other)
- notes (text area)

# updates to the admin services request area
The event logs should also be visibel on the service details page of the admin area
add a button on the main service area to view the event logs for the service

# event log type
add a section on the catalogs to update the event log types
