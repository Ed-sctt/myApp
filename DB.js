const crypto = require('crypto'); // for generating session token
const express = require('express'); // router management
const mongoose = require('mongoose');
const session = require('express-session'); // for session management
const MongoStore = require('connect-mongo');

const path = require('path');
const app = express();
const port = 2445;


app.use(express.json());



app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'myApp'))); // to use static files like css + adjustment of path

const uri = 'mongodb+srv://movie24:movie24@cluster0.i7cbtlr.mongodb.net/myApp'
const param = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
}

app.use(session({
  secret: 'e2da4c3f942dd8242839fac6ed54bd747c5f0324cbae583f9bf1ba828a65513f',
  store: MongoStore.create({
    mongoUrl: uri,
    mongoOptions: param// See below for details
  })
}));







mongoose.connect(uri, param)
  .then(() => {
    console.log('Connected to server database');
  })
  .catch((e) => {
    console.log(e.message);
  });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  sessionToken:{
    type: String,
    required: true
  }
});

const schema_tracks = new mongoose.Schema({
  track: {
    type: String,
    required: true
  }});

const schema_artist = new mongoose.Schema({ 
  artist:{
  type: String,
  required: true
}});

const schema_album = new mongoose.Schema({
  album: {
  type: String,
  required: true
}});

const schema_playlist = new mongoose.Schema({
  playlist: {
  type: String,
  required: true
  }
});

const collection_tracks = mongoose.model('tracks', schema_tracks);
const collection_artist = mongoose.model('artists', schema_artist);
const collection_album = mongoose.model('albums', schema_album);
const collection_playlist = mongoose.model('playlists', schema_playlist);  
const collection = mongoose.model('myApp', userSchema);

//app.get('/signup', (req, res) => {
 // res.render('signup');
//});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  app.use(express.static(__dirname + '/')); // css
  });

//app.get('/signin', (req, res) => {
 // res.render('signin.html');
//});

app.post('/signout', (req, res) => {
  res.render('index.html');
});



app.post('/signup', async (req, res) => { // revvoir the token adding part conflict with signin
  const { email, password } = req.body;
  try {
    const mycollection = new collection({
      email: req.body.email, // Changed req.email to req.body.email
      password: req.body.password,
      sessionToken: crypto.randomBytes(32).toString('hex')
    })
      req.session.email = req.body.email;
      req.session.password = req.body.password;
      

      await mycollection.save(); // save and insert into database
      console.log('mycollection saved')
      res.status(201).sendFile(__dirname + '/signin.html');
      app.use(express.static(__dirname + '/'));
      //res.send('User created successfully');
  }catch(error) {
    res.status(500).send('Error creating user'); // msg apparait sur frontend
  }
});

 function juj (){
  app.post('/signin', async (req, res) => {
    
    try {
      const mycollection = await collection.findOne({email:req.body.email});
      if (mycollection.password === req.body.password) {
        res.status(201).sendFile((__dirname + '/signin.html'));
        app.use(express.static(__dirname + '/')); // css
        
      } else {
        res.send('Wrong email or password');
      }
    } catch (error) {
      res.status(500).send('Error signing in');
    }
  });
 }


app.get('/signout', async(req,res) => {

});



app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await collection.findOne({ username, password });

    if (user) {
      const sessionToken = crypto.randomBytes(32).toString('hex');
      await collection.updateOne({ email:req.body.email}, { $set: { sessionToken } });

      //res.json({ message: 'Login successful', sessionToken });
      res.status(201).sendFile((__dirname + '/signin.html'));
      app.use(express.static(__dirname + '/')); // css
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/logout', async (req, res) => {
 // try {
  const sessionToken = req.headers['x-session-token'];

   // if (!sessionToken) {
     // return res.status(401).json({ message: 'Unauthorized' });
   // }

    //const user = await collection.findOne({ sessionToken });

    //if (!user) {
      //return res.status(401).json({ message: 'Invalid session token' });
    //}

    await collection.updateOne(
      { sessionToken },
      { $set: { sessionToken: null } }
    );

    //res.json({ message: 'Logged out successfully' });
    res.status(201).sendFile((__dirname + '/index.html'));
    app.use(express.static(__dirname + '/')); // css
  //} catch (error) {
    //console.error('ERROR');
  //  res.status(500).json({ message: 'Internal server error' });
  //}
});



async function add_token(){
  const users = await collection.find({});

  for (const user of users) {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    await collection.updateOne({ _id: user._id }, { $set: { sessionToken } });
  }
  const l = collection.findandUpdate({_id: user._id},{$set: {sessionToken:1}});
  return console.log(l);
}


app.post('/music_finder', async (req, res) => {

  app.use(express.urlencoded({ extended: true })); // to use req.body
  const item = req.body.search; // value in search bar search = name of the input in html file
  const filter = req.body.filter; // value in search bar search = name of the input in html file
  console.log(filter);
  
  // Store the data in the session
  //req.body.item = item;
  //req.session.filter = filter;

  // tracks
  if (filter === 'tracks'){
      try {
        const newTrack = await collection_tracks.create({ track: item});
       // const session = {
         // tracks:item 
       // }
        //await mongoose.connect().sessions.insertOne({  
         // sessionId: 'Ijhck6Qks1m2gutx_ZPU-de2hfSKk_2d', // from mongodb
          //userId: '654a21fc5e6b3857ecbd3c3d',// from mongodb
          // Other session-related data
          //tracks : session.tracks
        //});


        if (newTrack) {
          //res.status(201).send('Track inserted successfully');
          console.log('Track inserted successfully');
        } else {
          res.status(500).send('Error inserting track');
        }
      } catch (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    }
  }

  // artists 
  else if(filter === 'artists'){

    try {
      const newTrack = await collection_artist.create({ artist : req.session.item });
    
      if (newTrack) {
        
        console.log('Artist inserted successfully');
      } else {
        res.status(500).send('Error inserting artist');
      }
    } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
    }
  }

  // albums
  else if(filter === 'albums'){
    try {
      const newTrack = await collection_album.create({ album: req.session.item });
    
      if (newTrack) {
        
        console.log('album inserted successfully');
      } else {
        res.status(500).send('Error inserting album');
      }
    } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
    }
    // playlists 
  }else if(filter === 'playlists') {
    try {
      const newTrack = await collection_playlist.create({ playlist: req.session.item });
    
      if (newTrack) {
        
        console.log('playlist inserted successfully');
      } else {
        res.status(500).send('Error inserting playlist');
      }
    } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
    }
  }
  else{
    console.error('Error:filter term is undefined');  
  }
});

app.listen(port, () => { // start the server
  console.log(`Server is running on port ${port}`);
});
