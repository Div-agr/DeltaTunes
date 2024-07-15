const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const UserModel = require('./models/users');
const PlaylistModel = require('./models/playlist');
const UserActivity = require('./models/userActivity');

let userEmail;

// Middlewares
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/Dtunes", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.post("/auth", (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .populate('playlists') // Populate playlists
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json({ message: "Success", user });
                    userEmail=user.email;
                } else {
                    res.json("The password is incorrect");
                }
            } else {
                res.json("No record registered");
            }
        })
        .catch(err => {
            console.error('Error during authentication:', err);
            res.status(500).json(err);
        });
});

app.post("/signup", (req, res) => {
    const { email, name, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                res.status(400).json({ message: "Email already in use" });
            } else {
                UserModel.create({ email, name, password })
                    .then(user => res.json(user))
                    .catch(err => {
                        console.error('Error during signup:', err);
                        res.status(500).json(err);
                    });
            }
        })
        .catch(err => {
            console.error('Error during email check:', err);
            res.status(500).json(err);
        });
});

app.post("/check-email", (req, res) => {
    const { email } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                res.json({ isUnique: false });
            } else {
                res.json({ isUnique: true });
            }
        })
        .catch(err => {
            console.error('Error during email check:', err);
            res.status(500).json(err);
        });
});

// Playlist routes
app.get('/playlists', async (req, res) => {
    try {
        const playlists = await PlaylistModel.find({email: userEmail});
        res.json(playlists);
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).json({ message: 'Error fetching playlists', error });
    }
});

app.post('/playlists', async (req, res) => {
    try {
        const { name, isPublic, songs, image } = req.body;
        const newPlaylist = new PlaylistModel({ name, isPublic, songs, image, email:userEmail });
        await newPlaylist.save();

        UserModel.findOne({email: userEmail})
            .then(user => {
                user.playlists.push(newPlaylist._id);
                user.save();
                res.status(201).json(newPlaylist);
            })
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ message: 'Error creating playlist', error });
    }
});

app.get('/all-playlists', async (req, res) => {
    try {
        const playlists = await PlaylistModel.find();
        res.json(playlists);
    } catch (error) {
        console.error('Error fetching all playlists:', error);
        res.status(500).json({ message: 'Error fetching all playlists', error });
    }
});

app.get('/lyrics', async (req, res) => {
    const { songName, artistName } = req.query;
    try {
        const fetch = await import('node-fetch').then(module => module.default); // Dynamic import
        const response = await fetch(`https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${encodeURIComponent(songName)}&q_artist=${encodeURIComponent(artistName)}&apikey=f76aa71e7fba10c1bf7967f4e28752da`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        res.status(500).json({ error: 'Error fetching lyrics' });
    }
});

// Endpoint to search for users
app.get('/users/search', async (req, res) => {
    try {
        const { name } = req.query;
        const users = await UserModel.find({ name: new RegExp(name, 'i') }).select('name email');
        res.json(users);
    } catch (err) {
        console.error('Error searching users:', err);
        res.status(500).json({ error: 'Error searching users' });
    }
});

app.get('/users/:userId', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId)
            .populate('followers', 'name email')
            .populate('following', 'name email')
            .populate('playlists')
            .select('-password'); // Exclude password

        // Fetch playlists separately
        const playlists = await PlaylistModel.find({ email: user.email });

        res.json({ user, playlists });
    } catch (err) {
        console.error('Error fetching user info:', err);
        res.status(500).json({ error: 'Error fetching user info' });
    }
});

// Endpoint to follow a user
app.put('/friends/follow', async (req, res) => {
    const { userId, followId } = req.body;
    try {
        await UserModel.findByIdAndUpdate(userId, { $addToSet: { following: followId } });
        await UserModel.findByIdAndUpdate(followId, { $addToSet: { followers: userId } });
        res.json({ message: 'Followed successfully!' });
    } catch (err) {
        console.error('Error following user:', err);
        res.status(500).json({ error: 'Error following user' });
    }
});

// Endpoint to unfollow a user
app.put('/friends/unfollow', async (req, res) => {
    const { userId, unfollowId } = req.body;
    try {
        await UserModel.findByIdAndUpdate(userId, { $pull: { following: unfollowId } });
        await UserModel.findByIdAndUpdate(unfollowId, { $pull: { followers: userId } });
        res.json({ message: 'Unfollowed successfully!' });
    } catch (err) {
        console.error('Error unfollowing user:', err);
        res.status(500).json({ error: 'Error unfollowing user' });
    }
});

// Record user activity
app.post('/listen', async (req, res) => {
    const { userId, genre, artistName, language, listenedAt } = req.body;

    try {
        const userActivity = new UserActivity({ userId, genre, artistName, language, listenedAt });
        await userActivity.save();
        res.json({ message: 'Activity recorded successfully' });
    } catch (err) {
        console.error('Error recording activity:', err);
        res.status(500).json({ error: 'Error recording activity' });
    }
});

// Fetch user activity for charts
app.get('/charts', async (req, res) => {
    const { userId, startDate, endDate } = req.query;

    // Check for missing parameters
    if (!userId || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ensure the end date includes the entire day
    end.setHours(23, 59, 59, 999);

    // Validate date objects
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
    }

    try {
        const activities = await UserActivity.find({
            userId,
            listenedAt: { $gte: start, $lte: end }
        });

        if (!activities.length) {
            return res.status(404).json({ message: 'No activities found for the given date range' });
        }

        const genreCounts = {};
        const artistCounts = {};
        const languageCounts = {};
        const totalSongs = activities.length;

        activities.forEach(activity => {
            if (activity.genre) genreCounts[activity.genre] = (genreCounts[activity.genre] || 0) + 1;
            if (activity.artistName) artistCounts[activity.artistName] = (artistCounts[activity.artistName] || 0) + 1;
            if (activity.language) languageCounts[activity.language] = (languageCounts[activity.language] || 0) + 1;
        });

        const genreDistribution = Object.keys(genreCounts).map(genre => ({
            genre,
            percentage: (genreCounts[genre] / totalSongs) * 100
        }));

        const artistDistribution = Object.keys(artistCounts).map(artist => ({
            artist,
            percentage: (artistCounts[artist] / totalSongs) * 100
        }));

        const languageDistribution = Object.keys(languageCounts).map(language => ({
            language,
            percentage: (languageCounts[language] / totalSongs) * 100
        }));

        res.json({ genreDistribution, artistDistribution, languageDistribution });
    } catch (err) {
        console.error('Error fetching user activity:', err);
        res.status(500).json({ error: 'Error fetching user activity' });
    }
});


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
