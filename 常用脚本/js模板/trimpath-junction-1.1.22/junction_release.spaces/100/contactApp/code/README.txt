Steps to create the contact sample application...

- change to an existing team space directory...
  - cd junction_release.spaces/100

- create directories for code...
  - mkdir -p contactApp/code/app/models
  - mkdir -p contactApp/code/app/controllers
  - mkdir -p contactApp/code/app/views
  - mkdir -p contactApp/code/db/migrate
  - cd contactApp/code

- create a migration script that creates the Contact table...
  - see: db/migrate/0001_contact.js

- create Contact model code...
  - see: app/models/contact.js

- create ContactController code...
  - see: app/controllers/contactController.js

- create view code...
  - see: app/views/contact/index.est
  - see: app/views/contact/newInstance.est
  - see: app/views/contact/show.est
  - see: app/views/contact/edit.est

- create default layout....
  - see: apps/views/layouts/default.est

- create Home controller
  - see: apps/controllers/homeController.js

- To execute the app in the web-application server...
  - http://localhost:8080/engines/100/apps/contactApp

- To execute the app in the web-browser...
  - http://localhost:8080/engines/100/apps/contactApp;start

-----
ISSUES:
  - Need to create all those views, even though there's scaffold.
  - errors().fullMessages() doesn't work
  - Need HomeController (home/start).

