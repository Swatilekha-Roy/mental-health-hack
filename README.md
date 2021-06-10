# Zen Bubble
A web app for making community mental health help accessible and easier, with nearest locations to professional help as well as other resources.

### Live demo link
https://zen-bubble.herokuapp.com/

## Technologies Used:
- Front-end was designed using Express, CSS3, Javascript, Jquery and Bootstrap framework.
- Back-end was supported using Node.js
- MongoDB database is used to store the registered users and their details as well as a temporary database for matched users in community help page.
- We used bcrypt.js to hash the passwords in our database to ensure security of out users against any kind of data breach
- We used passport.js to authenticate our users
- Azure Maps was used to render the nearest professional help resourses on a map of the current location of the user
- npm sentiment Analysis API to analyse the sentiment of the feelings submitted by the user and determine a score on a scale of -5 to +5. This score is then used to match - users with contrasting scores who are willing, to have a conversation such that the user with a positive score can help out a peer with a negative one.
- Pusher.js was used to implement the push notifications system for our chat rooms.
- We used Canva to create our app logo as well as all the badges which are earned via the point system.

## How to run?
Please enter the following commands on your command prompt:

`npm i`

`npm run dev` or `node app.js`

Your web app should be running on `localhost:3000`.
