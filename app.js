// Imports
require("dotenv").config({ path: ".env" });
//require('dotenv').config();
const webPush = require("web-push");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
// const http = require('http');
const ejs = require("ejs");
var Sentiment = require("sentiment");
require("./db/conn");
require("dotenv").config();

const { resolveSoa } = require("dns");

//import { meditationsc } from "./public/js/meditate.js";

//console.log(meditationsc);

const formatMessage = require("./utils/messages");

// Intialize the app
const app = express();

//passport authentication
var User = require("./db/models/users");
var Match = require("./db/models/match");
var MatchUser = require("./db/models/match");
var passport = require("passport");
var localStrategy = require("passport-local"),
  methodOverride = require("method-override");
app.use(
  require("express-session")({
    secret: "This is the decryption key",
    resave: false,
    saveUninitialized: false,
  })
);

// Database connect
mongoose.connect("mongodb+srv://chehak:123@cluster0.ohkb1.mongodb.net/UserDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(methodOverride("_method"));
app.use(passport.initialize()); //use to use passport in our code
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Socket.io imports
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);

// Template engine
app.set("view engine", "ejs");

// For parsing application/json
app.use(bodyParser.json());

// Loading static files
app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  //res.locals.error=req.flash("error");
  //res.locals.success=req.flash("success");
  next();
});
var authRoutes = require("./routes/auth.js");
var counter = 0;
app.use("/", authRoutes);

// Homepage rendering
app.get("/", function (req, res) {
  res.render("index", { currentUser: req.user });
});

// Pusher keys
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
webPush.setVapidDetails(
  "mailto:nandini.jain.cd.eee19@itbhu.ac.in",
  publicVapidKey,
  privateVapidKey
);

app.post("/subscribe", (req, res) => {
  const subscription = req.body;

  res.status(201).json({});

  const payload = JSON.stringify({
    title: "Join room ID 123 for community help",
  });
  webPush
    .sendNotification(subscription, payload)
    .catch((error) => console.error(error));
});

//Meditation room
app.get("/meditate", (req, res) => {
  res.render("meditate");
});

app.get("/medroom", (req, res) => {
  res.render("medroom");
});


const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  uniqueUser,
} = require("./utils/users");

const botName = "Zen Bubble";

