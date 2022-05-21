const router = require("express").Router();
const Post = require("../model/Post");
const Favorite = require("../model/Favorite");
const bcrypt = require("bcrypt");
const User = require("../model/User");
const ObjectId = require("mongodb").ObjectId;

let currUser = {
  _id: "",
  username: "",
  email: "",
};

router.use((req, res, next) => {
  if (req.query._method === "DELETE") {
    console.log("DELETE");
    req.method = "DELETE";
    req.url = req.path;
  }
  next();
});

router.get("/", async (req, res) => {
  if (currUser.email) {
    try {
      const posts = await Post.find();
      const findFavorite = await Favorite.find({
        email: currUser.email,
      });
      res.render("index", { model: posts, favs: findFavorite });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/create", (req, res) => {
  res.render("create", { model: {}, username: currUser.username });
});

router.post("/create", async (req, res) => {
  try {
    const newPost = new Post({
      username: req.body.Username,
      title: req.body.Title,
      contents: req.body.Contents,
    });
    await newPost.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/update/:id", async (req, res) => {
  const id = req.params.id;
  const objId = new ObjectId(id);
  await Post.findOne({
    _id: objId,
  }).then((result) => {
    res.render("update", { model: result, username: result.username });
  });
});

router.post("/update/:id", async (req, res) => {
  const id = req.params.id;
  const objId = new ObjectId(id);
  await Post.findOneAndUpdate(
    { _id: objId },
    {
      $set: {
        title: req.body.Title,
        contents: req.body.Contents,
        image: req.body.Image,
      },
    }
  ).then((result) => {
    res.redirect("/");
  });
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const objId = new ObjectId(id);
  await Post.findOneAndDelete({
    _id: objId,
  }).then((result) => {
    res.redirect("/");
  });
});

router.get("/favorite/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const newFavorite = new Favorite({
      id,
      user: currUser.email,
    });
    await newFavorite.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/deletefav/:id", async (req, res) => {
  const id = req.params.id;
  await Favorite.findOneAndDelete({
    id,
  }).then((result) => {
    res.redirect("/");
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      res.status(400).json("Please check your account.");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).json("Please check your account.");
    }

    const userInfo = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };
    currUser = userInfo;
    res.redirect("/");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", (req, res) => {
  currUser = {
    _id: "",
    username: "",
    email: "",
  };
  res.redirect("/");
});

module.exports = router;
