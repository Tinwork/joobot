
<div style="display: flex; align-item:center">
  <img src="https://upload.wikimedia.org/wikipedia/fr/thumb/3/31/Logo_GFI_2011.jpg/280px-Logo_GFI_2011.jpg">
  <img src="http://54.77.243.23/static/assets/img/rabbot/banniere.png" style="display: block; width: 100px;">
</div>

# Dashboard - GFI Recrutement

This is our application for GFI Recrutement. <br />
The dashboard allows GFI recruitment services to configure questions / profiles and bots.
## Dependencies
- node v6.10.2
- npm v3.10.10 
## Roadmap 
```
> cd ./root_path
> npm install
> npm start
> On your favorite navigator : http://localhost:3000
```
## Flow Application
### Create new profile 
- Click on the tab "Profils métiers" and the button "Créer un nouveau profil"
- Fill the form and select one rabbot : developer, designer, chief project.
- Valid the form
### Create new questions 
- Click on the tab "Rédiger les questions" and the button "Ajouter une nouvelle question"
- Fill the first inputs of the form and valid your current questions
- After that, you have 3 options of questions : open, blank and selectbox
- Choose the question type and continue to fill the form
- Valid 
### Configure the rabbot : associate questions with a job 
- Click on the tab "Bot" and the button "Créer un nouveau bot"
- In this panel, you can associate a job with a list of questions.
- Select the right choices
- Valid
### Rabbot in action :
- [rabbot](https://github.com/Aktanee/rabbot)
### Candidature
- Click on the tab "Candidature"
- Here, you can saw all the future candidate who came from Rabbot.
- You view their profile and valid/delete.