// Run when client connects
io.on("connection", (socket) => {
  // check user is unique
  socket.on("newUser", (username) => {
    if (!uniqueUser(username)) {
      console.log("Username checks out! Welcome");
      // user is unique
      socket.emit("uniqueUser");
    } else {
      console.log("Sorry, username is already in use");
      socket.emit("duplicateUser");
    }
  });

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // Welcome current user
    socket.emit(
      "message",
      formatMessage(botName, "Welcome!")
    );

    // Broadcast to all connections except the current connection joining
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chat messages
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // User disconnecting
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

//Community Room

// app.get("/room_container", (req, res) => {
//   res.render("room_container");
// });
app.get("/room", (req, res) => {
  res.render("room");
});

// Leaderboard page rendering
app.get("/leaderboard", function (req, res) {
  const result = User.find().sort({ score: -1 });
  const query = result.find({ score: { $gt: 0 } });
  query.find({}, function (err, users) {
    res.render("leaderboard", { users: users });
  });
});

// Community help page rendering
var result;

app.post("/community", function (req, res) {
  console.log(req.body.emotiontxt);

  /* Sentiment analysis */
  var options = {
    extras: {
      feeling: 0,
      sunny: 2,
    },
  };

  const emotiontext = req.body.emotiontxt;
  var sentiment = new Sentiment();
  result = sentiment.analyze(emotiontext, options).comparative;
  console.log(result);
  var name = req.user.name;
  var username = req.user.username;
  var score = req.user.score;
  var feeling = result;
  Match.create(
    {
      name: name,
      username: username,
      score: score,
      feeling: result,
    },
    function (err, newlyCreated) {
      if (err) {
        console.log(err);
      } else;
      //console.log(newlyCreated);
    }
  );

  console.log(result);
  /*res.render("community",{result:result});*/

  /* if(result<0){
      var query=MatchUser.find({ score: { $gt: -1 } });
   }else{
      var query=MatchUser.find({ score: { $lt: 0 } });
   }*/
  if (result < 0) {
    Match.findOneAndDelete({feeling: {$gte:0} }, function (err, user) {
      if (err){
          console.log(err)
      }
      else{
if(user!=null){
        Match.findOneAndDelete({username:req.user.username},function(err,userf){
          if(err) console.log(err)
          else
          console.log("Deleted Matching user");
        })
        counter++;
          console.log("Deleted User : ", user);}
      }
  });
    /*Match.find({ feeling: 1 }, function (err, queries) {
      counter++;
      console.log(queries);
      res.render("community", { query: queries, result: result });
    });*/
  } else {
    /*counter++;
    //var query=Match.find({ score: { $lt: 0 } });
    //var query=Match.find({ score:-1} );
    Match.find({ feeling: -1 }, function (err, queries) {
      console.log(queries);
      res.render("community", { query: queries, result: result });
    });*/
    Match.findOneAndDelete({feeling: { $lt: 0} }, function (err, user) {
      if (err){
          console.log(err)
      }
      else{
        if(user!=null){
        Match.findOneAndDelete({username:req.user.username},function(err,userf){
          if(err) console.log(err)
          else
          console.log("Deleted Matching user");
        })
        counter++;
          console.log("Deleted User : ", user);}
      }
  });
  }
  res.render("community",{query: [],result:result});
});
/*query.find({},function(err,queries){
     console.log(queries)
     res.render("community", {query:queries,result:result})
     });
     res.render("community",{result:result});
    // res.ren/der("community",{result:result});
    //return res.redirect("index");
  });*/

app.get("/community", (req, res) => {
  // const query
  // res.render("community",{
  //   result:result
  // });
  if (result < 0) {
    var query = MatchUser.find({ score: { $gt: -1 } });
  } else {
    var query = MatchUser.find({ score: { $lt: 0 } });
  }

  query.find({}, function (err, query) {
    res.render("community", { query: query, result: result });
  });
});

result = 0;

// Journal page rendering
app.get("/journal", (req, res) => {
  res.render("journal");
});

// Blog pages rendering
app.get("/blog1", (req, res) => {
  res.render("blog1");
});
app.get("/blog2", (req, res) => {
  res.render("blog2");
});
app.get("/blog3", (req, res) => {
  res.render("blog3");
});

// Feedback page rendering
app.get("/feedback", (req, res) => {
  res.render("feedback");
});

// Profile page rendering
app.get("/profile", (req, res) => {
  res.render("profile");
});

// Socket.io
io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

// Community Room

const rooms = {};

app.get("/room_container", (req, res) => {
  res.render("room_container", { rooms: rooms });
});

app.post("/room", (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect("/");
  }
  rooms[req.body.room] = { users:users};
  res.redirect(req.body.room);
  // Send message that new room was created
  io.emit("room-created", req.body.room);
});

app.get("/:room", (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect("/");
  }
  res.render("room", { roomName: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("new-user", (room, name) => {
    socket.join(room);
    rooms[room].users[socket.id] = name;
    socket.to(room).broadcast.emit("user-connected", name);
  });
  socket.on("send-chat-message", (room, message) => {
    socket
      .to(room)
      .broadcast.emit("chat-message", {
        message: message,
        name: rooms[room].users[socket.id],
      });
  });
  socket.on("disconnect", () => {
    getUserRooms(socket).forEach((room) => {
      socket
        .to(room)
        .broadcast.emit("user-disconnected", rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id];
    });
  });
});

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}

// Ports
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Lazy bum on Port ${PORT}`);
});
